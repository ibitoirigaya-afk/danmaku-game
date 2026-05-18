import Phaser from 'phaser'
// import { io } from 'socket.io-client'

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 480,
  height: 720,
  backgroundColor: '#000000',

  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },

  scene: {
    create,
    update
  }, 
}

new Phaser.Game(config)

// =====================================
// 難易度
// =====================================

type Difficulty =
  | 'EASY'
  | 'NORMAL'
  | 'HARD'

let difficulty: Difficulty =
  'EASY'

// =====================================
// 状態
// =====================================

type GameState =
  | 'title'
  | 'tutorial'
  | 'playing'
  | 'gameover'

let gameState: GameState =
  'title'

// =====================================
// プレイヤー
// =====================================

let player: Phaser.GameObjects.Rectangle
let hitbox: Phaser.GameObjects.Arc

let playerHP = 3
let bombCount = 3
let graze = 0

let invincible = false
let invincibleTimer = 0

let playerName = ''

// =====================================
// ボス
// =====================================

let boss: Phaser.GameObjects.Arc

let bossHP = 120
const maxBossHP = 120

let phase = 1

let phase2Started = false
let phase3Started = false

let phaseChanging = false

let spiralAngle = 0

// const socket =
//   io('http://192.168.11.32:3000',{
//     reconnection: true,
//   reconnectionAttempts: 5, // 無限にリトライせず回数を制限
//   reconnectionDelay: 1000, // 1秒おきに再試行
//   transports: ['websocket'] // 可能ならWebSocketに固定して安定させる
//   });

// =====================================
// キー
// =====================================

let cursors: Phaser.Types.Input.Keyboard.CursorKeys

let shootKey!: Phaser.Input.Keyboard.Key
let shiftKey!: Phaser.Input.Keyboard.Key
let bombKey!: Phaser.Input.Keyboard.Key
let testAttackKey!: Phaser.Input.Keyboard.Key

let isTouchDevice = false

let isTouching = false
let touchX = 0
let touchY = 0

let bombButton: Phaser.GameObjects.Text

let startButton: Phaser.GameObjects.Text
let easyButton: Phaser.GameObjects.Text
let normalButton: Phaser.GameObjects.Text
let hardButton: Phaser.GameObjects.Text

let shootCooldown = 0
let lastTapTime = 0
let nameInput: HTMLInputElement | null = null

// =====================================
// UI
// =====================================

let score = 0

let missCount = 0

let spellSuccess = 0

let totalBonus = 0

let scoreText: Phaser.GameObjects.Text
let playerHPText: Phaser.GameObjects.Text
let bombText: Phaser.GameObjects.Text
let grazeText: Phaser.GameObjects.Text
let phaseText: Phaser.GameObjects.Text
let uiText: Phaser.GameObjects.Text
let spellText: Phaser.GameObjects.Text
let nameText: Phaser.GameObjects.Text
let warningText: Phaser.GameObjects.Text
let tutorialText: Phaser.GameObjects.Text
let spellBonus = true
let bossHPBarBg: Phaser.GameObjects.Rectangle
let bossHPBar: Phaser.GameObjects.Rectangle

let damageFlash: Phaser.GameObjects.Rectangle

let rankingTexts:
  Phaser.GameObjects.Text[] = []

// =====================================
// 弾
// =====================================

type Bullet = {
  shape: Phaser.GameObjects.Arc
  vx: number
  vy: number
  type: 'player' | 'enemy'
  grazed?: boolean
}

const bullets: Bullet[] = []

// =====================================
// CREATE
// =====================================

function create(this: Phaser.Scene) {
  isTouchDevice =
  window.innerWidth < 768

  // =====================================
  // プレイヤー
  // =====================================

  player = this.add.rectangle(
    240,
    650,
    20,
    20,
    0x00ff88
  )

  hitbox = this.add.circle(
    240,
    650,
    4,
    0xffffff
  )

  hitbox.setVisible(false)

  // =====================================
  // ボス
  // =====================================

  boss = this.add.circle(
    240,
    -100,
    30,
    0xff0000
  )

  // =====================================
  // キー
  // =====================================

  cursors =
    this.input.keyboard!.createCursorKeys()

  shootKey =
    this.input.keyboard!.addKey('Z')



  shiftKey =
    this.input.keyboard!.addKey('SHIFT')

  bombKey =
    this.input.keyboard!.addKey('X')

  testAttackKey =
  this.input.keyboard!.addKey('T')

this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {

  if (gameState === 'tutorial') {

  tutorialText.setVisible(false)

  startBossEntrance(this)

  return
}

  if (!isTouchDevice) return
  if (gameState !== 'playing') return

  const now = Date.now()

  if (now - lastTapTime < 300) {

    useBomb(this)

    lastTapTime = 0

    return
  }

  lastTapTime = now

  isTouching = true
  touchX = pointer.x
  touchY = pointer.y
})

this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {

  if (!isTouchDevice) return
  if (!isTouching) return
  if (gameState !== 'playing') return

  touchX = pointer.x
  touchY = pointer.y
})

this.input.on('pointerup', () => {

  if (!isTouchDevice) return

  isTouching = false
})

  // =====================================
  // 難易度選択
  // =====================================

  this.input.keyboard!.on(
    'keydown-ONE',
    () => {
      difficulty = 'EASY'
    }
  )

  this.input.keyboard!.on(
    'keydown-TWO',
    () => {
      difficulty = 'NORMAL'
    }
  )

  this.input.keyboard!.on(
    'keydown-THREE',
    () => {
      difficulty = 'HARD'
    }
  )

  // =====================================
  // UI
  // =====================================

  scoreText = this.add.text(
    10,
    10,
    '',
    {
      fontSize: '18px',
      color: '#ffffff',
    }
  )

  playerHPText = this.add.text(
    10,
    35,
    '',
    {
      fontSize: '24px',
      color: '#ff6666',
    }
  )

  bombText = this.add.text(
    10,
    70,
    '',
    {
      fontSize: '18px',
      color: '#00ffff',
    }
  )

  grazeText = this.add.text(
    10,
    95,
    '',
    {
      fontSize: '18px',
      color: '#ffff00',
    }
  )

  phaseText = this.add.text(
    10,
    120,
    '',
    {
      fontSize: '18px',
      color: '#ff88ff',
    }
  )

  uiText = this.add.text(
    70,
    90,
    'SELECT DIFFICULTY\nAND START',
    {
      fontSize: '28px',
      color: '#ffffff',
      align: 'center',
    }
  )

  nameText = this.add.text(
    120,
    380,
    'NAME:',
    {
      fontSize: '24px',
      color: '#ffffff',
    }
  )

  nameText.setInteractive()

nameText.on(
  'pointerdown',
  () => {

    if (!isTouchDevice) return

    if (gameState !== 'title') {
      return
    }

    openNameInput()
  }
)

  easyButton = this.add.text(60, 470, 'EASY', {
  fontSize: '24px',
  color: '#00ff00',
  backgroundColor: '#333333',
  padding: { x: 12, y: 8 },
})

normalButton = this.add.text(180, 470, 'NORMAL', {
  fontSize: '24px',
  color: '#ffff00',
  backgroundColor: '#333333',
  padding: { x: 12, y: 8 },
})

hardButton = this.add.text(330, 470, 'HARD', {
  fontSize: '24px',
  color: '#ff4444',
  backgroundColor: '#333333',
  padding: { x: 12, y: 8 },
})

easyButton.setInteractive()
normalButton.setInteractive()
hardButton.setInteractive()

easyButton.setVisible(true)
normalButton.setVisible(true)
hardButton.setVisible(true)

easyButton.on('pointerdown', () => {
  difficulty = 'EASY'
})

normalButton.on('pointerdown', () => {
  difficulty = 'NORMAL'
})

hardButton.on('pointerdown', () => {
  difficulty = 'HARD'
})

startButton = this.add.text(170, 540, 'START', {
  fontSize: '28px',
  color: '#ffffff',
  backgroundColor: '#333333',
  padding: { x: 16, y: 10 },
})

startButton.setInteractive()
startButton.setVisible(true)

startButton.on('pointerdown', () => {
  startGame(this)
})

  spellText = this.add.text(
    240,
    200,
    '',
    {
      fontSize: '32px',
      color: '#ff4444',
    }
  )

  spellText.setOrigin(0.5)
  spellText.setVisible(false)

  warningText = this.add.text(
    240,
    300,
    'WARNING!!',
    {
      fontSize: '54px',
      color: '#ff0000',
      fontStyle: 'bold',
    }
  )

  warningText.setOrigin(0.5)
  warningText.setVisible(false)

  tutorialText = this.add.text(
  40,
  120,
  `EASY MODE

スマホ/タブレット:
画面をスライドして移動
画面を2回タップでボム
弾は自動で発射されます

PC:
矢印キーで移動
Zキーでショット
Xキーでボム

弾をかすめるとGRAZE
被弾なし・ボムなしで
SPELL CARD BONUS!

TAP / CLICK TO START`,
  {
    fontSize: '22px',
    color: '#ffffff',
    align: 'left',
  }
)

tutorialText.setVisible(false)

  bombButton = this.add.text(
  370,
  640,
  'BOMB',
  {
    fontSize: '24px',
    color: '#ffffff',
    backgroundColor: '#333333',
    padding: {
      x: 12,
      y: 8,
    },
  }
)

bombButton.setInteractive()
bombButton.setVisible(false)

// bombButton.on(
//   'pointerdown',
//   (
//     _pointer: Phaser.Input.Pointer,
//     _x: number,
//     _y: number,
//     event: Phaser.Types.Input.EventData
//   ) => {

//     event.stopPropagation()

//     if (gameState !== 'playing') return

//     const now = Date.now()

//     if (now - lastTapTime < 300) {

//       useBomb(this)
//     }

//     lastTapTime = now
//   }
// )

  // =====================================
  // HPバー
  // =====================================

  bossHPBarBg =
    this.add.rectangle(
      280,
      25,
      300,
      18,
      0x444444
    )

  bossHPBar =
    this.add.rectangle(
      280,
      25,
      300,
      18,
      0xff0000
    )

  // =====================================
  // ダメージ
  // =====================================

  damageFlash =
    this.add.rectangle(
      240,
      360,
      480,
      720,
      0xff0000
    )

  damageFlash.setAlpha(0)
  damageFlash.setDepth(999)

  // =====================================
  // 名前入力
  // =====================================

  this.input.keyboard!.on(
    'keydown',
    (event: KeyboardEvent) => {

      if (gameState !== 'title') {
        return
      }

      if (event.key === 'Backspace') {

        playerName =
          playerName.slice(0, -1)

        return
      }

      if (
        /^[a-zA-Z0-9]$/.test(
          event.key
        )
      ) {

        if (
          playerName.length < 8
        ) {

          playerName +=
            event.key.toUpperCase()
        }
      }
    }
  )

  // =====================================
  // START
  // =====================================

this.input.keyboard!.on(
  'keydown-Z',
  () => {

    if (gameState === 'tutorial') {

      tutorialText.setVisible(false)

      startBossEntrance(this)

      return
    }

    startGame(this)
  }
)

  // =====================================
  // RESTART
  // =====================================

  this.input.keyboard!.on(
    'keydown-R',
    () => {

      if (
        gameState === 'gameover'
      ) {

        location.reload()
      }
    }
  )

  // =====================================
  // 弾幕ループ
  // =====================================

  this.time.addEvent({

    delay: 500,

    loop: true,

    callback: () => {

      if (
        gameState !== 'playing'
      ) {
        return
      }

      if (phaseChanging) {
        return
      }

      bossPattern(this)
    },
  })
//   socket.on(
//   'receiveAttack',

//   (data) => {

//     if (
//       data.type === 'circle'
//     ) {

//       enemyAttackBurst(this)
//     }
//   }
// )
}

// =====================================
// UPDATE
// =====================================

function update(this: Phaser.Scene) {

  if (gameState === 'title') {

    nameText.setText(
      `NAME: ${playerName}\n${difficulty}`
    )

    return
  }

  if (gameState !== 'playing') {
    return
  }

  score += 1

  scoreText.setText(
    `Score: ${Math.floor(score)}`
  )

  playerHPText.setText(
    '♥ '.repeat(playerHP)
  )

  bombText.setText(
    `Bomb: ${bombCount}`
  )

  grazeText.setText(
    `Graze: ${graze}`
  )

  phaseText.setText(
    `Phase: ${phase}`
  )

  bossHPBar.width =
    (bossHP / maxBossHP) * 300

  // =====================================
  // ボス移動
  // =====================================

  boss.x =
    240 +
    Math.sin(
      this.time.now * 0.001
    ) * 120

  // =====================================
  // フェーズ移行
  // =====================================

  if (
    bossHP <= 80 &&
    !phase2Started
  ) {

    checkSpellBonus(this)

    phase = 2

    phase2Started = true

    if (difficulty === 'EASY') {

      playerHP = Math.min(
        playerHP + 1,
        3
      )

      bombCount = Math.min(
        bombCount + 1,
        3
      )
    }

    phaseChanging = true

    clearEnemyBullets()

    startPhaseTransition(
      this,
      '「螺旋地獄」', 2
    )
  }

  if (
    bossHP <= 40 &&
    !phase3Started
  ) {

    checkSpellBonus(this)

    phase = 3

    phase3Started = true

    if (difficulty === 'EASY') {

      playerHP = Math.min(
        playerHP + 1,
        3
      )

      bombCount = Math.min(
        bombCount + 1,
        3
      )
    }

    phaseChanging = true

    clearEnemyBullets()

    startPhaseTransition(
      this,
      '「終焉追尾陣」', 3
    )
  }

  // =====================================
  // 無敵
  // =====================================

  if (invincible) {

    invincibleTimer--

    if (invincibleTimer <= 0) {

      invincible = false

      player.setAlpha(1)
    }
  }

  // =====================================
  // 移動
  // =====================================

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

// =====================================
// 自機弾
// =====================================

shootCooldown--

const shouldShoot =
  Phaser.Input.Keyboard.JustDown(shootKey) ||
  (
    isTouchDevice &&
    gameState === 'playing' &&
    shootCooldown <= 0
  )

if (shouldShoot) {

  shootCooldown = 8

  // EASY = 3way
  if (difficulty === 'EASY') {

    for (let i = -1; i <= 1; i++) {

      const bullet =
        this.add.circle(
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
        this.add.circle(
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
      this.add.circle(
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

  // =====================================
  // ボム
  // =====================================

  // update関数内のボム処理部分を書き換え
if (
  Phaser.Input.Keyboard.JustDown(
    bombKey
  )
) {
  useBomb(this)
}

if (
  Phaser.Input.Keyboard.JustDown(
    testAttackKey
  )
) {

  // socket.emit(
  //   'grazeAttack'
  // )
}

  // =====================================
  // 弾更新
  // =====================================

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

        if (graze % 10 === 0) {

  // socket.emit(
  //   'grazeAttack'
  // )
}

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

        damageEffect(this)

        invincible = true

        invincibleTimer = 120

        player.x = 240
        player.y = 650

        if (playerHP <= 0) {

          gameOver(this)

          return
        }
      }
    }

    // 自機弾 → ボス

    if (
      b.type === 'player'
    ) {

      const dBoss =
        Phaser.Math.Distance.Between(
          boss.x,
          boss.y,
          b.shape.x,
          b.shape.y
        )

      if (dBoss < 30) {

        bossHP--

        b.shape.destroy()

        bullets.splice(i, 1)

        if (bossHP <= 0) {

          checkSpellBonus(this)

          clearGame(this)

          return
        }
      }
    }

    // 削除

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
}

// =====================================
// ボス弾幕
// =====================================

function bossPattern(
  scene: Phaser.Scene
) {

  if (phase === 1) {

    spiral(scene)

    fan(scene)
  }

  if (phase === 2) {

    spiral(scene)

    fan(scene)

    circleBurst(scene)
  }

  if (phase === 3) {

    spiral(scene)

    fan(scene)

    circleBurst(scene)

    homing(scene)
  }

  if (
    difficulty === 'HARD'
  ) {

    circleBurst(scene)
  }
}

// =====================================
// 螺旋
// =====================================

function spiral(
  scene: Phaser.Scene
) {

  let total = 12

  if (
    difficulty === 'NORMAL'
  ) {
    total = 20
  }

  if (
    difficulty === 'HARD'
  ) {
    total = 32
  }

  for (
    let i = 0;
    i < total;
    i++
  ) {

    const angle =
      spiralAngle +
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

  spiralAngle += 0.25
}

// =====================================
// 扇形
// =====================================

function fan(
  scene: Phaser.Scene
) {

  const base =
    Phaser.Math.Angle.Between(
      boss.x,
      boss.y,
      player.x,
      player.y
    )

  let amount = 4

  if (
    difficulty === 'NORMAL'
  ) {
    amount = 6
  }

  if (
    difficulty === 'HARD'
  ) {
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

// =====================================
// 円形
// =====================================

function circleBurst(
  scene: Phaser.Scene
) {

  let total = 20

  if (
    difficulty === 'NORMAL'
  ) {
    total = 30
  }

  if (
    difficulty === 'HARD'
  ) {
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

// =====================================
// 追尾
// =====================================

function homing(
  scene: Phaser.Scene
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

// =====================================
// ボス登場
// =====================================

function startBossEntrance(
  scene: Phaser.Scene
) {

  gameState = 'playing'

  phaseChanging = true

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

          phaseChanging = false

          spellBonus = true

          spellCard(
            scene,
            `PHASE ${phase}`
          )
        },
      })
    }
  )
}

// =====================================
// フェーズ演出
// =====================================

function startPhaseTransition(
  scene: Phaser.Scene,
  spellName: string,
  phaseLevel: number // どのフェーズへ行くかを指定
) {
  phaseChanging = true;

  // --- フェーズごとの演出設定 ---
  const isFinal = phaseLevel === 3;
  const effectColor = isFinal ? 0xff0000 : 0x00ffff; // 3は赤、2は青
  const flashAlpha = isFinal ? 1.0 : 0.5;

  // 1. 画面フラッシュ（色の変化）
  const flash = scene.add.rectangle(240, 360, 480, 720, effectColor);
  flash.setAlpha(0).setDepth(1000);
  scene.tweens.add({
    targets: flash,
    alpha: flashAlpha,
    duration: isFinal ? 400 : 150,
    yoyo: true,
    onComplete: () => flash.destroy()
  });

  // 2. 衝撃波リング（フェーズ3はより大きく、多く）
  const count = isFinal ? 10 : 4;
  for (let i = 0; i < count; i++) {
    const ring = scene.add.circle(boss.x, boss.y, 10, effectColor, 0);
    ring.setStrokeStyle(isFinal ? 4 : 2, effectColor);
    scene.tweens.add({
      targets: ring,
      radius: isFinal ? 800 : 400,
      alpha: 0,
      delay: i * (isFinal ? 80 : 150),
      duration: 1000,
      onComplete: () => ring.destroy()
    });
  }

  // 3. 最終フェーズ限定：画面の激しい揺れ
  if (isFinal) {
    scene.cameras.main.shake(1000, 0.02);
  }

  // --- 共通のボス移動とテキスト表示 ---
  boss.y = -100;
  warningText.setVisible(true);
  // フェーズ3は警告文字を赤く、フェーズ2は青白く
  warningText.setColor(isFinal ? '#ff0000' : '#88ffff');

  scene.time.delayedCall(2000, () => {
    warningText.setVisible(false);
    scene.tweens.add({
      targets: boss,
      y: 120,
      duration: isFinal ? 2000 : 1200, // 最終ボスはゆっくり威圧的に登場
      ease: 'Back.easeOut', // 少し行き過ぎて戻る動き
      onComplete: () => {
        phaseChanging = false;
        spellBonus = true;
        spellCard(scene, spellName);
      },
    });
  });
}

// =====================================
// スペル表示
// =====================================

function spellCard(
  scene: Phaser.Scene,
  name: string
) {

  spellText.setText(name)

  spellText.setVisible(true)

  scene.time.delayedCall(
    2000,
    () => {

      spellText.setVisible(false)
    }
  )
}

// =====================================
// 敵弾削除
// =====================================

function clearEnemyBullets() {

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

// =====================================
// ダメージ演出
// =====================================

function damageEffect(
  scene: Phaser.Scene
) {

  damageFlash.setAlpha(0.5)

  scene.tweens.add({

    targets: damageFlash,

    alpha: 0,

    duration: 250,
  })
}

// =====================================
// GAME OVER
// =====================================

function gameOver(scene: Phaser.Scene) {

  gameState = 'gameover'

  showResult(scene, false)

  saveScore(scene)
}

// =====================================
// CLEAR
// =====================================

function clearGame(scene: Phaser.Scene) {

  gameState = 'gameover'

  showResult(scene, true)

  saveScore(scene)
}

// =====================================
// スコア保存
// =====================================

function saveScore(
  scene: Phaser.Scene
) {

  const saved =
    localStorage.getItem(
      `ranking-${difficulty}`
    )

  let rankings = saved
    ? JSON.parse(saved)
    : []

  rankings.push({
    name: playerName,
    score: Math.floor(score),
  })

  rankings.sort(
    (a: any, b: any) =>
      b.score - a.score
  )

  rankings = rankings.slice(0, 5)

  localStorage.setItem(
    `ranking-${difficulty}`,
    JSON.stringify(rankings)
  )

  showRanking(scene, rankings)
}

// =====================================
// ランキング
// =====================================

function showRanking(
  scene: Phaser.Scene,
  data: any[]
) {

  rankingTexts.forEach(
    (t) => t.destroy()
  )

  rankingTexts = []

  const title =
    scene.add.text(

      110,
      520,

      `${difficulty} RANKING`,

      {
        fontSize: '22px',
        color: '#ffff00',
      }
    )

  rankingTexts.push(title)

  data
    .slice(0, 5)

    .forEach((r, i) => {

      const isPlayer =

        r.name === playerName &&
        Math.floor(r.score) ===
        Math.floor(score)

      const text =
        scene.add.text(

          90,
          570 + i * 30,

          `${i + 1}. ${r.name} ${Math.floor(r.score)}`,

          {
            fontSize: '22px',

            color:
              isPlayer
                ? '#00ff88'
                : '#ffffff',
          }
        )

      rankingTexts.push(text)
    })
  }

  function checkSpellBonus(
  scene: Phaser.Scene
) {

  if (!spellBonus) {

    spellBonus = true

    return
  }

  score += 50000

  spellSuccess++

totalBonus += 50000

  const bonusText =
    scene.add.text(

      240,
      260,

      'SPELL CARD BONUS\n+50000',

      {
        fontSize: '32px',
        color: '#00ffff',
        align: 'center',
      }
    )

  bonusText.setOrigin(0.5)

  scene.tweens.add({

    targets: bonusText,

    alpha: 0,

    y: 220,

    duration: 2000,

    onComplete: () => {

      bonusText.destroy()
    },
  })

  spellBonus = true
}


function getRank() {

  if (
    missCount === 0 &&
    spellSuccess >= 3
  ) {
    return 'S'
  }

  if (
    missCount <= 1
  ) {
    return 'A'
  }

  if (
    missCount <= 3
  ) {
    return 'B'
  }

  return 'C'
}

function showResult(
  scene: Phaser.Scene,
  clear: boolean
) {

  player.setVisible(false)

hitbox.setVisible(false)

boss.setVisible(false)

bossHPBar.setVisible(false)

bossHPBarBg.setVisible(false)

scoreText.setVisible(false)

playerHPText.setVisible(false)

bombText.setVisible(false)

grazeText.setVisible(false)

phaseText.setVisible(false)

spellText.setVisible(false)

warningText.setVisible(false)

bullets.forEach((b) => {

  b.shape.destroy()
})

bullets.length = 0

  const rank = getRank()

  const title = clear
    ? 'GAME CLEAR!!'
    : 'GAME OVER...'

  const titleColor = clear
    ? '#00ffff'
    : '#ff4444'

  const resultText =
    scene.add.text(

      60,
      60,

      `

MISS   : ${missCount}

GRAZE  : ${graze}

SPELL  : ${spellSuccess}

BONUS  : ${totalBonus}

----------------

SCORE : ${Math.floor(score)}

RANK : ${rank}
      `,

      {
        fontSize: '22px',
        color: '#ffffff',
      }
    )

  resultText.setDepth(999)

  const titleText =
    scene.add.text(

      90,
      60,

      title,

      {
        fontSize: '42px',
        color: titleColor,
        fontStyle: 'bold',
      }
    )

  titleText.setDepth(999)

  if (rank === 'S') {

    const sText =
      scene.add.text(

        320,
        90,

        'MASTER!',

        {
          fontSize: '22px',
          color: '#ffff00',
        }
      )

    sText.setDepth(999)
  }

    const backText =
  scene.add.text(

    90,
    500,

    'TAP TO RETURN TITLE',

    {
      fontSize: '24px',
      color: '#00ffff',
    }
  )

backText.setDepth(999)

scene.input.once(
  'pointerdown',
  () => {

    location.reload()
  }
)

}

  function startGame(scene: Phaser.Scene) {

  if (gameState !== 'title') return

  if (nameInput) {
  nameInput.remove()
  nameInput = null
}

  if (playerName === '') {
    playerName = 'NO NAME'
  }

  if (difficulty === 'EASY') {
    playerHP = 3
    bombCount = 3
  }

  if (difficulty === 'NORMAL') {
    playerHP = 3
    bombCount = 2
  }

  if (difficulty === 'HARD') {
    playerHP = 3
    bombCount = 1
  }

  uiText.setVisible(false)
nameText.setVisible(false)

easyButton?.setVisible(false)
normalButton?.setVisible(false)
hardButton?.setVisible(false)
startButton?.setVisible(false)

if (difficulty === 'EASY') {

  gameState = 'tutorial'

  tutorialText.setDepth(1000)

  tutorialText.setVisible(true)

  return
}

startBossEntrance(scene)
}

function useBomb(scene: Phaser.Scene) {

  if (bombCount <= 0) return

  bombCount--

  spellBonus = false

  invincible = true
  invincibleTimer = 180

  clearEnemyBullets()

  const flash =
    scene.add.rectangle(
      240,
      360,
      480,
      720,
      0xffffff
    )

  flash.setAlpha(0.8)
  flash.setDepth(1000)

  scene.tweens.add({
    targets: flash,
    alpha: 0,
    duration: 500,
    onComplete: () => flash.destroy(),
  })

  const ring =
    scene.add.circle(
      player.x,
      player.y,
      10,
      0x00ffff,
      0
    )

  ring.setStrokeStyle(4, 0x00ffff)

  scene.tweens.add({
    targets: ring,
    radius: 500,
    alpha: 0,
    duration: 600,
    onComplete: () => ring.destroy(),
  })
}

function openNameInput() {

  if (nameInput) {
    nameInput.focus()
    return
  }

  nameInput =
    document.createElement('input')

  nameInput.type = 'text'
  nameInput.maxLength = 8
  nameInput.value =
    playerName === 'NO NAME'
      ? ''
      : playerName

  nameInput.placeholder = 'NAME'
  nameInput.style.position = 'fixed'
  nameInput.style.left = '50%'
  nameInput.style.top = '55%'
  nameInput.style.transform = 'translate(-50%, -50%)'
  nameInput.style.fontSize = '24px'
  nameInput.style.width = '180px'
  nameInput.style.textAlign = 'center'
  nameInput.style.zIndex = '9999'

  document.body.appendChild(nameInput)

  nameInput.focus()

  nameInput.addEventListener('input', () => {

    playerName =
      nameInput!.value
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, '')
        .slice(0, 8)
  })

  nameInput.addEventListener('blur', () => {

    if (nameInput) {
      nameInput.remove()
      nameInput = null
    }
  })

  nameInput.addEventListener('keydown', (e) => {

    if (e.key === 'Enter') {

      nameInput?.blur()
    }
  })
}