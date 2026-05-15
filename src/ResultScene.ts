import Phaser from 'phaser'

export default class ResultScene extends Phaser.Scene {

  constructor() {
    super('ResultScene')
  }

  create(data: any) {

    const {
      clear,
      score,
      missCount,
      graze,
      spellSuccess,
      totalBonus,
      rank,
      playerName,
      difficulty,
    } = data

    const title = clear ? 'GAME CLEAR!!' : 'GAME OVER...'
    const titleColor = clear ? '#00ffff' : '#ff4444'

    // 背景
    this.add.rectangle(240, 360, 480, 720, 0x000000)

    // タイトル
    this.add.text(90, 60, title, {
      fontSize: '42px',
      color: titleColor,
      fontStyle: 'bold',
    })

    // スコア表示
    this.add.text(60, 140, `
NAME : ${playerName}
DIFF : ${difficulty}

MISS   : ${missCount}
GRAZE  : ${graze}
SPELL  : ${spellSuccess}
BONUS  : ${totalBonus}

SCORE  : ${Math.floor(score)}
RANK   : ${rank}
    `, {
      fontSize: '26px',
      color: '#ffffff',
    })

    // リスタート案内
    this.add.text(80, 600, 'PRESS R TO RESTART', {
      fontSize: '22px',
      color: '#aaaaaa',
    })

    this.input.keyboard!.on('keydown-R', () => {
      location.reload()
    })
  }
}