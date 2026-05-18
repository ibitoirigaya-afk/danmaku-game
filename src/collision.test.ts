import {
  vi,
} from 'vitest'

vi.mock('phaser', () => {
  return {
    default: {
      Math: {
        Distance: {
          Between: (
            x1: number,
            y1: number,
            x2: number,
            y2: number
          ) => {
            return Math.hypot(
              x2 - x1,
              y2 - y1
            )
          },
        },
        Angle: {
          Between: (
            x1: number,
            y1: number,
            x2: number,
            y2: number
          ) => {
            return Math.atan2(
              y2 - y1,
              x2 - x1
            )
          },
        },
        Between: (
          min: number,
          max: number
        ) => {
          return Math.floor(
            (min + max) / 2
          )
        },
        Clamp: (
          value: number,
          min: number,
          max: number
        ) => {
          return Math.max(
            min,
            Math.min(max, value)
          )
        },
      },
    },
  }
})

import {
  describe,
  expect,
  it,
} from 'vitest'

import {
  handleBullets,
} from './collision'

import type {
  Bullet,
} from './types'

describe('handleBullets', () => {

  it('画面外弾を削除する', () => {

    const bullets: Bullet[] = [
  {
    shape: {
      x: 0,
      y: -100,
      destroy: () => {},
    } as any,
    vx: 0,
    vy: 0,
    type: 'enemy',
  },
]

    handleBullets({
      bullets,
      player: {
        x: 0,
        y: 0,
      } as any,

      hitbox: {
        x: 0,
        y: 0,
      } as any,

      boss: {
        x: 0,
        y: 0,
      } as any,

      invincible: false,
      score: 0,
      graze: 0,
      playerHP: 3,
      missCount: 0,
      spellBonus: true,

      onDamage: () => {},
      onGameOver: () => {},
      onBossDefeated: () => {},
    })

    expect(bullets.length).toBe(0)
  })
})