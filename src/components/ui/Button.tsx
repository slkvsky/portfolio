import type { PointerEvent, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'on-dark'

type CommonProps = {
  children: ReactNode
  variant?: Variant
  className?: string
  icon?: ReactNode
}

type ButtonAsButton = CommonProps & {
  as?: 'button'
  href?: never
  onClick?: () => void
  type?: 'button' | 'submit'
}

type ButtonAsLink = CommonProps & {
  as: 'a'
  href: string
  onClick?: never
  target?: string
  rel?: string
}

type ButtonProps = ButtonAsButton | ButtonAsLink

const variantClass: Record<Variant, string> = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  'on-dark': 'btn-on-dark',
}

/**
 * Points the ink wipe at whichever horizontal edge the pointer just crossed.
 * Called on both enter and leave, so the fill arrives from the entry edge and
 * retreats toward the exit edge. See `.btn-main::before` in index.css.
 */
function aimWipe(e: PointerEvent<HTMLElement>) {
  const el = e.currentTarget
  const r = el.getBoundingClientRect()
  const fromLeft = e.clientX - r.left < r.width / 2
  el.style.setProperty('--wipe-from', fromLeft ? '-101%' : '101%')
}

export function Button(props: ButtonProps) {
  const { children, variant = 'primary', className = '', icon } = props
  const classes = `btn-main ${variantClass[variant]} ${className}`.trim()

  const inner = (
    <>
      <span className="btn-main__label">{children}</span>
      {icon ? (
        <span className="btn-main__icon" aria-hidden="true">
          {icon}
        </span>
      ) : null}
    </>
  )

  if (props.as === 'a') {
    return (
      <a
        href={props.href}
        target={props.target}
        rel={props.rel}
        className={classes}
        onPointerEnter={aimWipe}
        onPointerLeave={aimWipe}
      >
        {inner}
      </a>
    )
  }

  return (
    <button
      type={props.type ?? 'button'}
      onClick={props.onClick}
      className={classes}
      onPointerEnter={aimWipe}
      onPointerLeave={aimWipe}
    >
      {inner}
    </button>
  )
}
