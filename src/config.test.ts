import {
  describe,
  expect,
  it,
  vi,
} from 'vitest'

vi.mock('phaser', () => {
  return {
    default: {
      AUTO: 'AUTO',
      Scale: {
        FIT: 'FIT',
        CENTER_BOTH: 'CENTER_BOTH',
      },
    },
  }
})

import {
  createGameConfig,
} from './config'

describe('createGameConfig', () => {

  it('ゲーム設定を作れる', () => {

    const create = () => {}
    const update = () => {}

    const config =
      createGameConfig(
        create,
        update
      )

    expect(config.width).toBe(480)
    expect(config.height).toBe(720)
    expect(config.backgroundColor).toBe('#000000')
    expect(config.scene).toEqual({
      create,
      update,
    })
  })
})