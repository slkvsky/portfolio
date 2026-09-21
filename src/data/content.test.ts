import { describe, expect, it } from 'vitest'
import { footerLinks, projects, site } from './content'

describe('content data integrity', () => {
  it('has a valid contact email', () => {
    expect(site.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
  })

  it('does not link projects to placeholder domains', () => {
    for (const project of projects) {
      if (project.link) {
        expect(project.link).not.toMatch(/example\.(com|org|net)/)
      }
    }
  })

  it('footer links point to internal routes', () => {
    for (const link of footerLinks) {
      expect(link.href.startsWith('/')).toBe(true)
    }
  })
})
