import {
  describe,
  expect,
  it,
} from 'vitest'

import {
  createTutorialText,
} from './tutorial'

describe('createTutorialText', () => {

  it('tutorialTextを生成できる', () => {

    const fakeText = {
      setVisible: () => {},
    }

    const fakeScene = {
      add: {
        text: () => fakeText,
      },
    }

    const result =
      createTutorialText(
        fakeScene as any
      )

    expect(result).toBe(fakeText)
  })
})