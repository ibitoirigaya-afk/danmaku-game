import Phaser from 'phaser'

import {
  bossAppearSE,
  phaseSE,
  playSE,
} from './sounds'

import {
  spellCard,
} from './ui'

export function startBossEntrance(
  scene: Phaser.Scene,
  boss: Phaser.GameObjects.Arc,
  warningText: Phaser.GameObjects.Text,
  spellText: Phaser.GameObjects.Text,
  phase: number,
  setPlaying: () => void,
  setPhaseChanging: (value: boolean) => void,
  setSpellBonus: (value: boolean) => void
) {

  setPlaying()

  playSE(bossAppearSE)

  setPhaseChanging(true)

  boss.y = -100

  warningText.setVisible(true)

  scene.tweens.add({
    targets: warningText,
    alpha: 0,
    yoyo: true,
    repeat: 5,
    duration: 200,
  })

  scene.time.delayedCall(
    2000,
    () => {

      warningText.setVisible(false)

      scene.tweens.add({
        targets: boss,
        y: 120,
        duration: 1500,
        ease: 'Sine.easeOut',

        onComplete: () => {

          setPhaseChanging(false)

          setSpellBonus(true)

          spellCard(
            scene,
            spellText,
            `PHASE ${phase}`
          )
        },
      })
    }
  )
}

export function startPhaseTransition(
  scene: Phaser.Scene,
  boss: Phaser.GameObjects.Arc,
  warningText: Phaser.GameObjects.Text,
  spellText: Phaser.GameObjects.Text,
  spellName: string,
  phaseLevel: number,
  setPhaseChanging: (value: boolean) => void,
  setSpellBonus: (value: boolean) => void
) {

  setPhaseChanging(true)

  playSE(phaseSE)

  const isFinal =
    phaseLevel === 3

  const effectColor =
    isFinal ? 0xff0000 : 0x00ffff

  const flashAlpha =
    isFinal ? 1.0 : 0.5

  const flash =
    scene.add.rectangle(
      240,
      360,
      480,
      720,
      effectColor
    )

  flash.setAlpha(0)
  flash.setDepth(1000)

  scene.tweens.add({
    targets: flash,
    alpha: flashAlpha,
    duration: isFinal ? 400 : 150,
    yoyo: true,
    onComplete: () => flash.destroy(),
  })

  const count =
    isFinal ? 10 : 4

  for (let i = 0; i < count; i++) {

    const ring =
      scene.add.circle(
        boss.x,
        boss.y,
        10,
        effectColor,
        0
      )

    ring.setStrokeStyle(
      isFinal ? 4 : 2,
      effectColor
    )

    scene.tweens.add({
      targets: ring,
      radius: isFinal ? 800 : 400,
      alpha: 0,
      delay: i * (isFinal ? 80 : 150),
      duration: 1000,
      onComplete: () => ring.destroy(),
    })
  }

  if (isFinal) {
    scene.cameras.main.shake(1000, 0.02)
  }

  boss.y = -100

  warningText.setVisible(true)

  warningText.setColor(
    isFinal ? '#ff0000' : '#88ffff'
  )

  scene.time.delayedCall(
    2000,
    () => {

      warningText.setVisible(false)

      scene.tweens.add({
        targets: boss,
        y: 120,
        duration: isFinal ? 2000 : 1200,
        ease: 'Back.easeOut',

        onComplete: () => {

          setPhaseChanging(false)

          setSpellBonus(true)

          spellCard(
            scene,
            spellText,
            spellName
          )
        },
      })
    }
  )
}