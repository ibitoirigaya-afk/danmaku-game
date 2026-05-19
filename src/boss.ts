import Phaser from 'phaser'
import type {
  Bullet,
  Difficulty,
  Stage,
} from './types'

export function bossPattern(
  scene: Phaser.Scene,
  phase: number,
  difficulty: Difficulty,
  stage: Stage,
  boss: Phaser.GameObjects.Arc,
  player: Phaser.GameObjects.Rectangle,
  bullets: Bullet[],
  spiralAngleRef: { value: number },
  bossTimerRef: { value: number }
) {

    if (stage === 'STAGE2') {

  bossTimerRef.value++

  stage2Pattern(
    scene,
    phase,
    difficulty,
    boss,
    player,
    bullets,
    bossTimerRef
  )

  return
}

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
  spiralAngleRef: { value: number },
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

function stage2Pattern(
  scene: Phaser.Scene,
  phase: number,
  difficulty: Difficulty,
  boss: Phaser.GameObjects.Arc,
  player: Phaser.GameObjects.Rectangle,
  bullets: Bullet[],
  bossTimerRef: { value: number }
) {

  if (bossTimerRef.value % 1 === 0) {
    sideRainPattern(
      scene,
      difficulty,
      bullets
    )
  }

  if (bossTimerRef.value % 2 === 0) {
    waveWallPattern(
      scene,
      difficulty,
      boss,
      bullets,
      bossTimerRef.value
    )
  }

  if (
    phase >= 2 &&
    bossTimerRef.value % 3 === 0
  ) {
    aimedSpreadPattern(
      scene,
      difficulty,
      boss,
      player,
      bullets
    )
  }

  if (
    phase >= 3 &&
    bossTimerRef.value % 4 === 0
  ) {
    crossLaserPattern(
      scene,
      difficulty,
      boss,
      bullets
    )
  }
}

function sideRainPattern(
  scene: Phaser.Scene,
  difficulty: Difficulty,
  bullets: Bullet[]
) {

  let amount = 3

  if (difficulty === 'NORMAL') amount = 5
  if (difficulty === 'HARD') amount = 7

  for (let i = 0; i < amount; i++) {

    const fromLeft =
      i % 2 === 0

    const bullet =
      scene.add.circle(
        fromLeft ? -20 : 500,
        Phaser.Math.Between(80, 500),
        5,
        0x66ccff
      )

    bullets.push({
      shape: bullet,
      vx: fromLeft ? 3 : -3,
      vy: 1.5,
      type: 'enemy',
    })
  }
}

function waveWallPattern(
  scene: Phaser.Scene,
  difficulty: Difficulty,
  boss: Phaser.GameObjects.Arc,
  bullets: Bullet[],
  timer: number
) {

  let amount = 8

  if (difficulty === 'NORMAL') amount = 12
  if (difficulty === 'HARD') amount = 16

  for (let i = 0; i < amount; i++) {

    const x =
      40 + i * (400 / amount)

    const y =
      boss.y + Math.sin(timer * 0.8 + i) * 40

    const bullet =
      scene.add.circle(
        x,
        y,
        5,
        0xaa88ff
      )

    bullets.push({
      shape: bullet,
      vx: 0,
      vy: 3,
      type: 'enemy',
    })
  }
}

function aimedSpreadPattern(
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

  let spread = 3

  if (difficulty === 'NORMAL') spread = 5
  if (difficulty === 'HARD') spread = 7

  for (let i = -spread; i <= spread; i++) {

    const angle =
      base + i * 0.09

    const bullet =
      scene.add.circle(
        boss.x,
        boss.y,
        6,
        0xff66aa
      )

    bullets.push({
      shape: bullet,
      vx: Math.cos(angle) * 5,
      vy: Math.sin(angle) * 5,
      type: 'enemy',
    })
  }
}

function crossLaserPattern(
  scene: Phaser.Scene,
  difficulty: Difficulty,
  boss: Phaser.GameObjects.Arc,
  bullets: Bullet[]
) {

  let speed = 4

  if (difficulty === 'NORMAL') speed = 5
  if (difficulty === 'HARD') speed = 6

  for (let i = -2; i <= 2; i++) {

    const patterns = [
      { vx: speed, vy: i },
      { vx: -speed, vy: i },
      { vx: i, vy: speed },
      { vx: i, vy: -speed },
    ]

    patterns.forEach((p) => {

      const bullet =
        scene.add.circle(
          boss.x,
          boss.y,
          4,
          0xffffff
        )

      bullets.push({
        shape: bullet,
        vx: p.vx,
        vy: p.vy,
        type: 'enemy',
      })
    })
  }
}