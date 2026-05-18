import {
  describe,
  expect,
  it,
} from 'vitest'

import {
  createRanking,
} from './ranking'

describe('createRanking', () => {

  it('スコアが高い順に並ぶ', () => {

    const result =
      createRanking(
        [
          { name: 'AAA', score: 100 },
          { name: 'BBB', score: 300 },
        ],
        { name: 'CCC', score: 200 }
      )

    expect(result[0].name).toBe('BBB')
    expect(result[1].name).toBe('CCC')
    expect(result[2].name).toBe('AAA')
  })

  it('上位5件だけ残る', () => {

    const result =
      createRanking(
        [
          { name: 'A', score: 100 },
          { name: 'B', score: 200 },
          { name: 'C', score: 300 },
          { name: 'D', score: 400 },
          { name: 'E', score: 500 },
        ],
        { name: 'F', score: 600 }
      )

    expect(result).toHaveLength(5)
    expect(result[0].name).toBe('F')
    expect(result[4].name).toBe('B')
  })
})