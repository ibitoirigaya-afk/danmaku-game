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
  shootPlayerBullets,
} from './player'

describe('shootPlayerBullets', () => {

  it('EASYで3way弾', () => {

    const bullets: any[] = []

    const fakeScene = {
      add: {
        circle: () => ({
          x: 0,
          y: 0,
        }),
      },
    }

    shootPlayerBullets(
      fakeScene as any,
      {
        x: 100,
        y: 100,
      } as any,

      'EASY',

      bullets
    )

    expect(bullets.length).toBe(3)
  })

  it('HARDで1way弾', () => {

    const bullets: any[] = []

    const fakeScene = {
      add: {
        circle: () => ({
          x: 0,
          y: 0,
        }),
      },
    }

    shootPlayerBullets(
      fakeScene as any,
      {
        x: 100,
        y: 100,
      } as any,

      'HARD',

      bullets
    )

    expect(bullets.length).toBe(1)
  })
})