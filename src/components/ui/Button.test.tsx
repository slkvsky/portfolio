import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { Button } from './Button'

describe('Button', () => {
  it('renders its label as a button by default', () => {
    render(<Button>Start a conversation</Button>)
    expect(screen.getByRole('button', { name: /start a conversation/i })).toBeInTheDocument()
  })

  it('renders as a link when as="a"', () => {
    render(
      <Button as="a" href="/legal">
        Legal notice
      </Button>
    )
    const link = screen.getByRole('link', { name: /legal notice/i })
    expect(link).toHaveAttribute('href', '/legal')
  })

  it('fires onClick when clicked', async () => {
    const onClick = vi.fn()
    render(<Button onClick={onClick}>Click me</Button>)
    screen.getByRole('button').click()
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})
