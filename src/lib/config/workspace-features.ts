import { getVariable } from '@/lib/settings/load-settings'

export const WORKSPACE_FEATURES = [
  'instagram_image_generation',
  'evergreen_content',
  'seasonal_content',
  'video_reels',
  'branded_reel_frame',
  'reel_crossposting',
  'negative_ev_guardrail',
  'ev_market_curation',
] as const

export type WorkspaceFeature = typeof WORKSPACE_FEATURES[number]
export type WorkspaceFeatures = Record<WorkspaceFeature, boolean>

const defaults: WorkspaceFeatures = {
  instagram_image_generation: false,
  evergreen_content: false,
  seasonal_content: false,
  video_reels: false,
  branded_reel_frame: false,
  reel_crossposting: false,
  negative_ev_guardrail: false,
  ev_market_curation: false,
}

function parseBoolean(value: unknown): boolean {
  return value === true || value === 'true' || value === '1' || value === 'yes'
}

/**
 * Loads optional pipeline capabilities for one workspace.
 * Settings use the `features` category and default to disabled, so a fresh
 * installation cannot accidentally activate publishing-related behavior.
 */
export async function loadWorkspaceFeatures(workspaceId: string): Promise<WorkspaceFeatures> {
  const features = { ...defaults }
  const values = await Promise.all(
    WORKSPACE_FEATURES.map((feature) => getVariable(workspaceId, `feature_${feature}`)),
  )
  WORKSPACE_FEATURES.forEach((feature, index) => {
    features[feature] = parseBoolean(values[index])
  })
  return features
}

export async function isWorkspaceFeatureEnabled(workspaceId: string, feature: WorkspaceFeature): Promise<boolean> {
  return (await loadWorkspaceFeatures(workspaceId))[feature]
}
