import type { Usp } from '@/data/content'

/** Single-hue peach-pink tints. */
const TINT_LIGHTNESS = [94, 92, 90, 88, 86]

function tint(i: number) {
  return `hsl(0 78% ${TINT_LIGHTNESS[i % TINT_LIGHTNESS.length]}%)`
}

type Props = { shape: Usp['shape']; className?: string }

/** Full-bleed generative background pattern for a USP card (original motifs). */
export function UspPattern({ shape, className }: Props) {
  return (
    <svg
      viewBox="0 0 322 181"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden="true"
    >
      {shape === 'nested-squares' && <CornerRings />}
      {shape === 'stacked-rects' && <DiagonalBars />}
      {shape === 'circles-row' && <CircleCluster />}
      {shape === 'rotated-squares' && <NestedTriangles />}
    </svg>
  )
}

/** Concentric filled discs fanning out of the top-right corner. */
function CornerRings() {
  const radii = [196, 154, 116, 82, 52, 26]
  return (
    <g>
      {radii.map((r, i) => (
        <circle key={i} cx={322} cy={0} r={r} fill={tint(i)} />
      ))}
    </g>
  )
}

/** Parallel rounded bars sheared into a diagonal rhythm. */
function DiagonalBars() {
  const count = 7
  return (
    <g transform="skewX(-22)">
      {Array.from({ length: count }).map((_, i) => (
        <rect
          key={i}
          x={-30 + i * 56}
          y={-50}
          width={28}
          height={280}
          rx={14}
          fill={tint(i)}
        />
      ))}
    </g>
  )
}

/** Loose cluster of overlapping discs of varied size. */
function CircleCluster() {
  const circles = [
    { cx: 52, cy: 58, r: 74, t: 0 },
    { cx: 214, cy: 44, r: 66, t: 1 },
    { cx: 150, cy: 96, r: 50, t: 2 },
    { cx: 292, cy: 96, r: 44, t: 3 },
    { cx: 108, cy: 22, r: 34, t: 4 },
  ]
  return (
    <g>
      {circles.map((c, i) => (
        <circle key={i} cx={c.cx} cy={c.cy} r={c.r} fill={tint(c.t)} />
      ))}
    </g>
  )
}

/** Nested triangles hanging from the top edge, darkening inward. */
function NestedTriangles() {
  const sizes = [250, 198, 150, 108, 70]
  const cx = 161
  return (
    <g>
      {sizes.map((s, i) => {
        const half = s / 2
        const h = s * 0.82
        return (
          <polygon
            key={i}
            points={`${cx - half},-4 ${cx + half},-4 ${cx},${h}`}
            fill={tint(i)}
          />
        )
      })}
    </g>
  )
}
