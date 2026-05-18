export type RankingRecord = {
  name: string
  score: number
}

export function createRanking(
  currentRanking: RankingRecord[],
  newRecord: RankingRecord
) {

  const rankings =
    [
      ...currentRanking,
      newRecord,
    ]

  rankings.sort(
    (a, b) => b.score - a.score
  )

  return rankings.slice(0, 5)
}