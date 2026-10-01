import { describe, expect, it, vi } from 'vitest'

vi.mock('@/lib/settings/load-settings', () => ({
  getVariable: vi.fn(),
}))

import { getVariable } from '@/lib/settings/load-settings'
import { loadWorkspaceFeatures } from './workspace-features'

describe('loadWorkspaceFeatures', () => {
  it('defaults every optional feature to disabled', async () => {
    vi.mocked(getVariable).mockResolvedValue('')
    expect(await loadWorkspaceFeatures('workspace-a')).toEqual(expect.objectContaining({
      instagram_image_generation: false,
      video_reels: false,
      ev_market_curation: false,
    }))
  })

  it('enables only explicit true-like settings', async () => {
    const settings: Record<string, string> = {
      feature_video_reels: 'true',
      feature_evergreen_content: '1',
      feature_ev_market_curation: 'false',
    }
    vi.mocked(getVariable).mockImplementation(async (_workspaceId, key) => settings[key] ?? '')
    expect(await loadWorkspaceFeatures('workspace-a')).toEqual(expect.objectContaining({
      video_reels: true,
      evergreen_content: true,
      ev_market_curation: false,
    }))
  })
})
