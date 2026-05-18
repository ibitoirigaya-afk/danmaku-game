import {
  describe,
  expect,
  it,
  vi,
} from 'vitest'

import {
  bgm,
  bombSE,
  explosionSE,
  gameOverSE,
  setupSounds,
  playSE,
} from './sounds'

describe('sounds', () => {

  it('setupSoundsで音量が設定される', () => {

    setupSounds()

    expect(bgm.loop).toBe(true)
    expect(bgm.volume).toBe(0.25)
    expect(bombSE.volume).toBe(0.45)
    expect(explosionSE.volume).toBe(0.5)
    expect(gameOverSE.volume).toBe(0.5)
  })

  it('playSEで再生処理が呼ばれる', () => {

    const sound = {
      currentTime: 10,
      play: vi.fn().mockResolvedValue(undefined),
    } as unknown as HTMLAudioElement

    playSE(sound)

    expect(sound.currentTime).toBe(0)
    expect(sound.play).toHaveBeenCalled()
  })
})