export const bgm =
  new Audio('/sounds/bgm.mp3')

export const bossAppearSE =
  new Audio('/sounds/boss-appear.wav')

export const bombSE =
  new Audio('/sounds/bomb.wav')

export const phaseSE =
  new Audio('/sounds/phase.wav')

export const explosionSE =
  new Audio('/sounds/explosion.wav')

export const gameOverSE =
  new Audio('/sounds/gameover.wav')

export function setupSounds() {

  bgm.loop = true
  bgm.volume = 0.25

  bossAppearSE.volume = 0.4
  bombSE.volume = 0.45
  phaseSE.volume = 0.45
  explosionSE.volume = 0.5
  gameOverSE.volume = 0.5
}

export function playSE(
  sound: HTMLAudioElement
) {

  sound.currentTime = 0

  sound.play().catch(() => {})

  if (sound === phaseSE) {

    setTimeout(() => {

      sound.pause()

      sound.currentTime = 0

    }, 1300)
  }
}