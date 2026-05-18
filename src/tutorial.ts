export function createTutorialText(
  scene: Phaser.Scene
) {

  const tutorialText =
    scene.add.text(
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

  return tutorialText
}