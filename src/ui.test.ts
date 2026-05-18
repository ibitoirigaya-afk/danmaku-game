import {
  describe,
  expect,
  it,
} from 'vitest'

import {
  checkSpellBonus,
} from './ui'

describe('checkSpellBonus', () => {

  const fakeScene = {
    add: {
      text: () => ({
        setOrigin: () => {},
        destroy: () => {},
      }),
    },
    tweens: {
      add: () => {},
    },
  }

  it('スペル成功時に50000加算', () => {

    const result =
      checkSpellBonus(
        fakeScene as any,
        true,
        1000,
        0,
        0
      )

    expect(result.score).toBe(51000)
    expect(result.spellSuccess).toBe(1)
    expect(result.totalBonus).toBe(50000)
    expect(result.spellBonus).toBe(true)
  })

  it('spellBonus=falseなら加算しない', () => {

    const result =
      checkSpellBonus(
        fakeScene as any,
        false,
        1000,
        0,
        0
      )

    expect(result.score).toBe(1000)
    expect(result.spellSuccess).toBe(0)
    expect(result.totalBonus).toBe(0)
    expect(result.spellBonus).toBe(true)
  })
})