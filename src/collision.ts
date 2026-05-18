import Phaser from 'phaser'
import type { Bullet } from './types'

type HandleBulletsParams = {
  bullets: Bullet[]
  player: Phaser.GameObjects.Rectangle
  hitbox: Phaser.GameObjects.Arc
  boss: Phaser.GameObjects.Arc
  invincible: boolean
  score: number
  graze: number
  playerHP: number
  missCount: number
  spellBonus: boolean
  onDamage: () => void
  onGameOver: () => void
  onBossDefeated: () => void
}

export function handleBullets(
  params: HandleBulletsParams
) {

  const {
    bullets,
    player,
    hitbox,
    boss,
    invincible,
    onDamage,
    onGameOver,
    onBossDefeated,
  } = params

  let score = params.score
  let graze = params.graze
  let playerHP = params.playerHP
  let missCount = params.missCount
  let spellBonus = params.spellBonus
  let bossHit = false

  for (
    let i = bullets.length - 1;
    i >= 0;
    i--
  ) {

    const b = bullets[i]

    b.shape.x += b.vx
    b.shape.y += b.vy

    // グレイズ
    if (
      b.type === 'enemy' &&
      !b.grazed
    ) {

      const d =
        Phaser.Math.Distance.Between(
          player.x,
          player.y,
          b.shape.x,
          b.shape.y
        )

      if (
        d < 30 &&
        d > 8
      ) {

        b.grazed = true
        graze++
        score += 50
      }
    }

    // 被弾
    if (
      b.type === 'enemy' &&
      !invincible
    ) {

      const d =
        Phaser.Math.Distance.Between(
          hitbox.x,
          hitbox.y,
          b.shape.x,
          b.shape.y
        )

      if (d < 6) {

        b.shape.destroy()
        bullets.splice(i, 1)

        playerHP--
        missCount++
        spellBonus = false

        onDamage()

        if (playerHP <= 0) {
          onGameOver()
          return {
            score,
            graze,
            playerHP,
            missCount,
            spellBonus,
            bossHit,
          }
        }

        continue
      }
    }

    // 自機弾 → ボス
    if (b.type === 'player') {

      const dBoss =
        Phaser.Math.Distance.Between(
          boss.x,
          boss.y,
          b.shape.x,
          b.shape.y
        )

      if (dBoss < 30) {

        b.shape.destroy()
        bullets.splice(i, 1)

        bossHit = true

        onBossDefeated()

        continue
      }
    }

    // 画面外削除
    if (
      b.shape.y < -50 ||
      b.shape.y > 800 ||
      b.shape.x < -50 ||
      b.shape.x > 530
    ) {

      b.shape.destroy()
      bullets.splice(i, 1)
    }
  }

  return {
    score,
    graze,
    playerHP,
    missCount,
    spellBonus,
    bossHit,
  }
}