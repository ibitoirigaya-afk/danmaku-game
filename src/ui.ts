export function spellCard(
  scene: Phaser.Scene,
  spellText: Phaser.GameObjects.Text,
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

export function checkSpellBonus(
  scene: Phaser.Scene,
  spellBonus: boolean,
  score: number,
  spellSuccess: number,
  totalBonus: number
) {

  if (!spellBonus) {

    return {
      score,
      spellSuccess,
      totalBonus,
      spellBonus: true,
    }
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

  return {
    score,
    spellSuccess,
    totalBonus,
    spellBonus: true,
  }
}