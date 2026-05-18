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
  bossPattern,
} from './boss'

describe('bossPattern', () => {

  it('弾を生成する', () => {

    const bullets: any[] = []

    const fakeScene = {
      add: {
        circle: () => ({
          x: 0,
          y: 0,
        }),
      },
    }

    bossPattern(
      fakeScene as any,
      1,
      'EASY',
      {
        x: 100,
        y: 100,
      } as any,

      {
        x: 200,
        y: 200,
      } as any,

      bullets,

      {
        value: 0,
      }
    )

    expect(bullets.length).toBeGreaterThan(0)
  })
})