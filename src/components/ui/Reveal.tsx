import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { fadeUp, staggerContainer, revealViewport } from '@/lib/motion'

type RevealProps = {
  children: ReactNode
  className?: string
  /** When true, staggers direct <Reveal.Item> children. */
  stagger?: boolean
  as?: 'div' | 'section' | 'ul' | 'li'
}

/** Fade + rise on scroll into view. */
export function Reveal({
  children,
  className,
  stagger = false,
  as = 'div',
}: RevealProps) {
  const MotionTag = motion[as]
  return (
    <MotionTag
      className={className}
      variants={stagger ? staggerContainer : fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={revealViewport}
    >
      {children}
    </MotionTag>
  )
}

/** Child of a staggered Reveal container. */
export function RevealItem({
  children,
  className,
  as = 'div',
}: {
  children: ReactNode
  className?: string
  as?: 'div' | 'li'
}) {
  const MotionTag = motion[as]
  return (
    <MotionTag className={className} variants={fadeUp}>
      {children}
    </MotionTag>
  )
}
