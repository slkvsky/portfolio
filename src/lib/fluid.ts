/**
 * Self-contained WebGL fluid simulation (Navier–Stokes solver on GLSL).
 * Adapted from the well-known WebGL-Fluid-Simulation technique
 * (Pavel Dobryakov, public domain), trimmed to the core solver + shading and
 * tuned to the site's pink palette on a light background.
 *
 * Pointer movement injects velocity + colored dye ("splats"), so the field is
 * pushed around by the cursor. `initFluid` attaches its own RAF + pointer
 * listeners and returns a cleanup function.
 */

export type FluidHandle = {
  destroy: () => void
  resize: () => void
  /** Rebuild the hero-text mask (call after layout/font changes). */
  rebuildMask: () => void
  /** Pause the RAF loop (e.g. when the hero scrolls out of view). */
  pause: () => void
  /** Resume the RAF loop. */
  resume: () => void
  /** Inject a splat at normalized coords (0..1, y from bottom). */
  splat: (x: number, y: number, dx: number, dy: number) => void
}

type Config = {
  SIM_RESOLUTION: number
  DYE_RESOLUTION: number
  DENSITY_DISSIPATION: number
  VELOCITY_DISSIPATION: number
  PRESSURE: number
  PRESSURE_ITERATIONS: number
  CURL: number
  SPLAT_RADIUS: number
  SPLAT_FORCE: number
  /** base grayscale dye per splat (scaled by pointer speed) */
  DYE_AMOUNT: number
  // --- dithered-noise rendering ---
  /** global fluid influence on the dither (0..1) */
  FLUID_AMOUNT: number
  /** grain palette: 0 = more contrast, 1 = softer */
  LIGHT: number
  /** accent color for the fluid dye, 0..1 rgb */
  PINK: [number, number, number]
}

// Values lifted from the reference (incredibles.dev b-fluid): a deliberately
// calm fluid — no vorticity, no pressure projection, gentle force — so it never
// looks "on fire". The life comes from the animated noise, not the fluid.
const DEFAULTS: Config = {
  SIM_RESOLUTION: 128,
  DYE_RESOLUTION: 256,
  // lower dissipation → the trail lingers and fades more slowly (feels calmer)
  DENSITY_DISSIPATION: 1.3,
  // higher velocity dissipation → the motion dies sooner, so dye doesn't drift far
  VELOCITY_DISSIPATION: 0.62,
  PRESSURE: 0,
  PRESSURE_ITERATIONS: 12,
  CURL: 0,
  SPLAT_RADIUS: 0.2,
  // gentler push → the pink spreads slower and stays closer to the cursor
  SPLAT_FORCE: 480,
  DYE_AMOUNT: 0.15,
  FLUID_AMOUNT: 1,
  LIGHT: 0,
  PINK: [0.961, 0.686, 0.686], // #f5afaf
}

type GL = WebGL2RenderingContext | WebGLRenderingContext

type Ext = {
  formatRGBA: { internalFormat: number; format: number } | null
  formatRG: { internalFormat: number; format: number } | null
  formatR: { internalFormat: number; format: number } | null
  halfFloatTexType: number
  supportLinearFiltering: boolean | null
}

type FBO = {
  texture: WebGLTexture
  fbo: WebGLFramebuffer
  width: number
  height: number
  texelSizeX: number
  texelSizeY: number
  attach: (id: number) => number
}

type DoubleFBO = {
  width: number
  height: number
  texelSizeX: number
  texelSizeY: number
  read: FBO
  write: FBO
  swap: () => void
}

// ------------------------------------------------------------------ shaders

const baseVertexShader = `
  precision highp float;
  attribute vec2 aPosition;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform vec2 texelSize;
  void main () {
    vUv = aPosition * 0.5 + 0.5;
    vL = vUv - vec2(texelSize.x, 0.0);
    vR = vUv + vec2(texelSize.x, 0.0);
    vT = vUv + vec2(0.0, texelSize.y);
    vB = vUv - vec2(0.0, texelSize.y);
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`

const clearShader = `
  precision mediump float;
  precision mediump sampler2D;
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform float value;
  void main () { gl_FragColor = value * texture2D(uTexture, vUv); }
`

// Noise pass — the slowly-flowing fractal-noise field, rendered ONCE per frame
// into a small (block-resolution) texture. In the original this ran per display
// pixel, but `base` is constant per dither-block, so computing it per block is
// mathematically identical and ~25× cheaper (critical for Safari on retina).
const noiseShaderSource = `
  precision highp float;
  varying vec2 vUv;
  uniform float u_time;
  uniform vec2 u_resolution;   // display resolution (for aspect only)

  float hash(vec2 p) {
    p = fract(p * vec2(127.1, 311.7));
    p += dot(p, p.yx + 19.19);
    return fract(p.x * p.y);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }
  float fbm(vec2 p, float time) {
    float value = 0.0;
    float amplitude = 0.5;
    float phase = time * 0.015;
    for (int i = 0; i < 2; i++) {
      value += amplitude * noise(p);
      float fi = phase + float(i) * 0.5;
      p = p * 1.5 + vec2(12.7 + cos(fi) * 0.5, 4.3 + sin(fi) * 0.5);
      amplitude *= 0.5;
    }
    return value;
  }
  float shapeNoise(vec2 p, float time) {
    vec2 offset = vec2(fbm(p + vec2(7.1, -3.9), time) - 0.5) * 3.0;
    return fbm(p + offset, time);
  }
  void main () {
    vec2 centeredUv = vUv - 0.5;
    centeredUv.x *= u_resolution.x / max(u_resolution.y, 1.0);
    float t = u_time * 0.03;
    vec2 flow = vec2(t, -t * 0.65);
    vec2 noiseUv = vec2(centeredUv.x * 1.5, centeredUv.y * 1.5 * 0.45) + flow;
    float base = shapeNoise(noiseUv, u_time);
    base = (base - 0.5) * 6.0 + 0.5;
    base *= 1.5;
    base = clamp(base, 0.0, 1.0);
    gl_FragColor = vec4(base, 0.0, 0.0, 1.0);
  }
`

// Dithered-noise display (recreates incredibles.dev's b-fluid render): the
// precomputed noise (uNoise) is Bayer-dithered into a 2-tone grey grain; the
// fluid dye modulates it, revealing pink at the dense core; the hero text mask
// is composited on top with chromatic aberration.
const displayShaderSource = `
  precision highp float;
  precision highp sampler2D;
  varying vec2 vUv;
  uniform sampler2D uTexture;   // fluid dye (intensity)
  uniform sampler2D uNoise;     // precomputed ambient noise (block-res)
  uniform sampler2D uTextMask;  // hero text rendered white-on-black
  uniform float u_hasTextMask;  // 1 when the mask texture is ready
  uniform vec2 u_resolution;    // drawing-buffer size in px
  uniform float u_fluidAmount;  // global fluid influence (0..1)
  uniform float u_pixelRatio;
  uniform float u_light;        // 0 = more contrast grain, 1 = softer
  uniform vec3 uPink;           // accent colour (dye tint)

  float bayer4(vec2 pixelPos) {
    vec2 p  = mod(pixelPos, 4.0);
    vec2 p2 = mod(p, 2.0);
    vec2 p4 = floor(p * 0.5);
    float inner = 2.0 * (p2.x + p2.y - 2.0 * p2.x * p2.y) + p2.y;
    float outer = 2.0 * (p4.x + p4.y - 2.0 * p4.x * p4.y) + p4.y;
    return (4.0 * inner + outer) / 16.0;
  }

  void main () {
    // dither block grid
    float blockSize = 2.5 * u_pixelRatio;
    vec2 blockCoord = floor(gl_FragCoord.xy / blockSize);
    vec2 blockCenter = (blockCoord + 0.5) * blockSize;
    vec2 blockUv = blockCenter / u_resolution.xy;

    // ambient noise (precomputed per block)
    float base = texture2D(uNoise, blockUv).r;

    // fluid influence (dye stored at ~0.15 scale)
    float fluidLum = texture2D(uTexture, vUv).r;
    float fluidStrength = clamp(fluidLum / 0.15, 0.0, 1.0) * u_fluidAmount;

    // --- text mask + chromatic aberration (the "letters light up / 3D") ---
    // The mask is a top-down 2D canvas, so flip Y. R/G-B channels are sampled
    // at slightly offset positions (offset ∝ fluidStrength) → colour fringing
    // that grows as the fluid passes over the letters.
    float caAmount = fluidStrength * 17.0 / u_resolution.x;
    vec2 caDir = normalize(vec2(1.0, 0.4));
    vec2 caDirPerp = vec2(caDir.y, caDir.x);
    vec2 uvC = vec2(vUv.x, 1.0 - vUv.y);
    vec2 uvR = vec2(vUv.x + caDir.x * caAmount, 1.0 - (vUv.y + caDir.y * caAmount));
    vec2 uvG = vec2(vUv.x + caDirPerp.x * caAmount * 0.5, 1.0 - (vUv.y + caDirPerp.y * caAmount * 0.5));
    float mC = texture2D(uTextMask, uvC).r * u_hasTextMask;
    float mR = texture2D(uTextMask, uvR).r * u_hasTextMask;
    float mG = texture2D(uTextMask, uvG).r * u_hasTextMask;

    // dither: fluid does not erase the text region
    float modifiedBase = clamp(base - fluidStrength * (1.0 - mC), 0.0, 1.0);
    float threshold = (bayer4(blockCoord) - 0.5) * 2.0;
    float dithered = step(0.5, clamp(modifiedBase + threshold, 0.0, 1.0));

    vec3 darkColor  = mix(vec3(0.818), vec3(0.89), u_light);
    vec3 lightColor = mix(vec3(0.918), vec3(0.96), u_light);
    // squared curve: pink only at the dense core, never a washed-out halo
    float splatFade = fluidStrength * fluidStrength;
    vec3 tintedLight = mix(lightColor, uPink, splatFade * 0.9);
    vec3 bgColor = mix(darkColor, tintedLight, dithered);

    // text ink → tints toward pink under fluid
    vec3 textColor = vec3(0.169); // #2b2b2b
    vec3 textEffect = mix(textColor, uPink, fluidStrength * 0.9);

    // composite text over the background per-channel (the offsets give the CA)
    float R = mix(bgColor.r, textEffect.r, mR);
    float G = mix(bgColor.g, textEffect.g, mG);
    float B = mix(bgColor.b, textEffect.b, mG);

    gl_FragColor = vec4(R, G, B, 1.0);
  }
`

const splatShader = `
  precision highp float;
  precision highp sampler2D;
  varying vec2 vUv;
  uniform sampler2D uTarget;
  uniform float aspectRatio;
  uniform vec3 color;
  uniform vec2 point;
  uniform float radius;
  void main () {
    vec2 p = vUv - point.xy;
    p.x *= aspectRatio;
    vec3 splat = exp(-dot(p, p) / radius) * color;
    vec3 base = texture2D(uTarget, vUv).xyz;
    gl_FragColor = vec4(base + splat, 1.0);
  }
`

const advectionShader = `
  precision highp float;
  precision highp sampler2D;
  varying vec2 vUv;
  uniform sampler2D uVelocity;
  uniform sampler2D uSource;
  uniform vec2 texelSize;
  uniform vec2 dyeTexelSize;
  uniform float dt;
  uniform float dissipation;
  vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
    vec2 st = uv / tsize - 0.5;
    vec2 iuv = floor(st);
    vec2 fuv = fract(st);
    vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
    vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
    vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
    vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);
    return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
  }
  void main () {
  #ifdef MANUAL_FILTERING
    vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
    vec4 result = bilerp(uSource, coord, dyeTexelSize);
  #else
    vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
    vec4 result = texture2D(uSource, coord);
  #endif
    float decay = 1.0 + dissipation * dt;
    gl_FragColor = result / decay;
  }
`

const divergenceShader = `
  precision mediump float;
  precision mediump sampler2D;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform sampler2D uVelocity;
  void main () {
    float L = texture2D(uVelocity, vL).x;
    float R = texture2D(uVelocity, vR).x;
    float T = texture2D(uVelocity, vT).y;
    float B = texture2D(uVelocity, vB).y;
    vec2 C = texture2D(uVelocity, vUv).xy;
    if (vL.x < 0.0) { L = -C.x; }
    if (vR.x > 1.0) { R = -C.x; }
    if (vT.y > 1.0) { T = -C.y; }
    if (vB.y < 0.0) { B = -C.y; }
    float div = 0.5 * (R - L + T - B);
    gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
  }
`

const curlShader = `
  precision mediump float;
  precision mediump sampler2D;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform sampler2D uVelocity;
  void main () {
    float L = texture2D(uVelocity, vL).y;
    float R = texture2D(uVelocity, vR).y;
    float T = texture2D(uVelocity, vT).x;
    float B = texture2D(uVelocity, vB).x;
    float vorticity = R - L - T + B;
    gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
  }
`

const vorticityShader = `
  precision highp float;
  precision highp sampler2D;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform sampler2D uVelocity;
  uniform sampler2D uCurl;
  uniform float curl;
  uniform float dt;
  void main () {
    float L = texture2D(uCurl, vL).x;
    float R = texture2D(uCurl, vR).x;
    float T = texture2D(uCurl, vT).x;
    float B = texture2D(uCurl, vB).x;
    float C = texture2D(uCurl, vUv).x;
    vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
    force /= length(force) + 0.0001;
    force *= curl * C;
    force.y *= -1.0;
    vec2 velocity = texture2D(uVelocity, vUv).xy;
    velocity += force * dt;
    velocity = min(max(velocity, -1000.0), 1000.0);
    gl_FragColor = vec4(velocity, 0.0, 1.0);
  }
`

const pressureShader = `
  precision mediump float;
  precision mediump sampler2D;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform sampler2D uPressure;
  uniform sampler2D uDivergence;
  void main () {
    float L = texture2D(uPressure, vL).x;
    float R = texture2D(uPressure, vR).x;
    float T = texture2D(uPressure, vT).x;
    float B = texture2D(uPressure, vB).x;
    float divergence = texture2D(uDivergence, vUv).x;
    float pressure = (L + R + B + T - divergence) * 0.25;
    gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
  }
`

const gradientSubtractShader = `
  precision mediump float;
  precision mediump sampler2D;
  varying vec2 vUv;
  varying vec2 vL;
  varying vec2 vR;
  varying vec2 vT;
  varying vec2 vB;
  uniform sampler2D uPressure;
  uniform sampler2D uVelocity;
  void main () {
    float L = texture2D(uPressure, vL).x;
    float R = texture2D(uPressure, vR).x;
    float T = texture2D(uPressure, vT).x;
    float B = texture2D(uPressure, vB).x;
    vec2 velocity = texture2D(uVelocity, vUv).xy;
    velocity.xy -= vec2(R - L, T - B);
    gl_FragColor = vec4(velocity, 0.0, 1.0);
  }
`

// ------------------------------------------------------------------ helpers

function getWebGLContext(canvas: HTMLCanvasElement): { gl: GL; ext: Ext } | null {
  const params: WebGLContextAttributes = {
    // the display output is fully opaque now — an opaque canvas lets Safari
    // skip per-pixel alpha compositing with the page (big perf win there)
    alpha: false,
    depth: false,
    stencil: false,
    antialias: false,
    preserveDrawingBuffer: false,
  }

  let gl = canvas.getContext('webgl2', params) as WebGL2RenderingContext | null
  const isWebGL2 = !!gl
  if (!gl) {
    gl = (canvas.getContext('webgl', params) ||
      canvas.getContext('experimental-webgl', params)) as WebGL2RenderingContext | null
  }
  if (!gl) return null

  let halfFloat: OES_texture_half_float | null = null
  let supportLinearFiltering: OES_texture_half_float_linear | null = null
  if (isWebGL2) {
    gl.getExtension('EXT_color_buffer_float')
    supportLinearFiltering = gl.getExtension('OES_texture_float_linear')
  } else {
    halfFloat = gl.getExtension('OES_texture_half_float')
    supportLinearFiltering = gl.getExtension('OES_texture_half_float_linear')
  }

  gl.clearColor(0.0, 0.0, 0.0, 0.0)

  const halfFloatTexType = isWebGL2
    ? (gl as WebGL2RenderingContext).HALF_FLOAT
    : halfFloat
      ? halfFloat.HALF_FLOAT_OES
      : gl.UNSIGNED_BYTE

  let formatRGBA: Ext['formatRGBA']
  let formatRG: Ext['formatRG']
  let formatR: Ext['formatR']

  if (isWebGL2) {
    const g2 = gl as WebGL2RenderingContext
    formatRGBA = getSupportedFormat(gl, g2.RGBA16F, gl.RGBA, halfFloatTexType)
    formatRG = getSupportedFormat(gl, g2.RG16F, g2.RG, halfFloatTexType)
    formatR = getSupportedFormat(gl, g2.R16F, g2.RED, halfFloatTexType)
  } else {
    formatRGBA = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType)
    formatRG = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType)
    formatR = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType)
  }

  return {
    gl,
    ext: {
      formatRGBA,
      formatRG,
      formatR,
      halfFloatTexType,
      supportLinearFiltering: !!supportLinearFiltering,
    },
  }
}

function getSupportedFormat(
  gl: GL,
  internalFormat: number,
  format: number,
  type: number
): { internalFormat: number; format: number } | null {
  if (!supportRenderTextureFormat(gl, internalFormat, format, type)) {
    const g2 = gl as WebGL2RenderingContext
    switch (internalFormat) {
      case g2.R16F:
        return getSupportedFormat(gl, g2.RG16F, g2.RG, type)
      case g2.RG16F:
        return getSupportedFormat(gl, g2.RGBA16F, gl.RGBA, type)
      default:
        return null
    }
  }
  return { internalFormat, format }
}

function supportRenderTextureFormat(
  gl: GL,
  internalFormat: number,
  format: number,
  type: number
): boolean {
  const texture = gl.createTexture()
  gl.bindTexture(gl.TEXTURE_2D, texture)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, 4, 4, 0, format, type, null)

  const fbo = gl.createFramebuffer()
  gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D,
    texture,
    0
  )
  const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER)
  return status === gl.FRAMEBUFFER_COMPLETE
}

function compileShader(
  gl: GL,
  type: number,
  source: string,
  keywords?: string[]
): WebGLShader {
  const withKeywords = addKeywords(source, keywords)
  const shader = gl.createShader(type)!
  gl.shaderSource(shader, withKeywords)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn(gl.getShaderInfoLog(shader))
  }
  return shader
}

function addKeywords(source: string, keywords?: string[]): string {
  if (!keywords) return source
  let prefix = ''
  for (const keyword of keywords) prefix += `#define ${keyword}\n`
  return prefix + source
}

function createProgram(
  gl: GL,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
): WebGLProgram {
  const program = gl.createProgram()!
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  // the global quad buffer is bound to attribute location 0 (aPosition)
  gl.bindAttribLocation(program, 0, 'aPosition')
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn(gl.getProgramInfoLog(program))
  }
  return program
}

function getUniforms(gl: GL, program: WebGLProgram): Record<string, WebGLUniformLocation> {
  const uniforms: Record<string, WebGLUniformLocation> = {}
  const count = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS)
  for (let i = 0; i < count; i++) {
    const name = gl.getActiveUniform(program, i)!.name
    const loc = gl.getUniformLocation(program, name)
    if (loc) uniforms[name] = loc
  }
  return uniforms
}

class Program {
  uniforms: Record<string, WebGLUniformLocation>
  program: WebGLProgram
  private gl: GL
  constructor(gl: GL, vertexShader: WebGLShader, fragmentShader: WebGLShader) {
    this.gl = gl
    this.program = createProgram(gl, vertexShader, fragmentShader)
    this.uniforms = getUniforms(gl, this.program)
  }
  bind() {
    this.gl.useProgram(this.program)
  }
}

// ------------------------------------------------------------------ main

export function initFluid(
  canvas: HTMLCanvasElement,
  userConfig: Partial<Config> = {},
  maskRoot: HTMLElement | null = null
): FluidHandle | null {
  const config: Config = { ...DEFAULTS, ...userConfig }
  const ctx = getWebGLContext(canvas)
  if (!ctx) return null
  const { gl, ext } = ctx
  if (!ext.formatRGBA) return null

  const filtering = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST

  // full-screen triangle/quad buffer
  const blitVao = (() => {
    const buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]),
      gl.STATIC_DRAW
    )
    const elem = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, elem)
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array([0, 1, 2, 0, 2, 3]),
      gl.STATIC_DRAW
    )
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(0)
    return true
  })()
  void blitVao

  function blit(target: FBO | null) {
    if (target == null) {
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
      gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    } else {
      gl.viewport(0, 0, target.width, target.height)
      gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo)
    }
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0)
  }

  const baseVertex = compileShader(gl, gl.VERTEX_SHADER, baseVertexShader)
  const mk = (src: string, kw?: string[]) =>
    new Program(gl, baseVertex, compileShader(gl, gl.FRAGMENT_SHADER, src, kw))

  const clearProgram = mk(clearShader)
  const splatProgram = mk(splatShader)
  const advectionProgram = mk(
    advectionShader,
    ext.supportLinearFiltering ? undefined : ['MANUAL_FILTERING']
  )
  const divergenceProgram = mk(divergenceShader)
  const curlProgram = mk(curlShader)
  const vorticityProgram = mk(vorticityShader)
  const pressureProgram = mk(pressureShader)
  const gradienSubtractProgram = mk(gradientSubtractShader)
  const noiseProgram = mk(noiseShaderSource)
  const displayProgram = mk(displayShaderSource)
  // base dye is grayscale; the display shader supplies the pink
  const baseDye = { r: config.DYE_AMOUNT, g: config.DYE_AMOUNT, b: config.DYE_AMOUNT }

  // Safari's WebGL is much slower with big retina canvases, so cap DPR and the
  // frame rate there. Other browsers keep full resolution / 60fps.
  const ua = navigator.userAgent
  const isSafari =
    /safari/i.test(ua) && !/chrome|chromium|crios|android|fxios|edg/i.test(ua)
  const maxDpr = isSafari ? 1.5 : 2
  const targetFps = isSafari ? 40 : 0 // 0 = uncapped
  const frameInterval = targetFps > 0 ? 1000 / targetFps : 0

  const pixelRatio = Math.min(window.devicePixelRatio || 1, maxDpr)
  let uTime = 0 // elapsed seconds, drives the ambient noise flow

  // ---------------------------------------------------------------- text mask
  // Renders elements marked [data-fluid-text] within maskRoot into a 2D canvas
  // (white glyphs on black), uploaded as a GPU texture. The display shader uses
  // it so the fluid "lights up" the hero letters with chromatic aberration.
  const maskCanvas = document.createElement('canvas')
  const maskCtx = maskCanvas.getContext('2d')
  const maskTexture = gl.createTexture()
  let hasMask = false

  function initMaskTexture() {
    gl.bindTexture(gl.TEXTURE_2D, maskTexture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  }
  initMaskTexture()

  function buildMask() {
    if (!maskRoot || !maskCtx) return
    const els = maskRoot.querySelectorAll<HTMLElement>('[data-fluid-text]')
    if (!els.length) return

    const canvasRect = canvas.getBoundingClientRect()
    if (canvasRect.width === 0 || canvasRect.height === 0) return
    const sx = canvas.width / canvasRect.width
    const sy = canvas.height / canvasRect.height

    if (maskCanvas.width !== canvas.width || maskCanvas.height !== canvas.height) {
      maskCanvas.width = canvas.width
      maskCanvas.height = canvas.height
    }
    maskCtx.clearRect(0, 0, maskCanvas.width, maskCanvas.height)
    maskCtx.fillStyle = '#000'
    maskCtx.fillRect(0, 0, maskCanvas.width, maskCanvas.height)
    maskCtx.fillStyle = '#fff'
    maskCtx.textAlign = 'left'
    maskCtx.textBaseline = 'middle'

    const range = document.createRange()
    els.forEach((el) => {
      const cs = window.getComputedStyle(el)
      maskCtx.font = `${cs.fontStyle} ${cs.fontWeight} ${parseFloat(cs.fontSize) * sy}px ${cs.fontFamily}`
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
      let node: Node | null
      while ((node = walker.nextNode())) {
        const text = node.textContent ?? ''
        for (let i = 0; i < text.length; i++) {
          const ch = text[i]
          if (ch === ' ' || ch === '\n' || ch === '\t') continue
          range.setStart(node, i)
          range.setEnd(node, i + 1)
          const r = range.getBoundingClientRect()
          if (r.width === 0 || r.height === 0) continue
          const x = (r.left - canvasRect.left) * sx
          const y = ((r.top + r.bottom) / 2 - canvasRect.top) * sy
          maskCtx.fillText(ch, x, y)
        }
      }
    })

    gl.bindTexture(gl.TEXTURE_2D, maskTexture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, maskCanvas)
    hasMask = true
  }

  let dye: DoubleFBO
  let velocity: DoubleFBO
  let divergence: FBO
  let curl: FBO
  let pressure: DoubleFBO
  let noiseFbo: FBO

  function createFBO(w: number, h: number, internalFormat: number, format: number, type: number, param: number): FBO {
    gl.activeTexture(gl.TEXTURE0)
    const texture = gl.createTexture()!
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texImage2D(gl.TEXTURE_2D, 0, internalFormat, w, h, 0, format, type, null)

    const fbo = gl.createFramebuffer()!
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo)
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0)
    gl.viewport(0, 0, w, h)
    gl.clear(gl.COLOR_BUFFER_BIT)

    const texelSizeX = 1.0 / w
    const texelSizeY = 1.0 / h
    return {
      texture,
      fbo,
      width: w,
      height: h,
      texelSizeX,
      texelSizeY,
      attach(id: number) {
        gl.activeTexture(gl.TEXTURE0 + id)
        gl.bindTexture(gl.TEXTURE_2D, texture)
        return id
      },
    }
  }

  function createDoubleFBO(w: number, h: number, internalFormat: number, format: number, type: number, param: number): DoubleFBO {
    let fbo1 = createFBO(w, h, internalFormat, format, type, param)
    let fbo2 = createFBO(w, h, internalFormat, format, type, param)
    return {
      width: w,
      height: h,
      texelSizeX: fbo1.texelSizeX,
      texelSizeY: fbo1.texelSizeY,
      get read() {
        return fbo1
      },
      set read(v) {
        fbo1 = v
      },
      get write() {
        return fbo2
      },
      set write(v) {
        fbo2 = v
      },
      swap() {
        const temp = fbo1
        fbo1 = fbo2
        fbo2 = temp
      },
    }
  }

  function getResolution(resolution: number) {
    let aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight
    if (aspectRatio < 1) aspectRatio = 1.0 / aspectRatio
    const min = Math.round(resolution)
    const max = Math.round(resolution * aspectRatio)
    if (gl.drawingBufferWidth > gl.drawingBufferHeight) {
      return { width: max, height: min }
    }
    return { width: min, height: max }
  }

  function initFramebuffers() {
    const simRes = getResolution(config.SIM_RESOLUTION)
    const dyeRes = getResolution(config.DYE_RESOLUTION)
    const texType = ext.halfFloatTexType
    const rgba = ext.formatRGBA!
    const rg = ext.formatRG!
    const r = ext.formatR!

    dye = createDoubleFBO(dyeRes.width, dyeRes.height, rgba.internalFormat, rgba.format, texType, filtering)
    velocity = createDoubleFBO(simRes.width, simRes.height, rg.internalFormat, rg.format, texType, filtering)
    divergence = createFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST)
    curl = createFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST)
    pressure = createDoubleFBO(simRes.width, simRes.height, r.internalFormat, r.format, texType, gl.NEAREST)

    // noise FBO at dither-block resolution (one texel per block) — NEAREST so
    // each block reads a single value, exactly matching the old per-block math
    const blockSize = 2.5 * pixelRatio
    const nw = Math.max(2, Math.round(gl.drawingBufferWidth / blockSize))
    const nh = Math.max(2, Math.round(gl.drawingBufferHeight / blockSize))
    noiseFbo = createFBO(nw, nh, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, gl.NEAREST)
  }

  function resizeCanvas(): boolean {
    const dpr = Math.min(window.devicePixelRatio || 1, maxDpr)
    const w = Math.floor(canvas.clientWidth * dpr)
    const h = Math.floor(canvas.clientHeight * dpr)
    if (w > 0 && h > 0 && (canvas.width !== w || canvas.height !== h)) {
      canvas.width = w
      canvas.height = h
      return true
    }
    return false
  }

  resizeCanvas()
  initFramebuffers()
  buildMask()
  // fonts change glyph metrics — rebuild once they're ready
  if (document.fonts?.ready) document.fonts.ready.then(() => buildMask())

  // ---------------------------------------------------------------- stepping

  function step(dt: number) {
    gl.disable(gl.BLEND)

    // curl
    curlProgram.bind()
    gl.uniform2f(curlProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY)
    gl.uniform1i(curlProgram.uniforms.uVelocity, velocity.read.attach(0))
    blit(curl)

    // vorticity
    vorticityProgram.bind()
    gl.uniform2f(vorticityProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY)
    gl.uniform1i(vorticityProgram.uniforms.uVelocity, velocity.read.attach(0))
    gl.uniform1i(vorticityProgram.uniforms.uCurl, curl.attach(1))
    gl.uniform1f(vorticityProgram.uniforms.curl, config.CURL)
    gl.uniform1f(vorticityProgram.uniforms.dt, dt)
    blit(velocity.write)
    velocity.swap()

    // divergence
    divergenceProgram.bind()
    gl.uniform2f(divergenceProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY)
    gl.uniform1i(divergenceProgram.uniforms.uVelocity, velocity.read.attach(0))
    blit(divergence)

    // clear pressure
    clearProgram.bind()
    gl.uniform1i(clearProgram.uniforms.uTexture, pressure.read.attach(0))
    gl.uniform1f(clearProgram.uniforms.value, config.PRESSURE)
    blit(pressure.write)
    pressure.swap()

    // pressure solve
    pressureProgram.bind()
    gl.uniform2f(pressureProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY)
    gl.uniform1i(pressureProgram.uniforms.uDivergence, divergence.attach(0))
    for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
      gl.uniform1i(pressureProgram.uniforms.uPressure, pressure.read.attach(1))
      blit(pressure.write)
      pressure.swap()
    }

    // gradient subtract
    gradienSubtractProgram.bind()
    gl.uniform2f(gradienSubtractProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY)
    gl.uniform1i(gradienSubtractProgram.uniforms.uPressure, pressure.read.attach(0))
    gl.uniform1i(gradienSubtractProgram.uniforms.uVelocity, velocity.read.attach(1))
    blit(velocity.write)
    velocity.swap()

    // advect velocity
    advectionProgram.bind()
    gl.uniform2f(advectionProgram.uniforms.texelSize, velocity.texelSizeX, velocity.texelSizeY)
    if (!ext.supportLinearFiltering) {
      gl.uniform2f(advectionProgram.uniforms.dyeTexelSize, velocity.texelSizeX, velocity.texelSizeY)
    }
    gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.attach(0))
    gl.uniform1i(advectionProgram.uniforms.uSource, velocity.read.attach(0))
    gl.uniform1f(advectionProgram.uniforms.dt, dt)
    gl.uniform1f(advectionProgram.uniforms.dissipation, config.VELOCITY_DISSIPATION)
    blit(velocity.write)
    velocity.swap()

    // advect dye
    if (!ext.supportLinearFiltering) {
      gl.uniform2f(advectionProgram.uniforms.dyeTexelSize, dye.texelSizeX, dye.texelSizeY)
    }
    gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.attach(0))
    gl.uniform1i(advectionProgram.uniforms.uSource, dye.read.attach(1))
    gl.uniform1f(advectionProgram.uniforms.dissipation, config.DENSITY_DISSIPATION)
    blit(dye.write)
    dye.swap()
  }

  function render() {
    gl.disable(gl.BLEND)

    // 1) cheap ambient-noise pass into the small block-res texture
    noiseProgram.bind()
    gl.uniform1f(noiseProgram.uniforms.u_time, uTime)
    gl.uniform2f(noiseProgram.uniforms.u_resolution, gl.drawingBufferWidth, gl.drawingBufferHeight)
    blit(noiseFbo)

    // 2) full-res display pass (now cheap — samples noise instead of computing it)
    displayProgram.bind()
    const u = displayProgram.uniforms
    gl.uniform2f(u.u_resolution, gl.drawingBufferWidth, gl.drawingBufferHeight)
    gl.uniform1f(u.u_fluidAmount, config.FLUID_AMOUNT)
    gl.uniform1f(u.u_pixelRatio, pixelRatio)
    gl.uniform1f(u.u_light, config.LIGHT)
    gl.uniform3f(u.uPink, config.PINK[0], config.PINK[1], config.PINK[2])
    gl.uniform1i(u.uTexture, dye.read.attach(0))
    gl.uniform1i(u.uNoise, noiseFbo.attach(1))
    // text mask on unit 2
    gl.activeTexture(gl.TEXTURE2)
    gl.bindTexture(gl.TEXTURE_2D, maskTexture)
    gl.uniform1i(u.uTextMask, 2)
    gl.uniform1f(u.u_hasTextMask, hasMask ? 1 : 0)
    blit(null)
  }

  // ---------------------------------------------------------------- splats

  function splat(
    x: number,
    y: number,
    dx: number,
    dy: number,
    color: { r: number; g: number; b: number },
    radius: number
  ) {
    splatProgram.bind()
    gl.uniform1i(splatProgram.uniforms.uTarget, velocity.read.attach(0))
    gl.uniform1f(splatProgram.uniforms.aspectRatio, canvas.width / canvas.height)
    gl.uniform2f(splatProgram.uniforms.point, x, y)
    gl.uniform3f(splatProgram.uniforms.color, dx, dy, 0.0)
    gl.uniform1f(splatProgram.uniforms.radius, correctRadius(radius))
    blit(velocity.write)
    velocity.swap()

    gl.uniform1i(splatProgram.uniforms.uTarget, dye.read.attach(0))
    gl.uniform3f(splatProgram.uniforms.color, color.r, color.g, color.b)
    blit(dye.write)
    dye.swap()
  }

  function correctRadius(radius: number) {
    const aspectRatio = canvas.width / canvas.height
    return aspectRatio > 1 ? radius * aspectRatio : radius
  }

  // public splat: normalized coords + normalized velocity, full strength
  function splatPublic(x: number, y: number, dx: number, dy: number) {
    splat(x, y, dx, dy, baseDye, config.SPLAT_RADIUS / 100)
  }

  // ---------------------------------------------------------------- input

  // Single pointer, speed-driven: the faster the cursor moves, the stronger &
  // wider the splat (matches the reference). A still cursor injects nothing —
  // the ambient noise carries the motion instead.
  const pointer = {
    x: 0,
    y: 0,
    dx: 0,
    dy: 0,
    smoothSpeed: 0,
    moved: false,
    initialized: false,
  }

  function updatePointerMove(posX: number, posY: number) {
    const nx = posX / canvas.clientWidth
    const ny = 1.0 - posY / canvas.clientHeight
    if (!pointer.initialized) {
      pointer.initialized = true
      pointer.x = nx
      pointer.y = ny
      return
    }
    pointer.dx = nx - pointer.x
    pointer.dy = ny - pointer.y
    pointer.x = nx
    pointer.y = ny
    const speed = Math.hypot(pointer.dx, pointer.dy)
    pointer.smoothSpeed += (speed - pointer.smoothSpeed) * 0.15
    pointer.moved = Math.abs(pointer.dx) > 0 || Math.abs(pointer.dy) > 0
  }

  function pointerRelativePos(clientX: number, clientY: number) {
    const rect = canvas.getBoundingClientRect()
    return { x: clientX - rect.left, y: clientY - rect.top }
  }

  function onPointerMove(e: PointerEvent) {
    const { x, y } = pointerRelativePos(e.clientX, e.clientY)
    updatePointerMove(x, y)
  }

  function onTouchMove(e: TouchEvent) {
    const touch = e.targetTouches[0]
    if (!touch) return
    const { x, y } = pointerRelativePos(touch.clientX, touch.clientY)
    updatePointerMove(x, y)
  }

  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('touchmove', onTouchMove, { passive: true })

  function applyInputs() {
    if (!pointer.moved) return
    pointer.moved = false
    // normalized speed 0..1 (reference: speed*width/1920 / 0.02)
    const o = Math.min((pointer.smoothSpeed * (canvas.clientWidth / 1920)) / 0.02, 1)
    if (o <= 0.001) return

    const radius = (config.SPLAT_RADIUS / 100) * (0.55 + 0.45 * o)
    const vx = pointer.dx * config.SPLAT_FORCE
    const vy = pointer.dy * config.SPLAT_FORCE

    // Interpolate splats along the path travelled this frame so a fast flick
    // leaves one continuous, smooth stroke instead of spaced-out blobs.
    const prevX = pointer.x - pointer.dx
    const prevY = pointer.y - pointer.dy
    const dist = Math.hypot(pointer.dx, pointer.dy)
    const steps = Math.max(1, Math.min(Math.ceil(dist / 0.012), 10))
    // spread the dye across substeps so overlap doesn't over-accumulate
    const amt = (o / Math.sqrt(steps)) * 1.1
    const color = { r: baseDye.r * amt, g: baseDye.g * amt, b: baseDye.b * amt }
    for (let i = 1; i <= steps; i++) {
      const t = i / steps
      splat(prevX + pointer.dx * t, prevY + pointer.dy * t, vx, vy, color, radius)
    }
  }

  // ---------------------------------------------------------------- loop

  let lastTime = 0
  let rafId = 0
  let running = false

  function frame(now: number) {
    if (!running) return
    // always queue the next frame first so throttling can cheaply skip work
    rafId = requestAnimationFrame(frame)

    if (lastTime === 0) lastTime = now
    const elapsed = now - lastTime
    // frame-rate cap (Safari): skip until enough time has passed
    if (frameInterval > 0 && elapsed < frameInterval) return

    // real elapsed time drives the sim so animation speed stays constant
    // regardless of the frame rate; clamp only to keep the solver stable
    const dt = Math.min(elapsed / 1000, 0.04)
    lastTime = now

    if (resizeCanvas()) {
      initFramebuffers()
      buildMask() // layout changed → realign the text mask
    }

    uTime += dt // advance the ambient noise flow
    applyInputs()
    step(dt)
    render()
  }

  function start() {
    if (running) return
    running = true
    lastTime = 0
    rafId = requestAnimationFrame(frame)
  }

  function stop() {
    running = false
    if (rafId) cancelAnimationFrame(rafId)
    rafId = 0
  }

  start()

  return {
    destroy() {
      stop()
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('touchmove', onTouchMove)
      // NB: intentionally do NOT call WEBGL_lose_context.loseContext() here.
      // React StrictMode (and HMR) re-run this effect on the SAME canvas
      // element; getContext() returns the existing context, so forcibly
      // losing it would leave the remounted instance with a dead context.
      // The context is released by GC when the canvas is removed from the DOM.
    },
    resize() {
      if (resizeCanvas()) initFramebuffers()
      buildMask()
    },
    rebuildMask: buildMask,
    pause: stop,
    resume: start,
    splat: splatPublic,
  }
}

// exposed for callers that want to pause/resume via the handle
export type { Config as FluidConfig }
