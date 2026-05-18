import Phaser from 'phaser'
import type {
  Bullet,
  Difficulty,
} from './types'

export function bossPattern(
  scene: Phaser.Scene,
  phase: number,
  difficulty: Difficulty,
  boss: Phaser.GameObjects.Arc,
  player: Phaser.GameObjects.Rectangle,
  bullets: Bullet[],
  spiralAngleRef: { value: number }
) {

  if (phase === 1) {
    spiral(
      scene,
      difficulty,
      boss,
      bullets,
      spiralAngleRef
    )

    fan(
      scene,
      difficulty,
      boss,
      player,
      bullets
    )
  }

  if (phase === 2) {
    spiral(
      scene,
      difficulty,
      boss,
      bullets,
      spiralAngleRef
    )

    fan(
      scene,
      difficulty,
      boss,
      player,
      bullets
    )

    circleBurst(
      scene,
      difficulty,
      boss,
      bullets
    )
  }

  if (phase === 3) {
    spiral(
      scene,
      difficulty,
      boss,
      bullets,
      spiralAngleRef
    )

    fan(
      scene,
      difficulty,
      boss,
      player,
      bullets
    )

    circleBurst(
      scene,
      difficulty,
      boss,
      bullets
    )

    homing(
      scene,
      boss,
      player,
      bullets
    )
  }

  if (difficulty === 'HARD') {
    circleBurst(
      scene,
      difficulty,
      boss,
      bullets
    )
  }
}

function spiral(
  scene: Phaser.Scene,
  difficulty: Difficulty,
  boss: Phaser.GameObjects.Arc,
  bullets: Bullet[],
  spiralAngleRef: { value: number }
) {

  let total = 12

  if (difficulty === 'NORMAL') {
    total = 20
  }

  if (difficulty === 'HARD') {
    total = 32
  }

  for (
    let i = 0;
    i < total;
    i++
  ) {

    const angle =
      spiralAngleRef.value +
      (Math.PI * 2 * i) / total

    const bullet =
      scene.add.circle(
        boss.x,
        boss.y,
        5,
        0xff4444
      )

    bullets.push({
      shape: bullet,
      vx: Math.cos(angle) * 3,
      vy: Math.sin(angle) * 3,
      type: 'enemy',
    })
  }

  spiralAngleRef.value += 0.25
}

function fan(
  scene: Phaser.Scene,
  difficulty: Difficulty,
  boss: Phaser.GameObjects.Arc,
  player: Phaser.GameObjects.Rectangle,
  bullets: Bullet[]
) {

  const base =
    Phaser.Math.Angle.Between(
      boss.x,
      boss.y,
      player.x,
      player.y
    )

  let amount = 4

  if (difficulty === 'NORMAL') {
    amount = 6
  }

  if (difficulty === 'HARD') {
    amount = 9
  }

  for (
    let i = -amount;
    i <= amount;
    i++
  ) {

    const angle =
      base + i * 0.2

    const bullet =
      scene.add.circle(
        boss.x,
        boss.y,
        5,
        0xffff00
      )

    bullets.push({
      shape: bullet,
      vx: Math.cos(angle) * 4,
      vy: Math.sin(angle) * 4,
      type: 'enemy',
    })
  }
}

function circleBurst(
  scene: Phaser.Scene,
  difficulty: Difficulty,
  boss: Phaser.GameObjects.Arc,
  bullets: Bullet[]
) {

  let total = 20

  if (difficulty === 'NORMAL') {
    total = 30
  }

  if (difficulty === 'HARD') {
    total = 48
  }

  for (
    let i = 0;
    i < total;
    i++
  ) {

    const angle =
      (Math.PI * 2 * i) / total

    const bullet =
      scene.add.circle(
        boss.x,
        boss.y,
        5,
        0x00ffff
      )

    bullets.push({
      shape: bullet,
      vx: Math.cos(angle) * 4,
      vy: Math.sin(angle) * 4,
      type: 'enemy',
    })
  }
}

function homing(
  scene: Phaser.Scene,
  boss: Phaser.GameObjects.Arc,
  player: Phaser.GameObjects.Rectangle,
  bullets: Bullet[]
) {

  const angle =
    Phaser.Math.Angle.Between(
      boss.x,
      boss.y,
      player.x,
      player.y
    )

  const bullet =
    scene.add.circle(
      boss.x,
      boss.y,
      7,
      0xff00ff
    )

  bullets.push({
    shape: bullet,
    vx: Math.cos(angle) * 6,
    vy: Math.sin(angle) * 6,
    type: 'enemy',
  })
}