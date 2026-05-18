import Phaser from 'phaser'

export function createGameConfig(
  create: Phaser.Types.Scenes.SceneCreateCallback,
  update: Phaser.Types.Scenes.SceneUpdateCallback
): Phaser.Types.Core.GameConfig {

  return {
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
      update,
    },
  }
}