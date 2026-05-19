import Phaser from 'phaser'

import {
  createGameConfig,
} from './config'

import {
  startBossEntrance as startBossEntranceScene,
  startPhaseTransition as startPhaseTransitionScene,
} from './scene'

import {
  createTutorialText,
} from './tutorial'

import {
  checkSpellBonus,
} from './ui'

import {
  getRank,
  showRanking,
} from './result'

import {
  handleBullets,
} from './collision'

import {
  movePlayer,
  shootPlayerBullets,
} from './player'

import {
  bossPattern,
} from './boss'

import {
  createRanking,
} from './ranking'

import {
  clearEnemyBullets,
  damageEffect,
  bossExplosion,
} from './effects'

import {
  bgm,
  bombSE,
  explosionSE,
  gameOverSE,
  setupSounds,
  playSE,
  stage2Bgm,
} from './sounds'

import type {
  Difficulty,
  GameState,
  Bullet,
  Stage,
} from './types'

const config =
  createGameConfig(
    create,
    update
  )

new Phaser.Game(config)

let difficulty: Difficulty =
  'EASY'

let stage: Stage =
  'STAGE1'

let gameState: GameState =
  'title'

let player: Phaser.GameObjects.Rectangle
let hitbox: Phaser.GameObjects.Arc

let playerHP = 3
let bombCount = 3
let graze = 0

let invincible = false
let invincibleTimer = 0

let playerName = ''

let boss: Phaser.GameObjects.Arc

let bossHP = 120
const maxBossHP = 120

let phase = 1

let phase2Started = false
let phase3Started = false

let phaseChanging = false

let spiralAngleRef = {
  value: 0,
}

let bossTimerRef = {
  value: 0,
}

let cursors: Phaser.Types.Input.Keyboard.CursorKeys

let shootKey!: Phaser.Input.Keyboard.Key
let shiftKey!: Phaser.Input.Keyboard.Key
let bombKey!: Phaser.Input.Keyboard.Key

let isTouchDevice = false

let isTouching = false
let touchX = 0
let touchY = 0

let startButton: Phaser.GameObjects.Text
let easyButton: Phaser.GameObjects.Text
let normalButton: Phaser.GameObjects.Text
let hardButton: Phaser.GameObjects.Text

let stage1Button: Phaser.GameObjects.Text
let stage2Button: Phaser.GameObjects.Text

let shootCooldown = 0
let lastTapTime = 0
let nameInput: HTMLInputElement | null = null

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

let gameOverTitleText: Phaser.GameObjects.Text
let tapToResultText: Phaser.GameObjects.Text

let damageFlash: Phaser.GameObjects.Rectangle

let rankingTexts:
  Phaser.GameObjects.Text[] = []

const bullets: Bullet[] = []

function create(this: Phaser.Scene) {
  isTouchDevice =
    window.innerWidth < 768

  setupSounds()

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

  boss = this.add.circle(
    240,
    -100,
    30,
    0xff0000
  )

  cursors =
    this.input.keyboard!.createCursorKeys()

  shootKey =
    this.input.keyboard!.addKey('Z')



  shiftKey =
    this.input.keyboard!.addKey('SHIFT')

  bombKey =
    this.input.keyboard!.addKey('X')

this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {

  if (gameState === 'tutorial') {

  tutorialText.setVisible(false)

startBossEntranceScene(
  this,
  boss,
  warningText,
  spellText,
  phase,
  () => {
    gameState = 'playing'
  },
  (value) => {
    phaseChanging = value
  },
  (value) => {
    spellBonus = value
  }
)

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

  stage1Button = this.add.text(80, 300, 'STAGE 1', {
  fontSize: '24px',
  color: '#00ffff',
  backgroundColor: '#333333',
  padding: { x: 12, y: 8 },
})

stage2Button = this.add.text(260, 300, 'STAGE 2', {
  fontSize: '24px',
  color: '#ff88ff',
  backgroundColor: '#333333',
  padding: { x: 12, y: 8 },
})

stage1Button.setInteractive()
stage2Button.setInteractive()

stage1Button.setAlpha(1)
stage2Button.setAlpha(0.5)

stage1Button.on('pointerdown', () => {
  stage = 'STAGE1'

  stage1Button.setAlpha(1)
  stage2Button.setAlpha(0.5)
})

stage2Button.on('pointerdown', () => {
  stage = 'STAGE2'

  stage1Button.setAlpha(0.5)
  stage2Button.setAlpha(1)
})

  nameText = this.add.text(
    120,
    360,
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

easyButton.setAlpha(1)
normalButton.setAlpha(0.5)
hardButton.setAlpha(0.5)

easyButton.on('pointerdown', () => {
  difficulty = 'EASY'

  easyButton.setAlpha(1)
  normalButton.setAlpha(0.5)
  hardButton.setAlpha(0.5)
})

normalButton.on('pointerdown', () => {
  difficulty = 'NORMAL'

  easyButton.setAlpha(0.5)
  normalButton.setAlpha(1)
  hardButton.setAlpha(0.5)
})

hardButton.on('pointerdown', () => {
  difficulty = 'HARD'

  easyButton.setAlpha(0.5)
  normalButton.setAlpha(0.5)
  hardButton.setAlpha(1)
})

startButton = this.add.text(170, 560, 'START', {
  fontSize: '28px',
  color: '#ffffff',
  backgroundColor: '#333333',
  padding: { x: 16, y: 10 },
})

startButton.setInteractive()
startButton.setVisible(true)

startButton.on(
  'pointerdown',
  (
    _pointer: Phaser.Input.Pointer,
    _x: number,
    _y: number,
    event: Phaser.Types.Input.EventData
  ) => {

    event.stopPropagation()

    startGame(this)
  }
)

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

  tutorialText =
    createTutorialText(this)

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

this.input.keyboard!.on(
  'keydown-Z',
  () => {

    if (gameState === 'tutorial') {

      tutorialText.setVisible(false)

startBossEntranceScene(
  this,
  boss,
  warningText,
  spellText,
  phase,
  () => {
    gameState = 'playing'
  },
  (value) => {
    phaseChanging = value
  },
  (value) => {
    spellBonus = value
  }
)

      return
    }

    startGame(this)
  }
)

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

      bossPattern(
  this,
  phase,
  difficulty,
  stage,
  boss,
  player,
  bullets,
  spiralAngleRef,
  bossTimerRef
)
    },
  })
}

function update(this: Phaser.Scene) {

  if (gameState === 'title') {

    nameText.setText(
  `NAME: ${playerName}\n${stage}\n${difficulty}`
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

  boss.x =
    240 +
    Math.sin(
      this.time.now * 0.001
    ) * 120

  if (
    bossHP <= 80 &&
    !phase2Started
  ) {

    const bonusResult =
  checkSpellBonus(
    this,
    spellBonus,
    score,
    spellSuccess,
    totalBonus
  )

score = bonusResult.score
spellSuccess = bonusResult.spellSuccess
totalBonus = bonusResult.totalBonus
spellBonus = bonusResult.spellBonus

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

    clearEnemyBullets(bullets)

    const phase2Name =
  stage === 'STAGE2'
    ? '「蒼月波紋」'
    : '「螺旋地獄」'

    startPhaseTransitionScene(
  this,
  boss,
  warningText,
  spellText,
  phase2Name,
  2,
  (value) => {
    phaseChanging = value
  },
  (value) => {
    spellBonus = value
  }
)
  }

  if (
    bossHP <= 40 &&
    !phase3Started
  ) {

    const bonusResult =
  checkSpellBonus(
    this,
    spellBonus,
    score,
    spellSuccess,
    totalBonus
  )

score = bonusResult.score
spellSuccess = bonusResult.spellSuccess
totalBonus = bonusResult.totalBonus
spellBonus = bonusResult.spellBonus

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

    clearEnemyBullets(bullets)

    const phase3Name =
  stage === 'STAGE2'
    ? '「紅蓮十字陣」'
    : '「終焉追尾陣」'

    startPhaseTransitionScene(
  this,
  boss,
  warningText,
  spellText,
  phase3Name,
  3,
  (value) => {
    phaseChanging = value
  },
  (value) => {
    spellBonus = value
  }
)
  }

  if (invincible) {

    invincibleTimer--

    if (invincibleTimer <= 0) {

      invincible = false

      player.setAlpha(1)
    }
  }

  movePlayer(
  player,
  hitbox,
  cursors,
  shiftKey,
  isTouchDevice,
  isTouching,
  touchX,
  touchY
)

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

  shootPlayerBullets(
    this,
    player,
    difficulty,
    bullets
  )
}

if (
  Phaser.Input.Keyboard.JustDown(
    bombKey
  )
) {
  useBomb(this)
}

const bulletResult =
  handleBullets({
    bullets,
    player,
    hitbox,
    boss,
    invincible,
    score,
    graze,
    playerHP,
    missCount,
    spellBonus,

    onDamage: () => {

      damageEffect(this, damageFlash)

      invincible = true
      invincibleTimer = 120

      player.x = 240
      player.y = 650
    },

    onGameOver: () => {

      gameOver(this)
    },

    onBossDefeated: () => {

      bossHP--
    },
  })

score = bulletResult.score
graze = bulletResult.graze
playerHP = bulletResult.playerHP
missCount = bulletResult.missCount
spellBonus = bulletResult.spellBonus

if (bulletResult.bossHit && bossHP <= 0) {

  const bonusResult =
    checkSpellBonus(
      this,
      spellBonus,
      score,
      spellSuccess,
      totalBonus
    )

  score = bonusResult.score
  spellSuccess = bonusResult.spellSuccess
  totalBonus = bonusResult.totalBonus
  spellBonus = bonusResult.spellBonus

  clearGame(this)

  return
}

}
function gameOver(scene: Phaser.Scene) {

  gameState = 'gameover'

  bgm.pause()
  stage2Bgm.pause()

  playSE(gameOverSE)

  clearPlayScreen()

  gameOverTitleText = scene.add.text(
    240,
    300,
    'GAME OVER',
    {
      fontSize: '52px',
      color: '#ff0000',
      fontStyle: 'bold',
    }
  )

  gameOverTitleText.setOrigin(0.5)
  gameOverTitleText.setDepth(1000)

  tapToResultText = scene.add.text(
    240,
    420,
    'TAP TO RESULT',
    {
      fontSize: '26px',
      color: '#ffffff',
    }
  )

  tapToResultText.setOrigin(0.5)
  tapToResultText.setDepth(1000)

  scene.tweens.add({
    targets: tapToResultText,
    alpha: 0.3,
    yoyo: true,
    repeat: -1,
    duration: 600,
  })

  scene.input.once(
    'pointerdown',
    () => {

      gameOverTitleText.destroy()
      tapToResultText.destroy()

      showResult(scene, false)

      saveScore(scene)
    }
  )
}

function clearGame(scene: Phaser.Scene) {

  gameState = 'gameover'

  bgm.pause()
  stage2Bgm.pause()

  clearEnemyBullets(bullets)

  playSE(explosionSE)

  bossExplosion(scene, boss)

  scene.time.delayedCall(
    1500,
    () => {

      showResult(scene, true)

      saveScore(scene)
    }
  )
}

function saveScore(
  scene: Phaser.Scene
) {

const saved =
  localStorage.getItem(
    `ranking-${stage}-${difficulty}`
  )

const currentRanking =
  saved
    ? JSON.parse(saved)
    : []

const rankings =
  createRanking(
    currentRanking,
    {
      name: playerName,
      score: Math.floor(score),
    }
  )

localStorage.setItem(
  `ranking-${stage}-${difficulty}`,
  JSON.stringify(rankings)
)

showRanking(
  scene,
  rankings,
  rankingTexts,
  `${stage} ${difficulty}`,
  playerName,
  score
)

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

  const rank =
  getRank(
    missCount,
    spellSuccess
  )

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

bgm.pause()
stage2Bgm.pause()

if (stage === 'STAGE2') {

  stage2Bgm.currentTime = 0
  stage2Bgm.play().catch(() => {})

} else {

  bgm.currentTime = 0
  bgm.play().catch(() => {})
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

  bossTimerRef.value = 0
spiralAngleRef.value = 0

  uiText.setVisible(false)
nameText.setVisible(false)

easyButton?.setVisible(false)
normalButton?.setVisible(false)
hardButton?.setVisible(false)
startButton?.setVisible(false)

if (stage === 'STAGE2') {

  boss.setFillStyle(0x8844ff)
  scene.cameras.main.setBackgroundColor('#12001f')

} else {

  boss.setFillStyle(0xff0000)
  scene.cameras.main.setBackgroundColor('#000000')
}

stage1Button?.setVisible(false)
stage2Button?.setVisible(false)

if (difficulty === 'EASY') {

  gameState = 'tutorial'

  tutorialText.setDepth(1000)

  tutorialText.setVisible(true)

  return
}

startBossEntranceScene(
  scene,
  boss,
  warningText,
  spellText,
  phase,
  () => {
    gameState = 'playing'
  },
  (value) => {
    phaseChanging = value
  },
  (value) => {
    spellBonus = value
  }
)
}

function useBomb(scene: Phaser.Scene) {

  if (bombCount <= 0) return

  playSE(bombSE)

  bombCount--

  spellBonus = false

  invincible = true
  invincibleTimer = 180

  clearEnemyBullets(bullets)

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

function clearPlayScreen() {

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
  tutorialText.setVisible(false)

  bullets.forEach((b) => {
    b.shape.destroy()
  })

  bullets.length = 0
}