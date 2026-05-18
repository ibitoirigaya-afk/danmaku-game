import Phaser from 'phaser'
import type {
  Bullet,
  Difficulty,
} from './types'

export function movePlayer(
  player: Phaser.GameObjects.Rectangle,
  hitbox: Phaser.GameObjects.Arc,
  cursors: Phaser.Types.Input.Keyboard.CursorKeys,
  shiftKey: Phaser.Input.Keyboard.Key,
  isTouchDevice: boolean,
  isTouching: boolean,
  touchX: number,
  touchY: number
) {

  const speed =
    shiftKey.isDown ? 2 : 5

  if (isTouchDevice && isTouching) {

    player.x += (touchX - player.x) * 0.15
    player.y += (touchY - player.y) * 0.15

  } else {

    if (cursors.left.isDown)
      player.x -= speed

    if (cursors.right.isDown)
      player.x += speed

    if (cursors.up.isDown)
      player.y -= speed

    if (cursors.down.isDown)
      player.y += speed
  }

  player.x =
    Phaser.Math.Clamp(
      player.x,
      15,
      465
    )

  player.y =
    Phaser.Math.Clamp(
      player.y,
      15,
      705
    )

  hitbox.x = player.x
  hitbox.y = player.y

  hitbox.setVisible(
    shiftKey.isDown
  )
}

export function shootPlayerBullets(
  scene: Phaser.Scene,
  player: Phaser.GameObjects.Rectangle,
  difficulty: Difficulty,
  bullets: Bullet[]
) {

  // EASY = 3way
  if (difficulty === 'EASY') {

    for (let i = -1; i <= 1; i++) {

      const bullet =
        scene.add.circle(
          player.x + i * 12,
          player.y - 15,
          5,
          0x00ff88
        )

      bullets.push({
        shape: bullet,
        vx: i * 0.5,
        vy: -8,
        type: 'player',
      })
    }
  }

  // NORMAL = 2way
  if (difficulty === 'NORMAL') {

    for (let i = -1; i <= 0; i++) {

      const bullet =
        scene.add.circle(
          player.x + (i + 0.5) * 16,
          player.y - 15,
          5,
          0x00ff88
        )

      bullets.push({
        shape: bullet,
        vx: (i + 0.5) * 0.6,
        vy: -8,
        type: 'player',
      })
    }
  }

  // HARD = 1way
  if (difficulty === 'HARD') {

    const bullet =
      scene.add.circle(
        player.x,
        player.y - 15,
        5,
        0x00ff88
      )

    bullets.push({
      shape: bullet,
      vx: 0,
      vy: -8,
      type: 'player',
    })
  }
}