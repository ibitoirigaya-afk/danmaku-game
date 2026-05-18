import {
  describe,
  expect,
  it,
} from 'vitest'

import {
  getRank,
} from './result'

describe('getRank', () => {

  it('ミス0でスペル成功3以上ならS', () => {

    const rank =
      getRank(0, 3)

    expect(rank).toBe('S')
  })

  it('ミス1以下ならA', () => {

    const rank =
      getRank(1, 1)

    expect(rank).toBe('A')
  })

  it('ミス3以下ならB', () => {

    const rank =
      getRank(3, 0)

    expect(rank).toBe('B')
  })

  it('ミス4以上ならC', () => {

    const rank =
      getRank(4, 0)

    expect(rank).toBe('C')
  })
})