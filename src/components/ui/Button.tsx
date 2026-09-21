import type { ReactNode } from 'react'
import { ArrowUpRight } from '@/components/ui/icons'

type Variant = 'primary' | 'secondary' | 'on-dark'

type CommonProps = {
  children: ReactNode
  variant?: Variant
  className?: string
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
 * Two hover languages, picked by what the button does: primary/on-dark are
 * actions that go somewhere (an arrow slides in), secondary is in-page nav
 * (corner brackets snap into frame — no "going" implied). See the button
 * hover comment block in index.css.
 */
export function Button(props: ButtonProps) {
  const { children, variant = 'primary', className = '' } = props
  const classes = `btn-main ${variantClass[variant]} ${className}`.trim()

  const inner =
    variant === 'secondary' ? (
      <>
        <span className="btn-main__bracket btn-main__bracket--tl" aria-hidden="true" />
        <span className="btn-main__bracket btn-main__bracket--tr" aria-hidden="true" />
        <span className="btn-main__bracket btn-main__bracket--bl" aria-hidden="true" />
        <span className="btn-main__bracket btn-main__bracket--br" aria-hidden="true" />
        <span className="btn-main__label">{children}</span>
      </>
    ) : (
      <>
        <span className="btn-main__label">{children}</span>
        <span className="btn-main__arrow" aria-hidden="true">
          <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </>
    )

  if (props.as === 'a') {
    return (
      <a href={props.href} target={props.target} rel={props.rel} className={classes}>
        {inner}
      </a>
    )
  }

  return (
    <button type={props.type ?? 'button'} onClick={props.onClick} className={classes}>
      {inner}
    </button>
  )
}
