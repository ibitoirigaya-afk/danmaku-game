import Phaser from 'phaser'

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 480,
  height: 720,
  backgroundColor: '#000000',

  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    },
  },

  scene: {
    create,
    update,
  },
}

new Phaser.Game(config)

let player: Phaser.GameObjects.Rectangle
let cursors: Phaser.Types.Input.Keyboard.CursorKeys
let restartKey: Phaser.Input.Keyboard.Key
let shiftKey: Phaser.Input.Keyboard.Key

let gameOver = false

let score = 0
let scoreText: Phaser.GameObjects.Text

let bulletSpeed = 3
let spawnDelay = 500

type Bullet = {
  shape: Phaser.GameObjects.Arc
  vx: number
  vy: number
}

const bullets: Bullet[] = []

function create(this: Phaser.Scene) {
  // プレイヤー
  player = this.add.rectangle(
    240,
    600,
    30,
    30,
    0x00ff00
  )

  // キー入力
  cursors = this.input.keyboard!.createCursorKeys()

  restartKey = this.input.keyboard!.addKey(
    Phaser.Input.Keyboard.KeyCodes.R
  )

  shiftKey = this.input.keyboard!.addKey(
    Phaser.Input.Keyboard.KeyCodes.SHIFT
  )

  // スコア表示
  scoreText = this.add.text(20, 20, 'Score: 0', {
    fontSize: '32px',
    color: '#ffffff',
  })

  // 狙い弾
  this.time.addEvent({
    delay: spawnDelay,
    loop: true,
    callback: () => {
      if (gameOver) return

      const x = Phaser.Math.Between(20, 460)

      const bullet = this.add.circle(
        x,
        0,
        10,
        0xff0000
      )

      const angle = Phaser.Math.Angle.Between(
        bullet.x,
        bullet.y,
        player.x,
        player.y
      )

      bullets.push({
        shape: bullet,
        vx: Math.cos(angle) * bulletSpeed,
        vy: Math.sin(angle) * bulletSpeed,
      })
    },
  })

  // 円形弾幕
  this.time.addEvent({
    delay: 3000,
    loop: true,
    callback: () => {
      if (gameOver) return

      const centerX = 240
      const centerY = 100

      const total = 16

      for (let i = 0; i < total; i++) {
        const angle =
          (Math.PI * 2 * i) / total

        const bullet = this.add.circle(
          centerX,
          centerY,
          8,
          0xffff00
        )

        bullets.push({
          shape: bullet,
          vx: Math.cos(angle) * 3,
          vy: Math.sin(angle) * 3,
        })
      }
    },
  })
}

function update(this: Phaser.Scene) {
  // GAME OVER
  if (gameOver) {
    if (
      Phaser.Input.Keyboard.JustDown(
        restartKey
      )
    ) {
      location.reload()
    }

    return
  }

  // スコア
  score += 1

  scoreText.setText(`Score: ${score}`)

  // 低速移動
  const moveSpeed = shiftKey.isDown ? 2 : 5

  // プレイヤー移動
  if (cursors.left.isDown) {
    player.x -= moveSpeed
  }

  if (cursors.right.isDown) {
    player.x += moveSpeed
  }

  if (cursors.up.isDown) {
    player.y -= moveSpeed
  }

  if (cursors.down.isDown) {
    player.y += moveSpeed
  }

  // 画面外制限
  player.x = Phaser.Math.Clamp(player.x, 15, 465)
  player.y = Phaser.Math.Clamp(player.y, 15, 705)

  // 弾移動
  for (let i = bullets.length - 1; i >= 0; i--) {
    const bullet = bullets[i]

    bullet.shape.x += bullet.vx
    bullet.shape.y += bullet.vy

    // 画面外削除
    if (
      bullet.shape.y > 800 ||
      bullet.shape.x < -50 ||
      bullet.shape.x > 530
    ) {
      bullet.shape.destroy()
      bullets.splice(i, 1)
      continue
    }

    // 当たり判定
    const distance = Phaser.Math.Distance.Between(
      player.x,
      player.y,
      bullet.shape.x,
      bullet.shape.y
    )

    if (distance < 25) {
      gameOver = true

      this.add.text(110, 350, 'GAME OVER', {
        fontSize: '48px',
        color: '#ffffff',
      })

      this.add.text(
        120,
        420,
        'Press R to Restart',
        {
          fontSize: '24px',
          color: '#ffffff',
        }
      )
    }
  }
}
