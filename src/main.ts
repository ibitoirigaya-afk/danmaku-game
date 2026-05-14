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

let gameState = 'title'

let difficulty = 'NORMAL'

let score = 0
let scoreText: Phaser.GameObjects.Text

let bulletSpeed = 3
let spawnDelay = 500

let titleTexts: Phaser.GameObjects.Text[] = []

type Bullet = {
  shape: Phaser.GameObjects.Arc
  vx: number
  vy: number
}

const bullets: Bullet[] = []

function create(this: Phaser.Scene) {

  // タイトル
  titleTexts.push(
    this.add.text(90, 180, 'DANMAKU GAME', {
      fontSize: '48px',
      color: '#ffffff',
    })
  )

  titleTexts.push(
    this.add.text(140, 320, '1 : EASY', {
      fontSize: '32px',
      color: '#00ff00',
    })
  )

  titleTexts.push(
    this.add.text(120, 380, '2 : NORMAL', {
      fontSize: '32px',
      color: '#ffff00',
    })
  )

  titleTexts.push(
    this.add.text(140, 440, '3 : HARD', {
      fontSize: '32px',
      color: '#ff0000',
    })
  )

  titleTexts.push(
    this.add.text(60, 560, 'PRESS NUMBER KEY', {
      fontSize: '32px',
      color: '#ffffff',
    })
  )

  // プレイヤー
  player = this.add.rectangle(
    240,
    600,
    30,
    30,
    0x00ff00
  )

  // キー
  cursors = this.input.keyboard!.createCursorKeys()

  restartKey = this.input.keyboard!.addKey(
    Phaser.Input.Keyboard.KeyCodes.R
  )

  shiftKey = this.input.keyboard!.addKey(
    Phaser.Input.Keyboard.KeyCodes.SHIFT
  )

  // スコア
  scoreText = this.add.text(20, 20, 'Score: 0', {
    fontSize: '32px',
    color: '#ffffff',
  })

  scoreText.setVisible(false)

  // 難易度選択
  this.input.keyboard!.on('keydown-ONE', () => {

    if (gameState !== 'title') return

    difficulty = 'EASY'
    bulletSpeed = 2
    spawnDelay = 700

    titleTexts.forEach((text) => text.destroy())

    scoreText.setVisible(true)

    gameState = 'playing'
  })

  this.input.keyboard!.on('keydown-TWO', () => {

    if (gameState !== 'title') return

    difficulty = 'NORMAL'
    bulletSpeed = 3
    spawnDelay = 500

    titleTexts.forEach((text) => text.destroy())

    scoreText.setVisible(true)

    gameState = 'playing'
  })

  this.input.keyboard!.on('keydown-THREE', () => {

    if (gameState !== 'title') return

    difficulty = 'HARD'
    bulletSpeed = 5
    spawnDelay = 300

    titleTexts.forEach((text) => text.destroy())

    scoreText.setVisible(true)

    gameState = 'playing'
  })

  // 狙い弾
  this.time.addEvent({
    delay: spawnDelay,
    loop: true,
    callback: () => {

      if (gameOver) return
      if (gameState !== 'playing') return

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
      if (gameState !== 'playing') return

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

  // タイトル中
  if (gameState === 'title') {
    return
  }

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

  scoreText.setText(
    `Score: ${score}  ${difficulty}`
  )

  // 低速移動
  const moveSpeed =
    shiftKey.isDown ? 2 : 5

  // 移動
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
  player.x = Phaser.Math.Clamp(
    player.x,
    15,
    465
  )

  player.y = Phaser.Math.Clamp(
    player.y,
    15,
    705
  )

  // 弾移動
  for (
    let i = bullets.length - 1;
    i >= 0;
    i--
  ) {

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
    const distance =
      Phaser.Math.Distance.Between(
        player.x,
        player.y,
        bullet.shape.x,
        bullet.shape.y
      )

    if (distance < 25) {

      gameOver = true

      this.add.text(
        110,
        350,
        'GAME OVER',
        {
          fontSize: '48px',
          color: '#ffffff',
        }
      )

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