import {
  describe,
  expect,
  it,
  vi,
} from 'vitest'

vi.mock('phaser', () => {
  return {
    default: {},
  }
})

vi.mock('./sounds', () => {
  return {
    bossAppearSE: {},
    phaseSE: {},
    playSE: vi.fn(),
  }
})

vi.mock('./ui', () => {
  return {
    spellCard: vi.fn(),
  }
})

import {
  startBossEntrance,
  startPhaseTransition,
} from './scene'

describe('scene', () => {

  function createFakeScene() {
    return {
      tweens: {
        add: vi.fn((config) => {
          if (config.onComplete) {
            config.onComplete()
          }
        }),
      },
      time: {
        delayedCall: vi.fn((_delay, callback) => {
          callback()
        }),
      },
      add: {
        rectangle: () => ({
          setAlpha: vi.fn().mockReturnThis(),
          setDepth: vi.fn().mockReturnThis(),
          destroy: vi.fn(),
        }),
        circle: () => ({
          setStrokeStyle: vi.fn(),
          destroy: vi.fn(),
        }),
      },
      cameras: {
        main: {
          shake: vi.fn(),
        },
      },
    }
  }

  it('startBossEntranceでボス登場処理が走る', () => {

    const fakeScene = createFakeScene()

    const boss = {
      y: -100,
    }

    const warningText = {
      setVisible: vi.fn(),
    }

    const spellText = {}

    const setPlaying = vi.fn()
    const setPhaseChanging = vi.fn()
    const setSpellBonus = vi.fn()

    startBossEntrance(
      fakeScene as any,
      boss as any,
      warningText as any,
      spellText as any,
      1,
      setPlaying,
      setPhaseChanging,
      setSpellBonus
    )

    expect(setPlaying).toHaveBeenCalled()
    expect(setPhaseChanging).toHaveBeenCalledWith(true)
    expect(setPhaseChanging).toHaveBeenCalledWith(false)
    expect(setSpellBonus).toHaveBeenCalledWith(true)
    expect(warningText.setVisible).toHaveBeenCalledWith(true)
  })

  it('startPhaseTransitionでフェーズ演出が走る', () => {

    const fakeScene = createFakeScene()

    const boss = {
      x: 240,
      y: 120,
    }

    const warningText = {
      setVisible: vi.fn(),
      setColor: vi.fn(),
    }

    const spellText = {}

    const setPhaseChanging = vi.fn()
    const setSpellBonus = vi.fn()

    startPhaseTransition(
      fakeScene as any,
      boss as any,
      warningText as any,
      spellText as any,
      'TEST SPELL',
      3,
      setPhaseChanging,
      setSpellBonus
    )

    expect(setPhaseChanging).toHaveBeenCalledWith(true)
    expect(setPhaseChanging).toHaveBeenCalledWith(false)
    expect(setSpellBonus).toHaveBeenCalledWith(true)
    expect(warningText.setColor).toHaveBeenCalledWith('#ff0000')
    expect(fakeScene.cameras.main.shake).toHaveBeenCalled()
  })
})