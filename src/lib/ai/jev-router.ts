export const JEV_ROUTER_MODEL = 'typesafe/jev-router'

type JevCostTier = 'low' | 'medium' | 'high'

function percent(): number {
  const raw = process.env.OPENROUTER_JEV_PERCENT?.trim()
  if (!raw) return 0
  const value = Number(raw)
  if (!Number.isFinite(value) || value < 0 || value > 100) {
    throw new Error('OPENROUTER_JEV_PERCENT must be a number between 0 and 100')
  }
  return value
}

function costTier(): JevCostTier {
  const value = process.env.OPENROUTER_JEV_COST_TIER?.trim() || 'low'
  if (value !== 'low' && value !== 'medium' && value !== 'high') {
    throw new Error('OPENROUTER_JEV_COST_TIER must be low, medium, or high')
  }
  return value
}

export function resolveJevRoute(sample = Math.random()): {
  enabled: boolean
  model: string
  providerOptions?: { openrouter: { plugins: Array<{ id: 'jev-router'; cost_tier: JevCostTier }> } }
} {
  const enabled = percent() > 0 && sample * 100 < percent()
  return enabled
    ? { enabled, model: JEV_ROUTER_MODEL, providerOptions: { openrouter: { plugins: [{ id: 'jev-router', cost_tier: costTier() }] } } }
    : { enabled, model: JEV_ROUTER_MODEL }
}
