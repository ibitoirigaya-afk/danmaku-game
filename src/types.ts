import Phaser from 'phaser'

export type Stage =
  | 'STAGE1'
  | 'STAGE2'

export type Difficulty =
  | 'EASY'
  | 'NORMAL'
  | 'HARD'

export type GameState =
  | 'title'
  | 'tutorial'
  | 'playing'
  | 'gameover'

export type Bullet = {
  shape: Phaser.GameObjects.Arc
  vx: number
  vy: number
  type: 'player' | 'enemy'
  grazed?: boolean
}