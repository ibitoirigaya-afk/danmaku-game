import {
  describe,
  expect,
  it,
  vi,
} from 'vitest'

vi.mock('phaser', () => {
  return {
    default: {
      Math: {
        Between: (
          min: number,
          max: number
        ) => {
          return Math.floor(
            (min + max) / 2
          )
        },
      },
    },
  }
})

import {
  clearEnemyBullets,
  damageEffect,
  bossExplosion,
} from './effects'

import type {
  Bullet,
} from './types'

vi.mock('phaser', () => {
  return {
    default: {
      Math: {
        Between: (
          min: number,
          max: number
        ) => {
          return Math.floor(
            (min + max) / 2
          )
        },
      },
    },
  }
})

describe('effects', () => {

  it('敵弾だけ削除する', () => {

    const enemyDestroy = vi.fn()
    const playerDestroy = vi.fn()

    const bullets: Bullet[] = [
      {
        shape: {
          destroy: enemyDestroy,
        } as any,
        vx: 0,
        vy: 0,
        type: 'enemy',
      },
      {
        shape: {
          destroy: playerDestroy,
        } as any,
        vx: 0,
        vy: 0,
        type: 'player',
      },
    ]

    clearEnemyBullets(bullets)

    expect(enemyDestroy).toHaveBeenCalled()
    expect(playerDestroy).not.toHaveBeenCalled()
    expect(bullets.length).toBe(1)
    expect(bullets[0].type).toBe('player')
  })

  it('damageEffectでフラッシュが発生する', () => {

    const setAlpha = vi.fn()

    const fakeFlash = {
      setAlpha,
    }

    const fakeScene = {
      tweens: {
        add: vi.fn(),
      },
    }

    damageEffect(
      fakeScene as any,
      fakeFlash as any
    )

    expect(setAlpha).toHaveBeenCalledWith(0.5)
    expect(fakeScene.tweens.add).toHaveBeenCalled()
  })

  it('bossExplosionでボスを非表示にする', () => {

    const setVisible = vi.fn()

    const fakeBoss = {
      x: 240,
      y: 120,
      setVisible,
    }

    const fakeScene = {
      add: {
        circle: () => ({
          setDepth: vi.fn(),
          destroy: vi.fn(),
        }),
      },
      tweens: {
        add: vi.fn(),
      },
      cameras: {
        main: {
          shake: vi.fn(),
        },
      },
    }

    bossExplosion(
      fakeScene as any,
      fakeBoss as any
    )

    expect(setVisible).toHaveBeenCalledWith(false)
    expect(fakeScene.tweens.add).toHaveBeenCalled()
    expect(fakeScene.cameras.main.shake).toHaveBeenCalled()
  })
})