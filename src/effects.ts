import Phaser from 'phaser'

import type { Bullet } from './types'

export function clearEnemyBullets(
  bullets: Bullet[]
) {

  for (
    let i = bullets.length - 1;
    i >= 0;
    i--
  ) {

    if (
      bullets[i].type === 'enemy'
    ) {

      bullets[i].shape.destroy()

      bullets.splice(i, 1)
    }
  }
}

export function damageEffect(
  scene: Phaser.Scene,
  damageFlash: Phaser.GameObjects.Rectangle
) {

  damageFlash.setAlpha(0.5)

  scene.tweens.add({
    targets: damageFlash,
    alpha: 0,
    duration: 250,
  })
}

export function bossExplosion(
  scene: Phaser.Scene,
  boss: Phaser.GameObjects.Arc
) {

  boss.setVisible(false)

  for (let i = 0; i < 20; i++) {

    const angle =
      (Math.PI * 2 * i) / 20

    const piece =
      scene.add.circle(
        boss.x,
        boss.y,
        Phaser.Math.Between(4, 10),
        0xffaa00
      )

    piece.setDepth(1000)

    scene.tweens.add({
      targets: piece,
      x:
        boss.x +
        Math.cos(angle) *
          Phaser.Math.Between(80, 180),
      y:
        boss.y +
        Math.sin(angle) *
          Phaser.Math.Between(80, 180),
      alpha: 0,
      scale: 2,
      duration: 900,
      onComplete: () => {
        piece.destroy()
      },
    })
  }

  const flash =
    scene.add.circle(
      boss.x,
      boss.y,
      20,
      0xffffff
    )

  flash.setDepth(1001)

  scene.tweens.add({
    targets: flash,
    scale: 8,
    alpha: 0,
    duration: 700,
    onComplete: () => {
      flash.destroy()
    },
  })

  scene.cameras.main.shake(500, 0.02)
}