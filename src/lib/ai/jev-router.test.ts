import { afterEach, describe, expect, it, vi } from 'vitest'
import { resolveJevRoute } from './jev-router'

afterEach(() => vi.unstubAllEnvs())

describe('Jev Router', () => {
  it('roteia a amostra configurada com plugin de baixo custo', () => {
    vi.stubEnv('OPENROUTER_JEV_PERCENT', '100')
    expect(resolveJevRoute(0)).toMatchObject({
      enabled: true,
      model: 'typesafe/jev-router',
      providerOptions: { openrouter: { plugins: [{ id: 'jev-router', cost_tier: 'low' }] } },
    })
  })

  it('fica desligado por padrão', () => {
    expect(resolveJevRoute(0).enabled).toBe(false)
  })
})
