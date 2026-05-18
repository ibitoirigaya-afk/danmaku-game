export function getRank(
  missCount: number,
  spellSuccess: number
) {

  if (
    missCount === 0 &&
    spellSuccess >= 3
  ) {
    return 'S'
  }

  if (missCount <= 1) {
    return 'A'
  }

  if (missCount <= 3) {
    return 'B'
  }

  return 'C'
}

export function showRanking(
  scene: Phaser.Scene,
  data: any[],
  rankingTexts: Phaser.GameObjects.Text[],
  difficulty: string,
  playerName: string,
  score: number
) {

  rankingTexts.forEach(
    (t) => t.destroy()
  )

  rankingTexts.length = 0

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