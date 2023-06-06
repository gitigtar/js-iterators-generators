import {OverBreak, range} from '../src/lib/range.js'

function stringifyRange({start, finish, step}) {
  let name = 'range('
  if (start) name += `${start}`
  if (finish) name += `, ${finish}`
  if (step) name += `, ${step}`
  name += ')'
  return name
}

function rangeSeqTestName({start, finish, step, expected}) {
  let name = stringifyRange({start, finish, step})
  return `${name} generate the sequence: ${expected}`
}

function OverBreakSeqTestName({start, finish, step, expected}) {
  let name = `OverBreak(${stringifyRange({start, finish, step})})`
  return `${name} generate the sequence: ${expected}`
}

describe('Sequences', () => {
  const cases = [
    {parameters: {start: 1, finish: 4}, result: [1, 2, 3]},
    {
      parameters: {start: 1, finish: 20, step: 3},
      result: [1, 4, 7, 10, 13, 16, 19],
    },
    {
      parameters: {start: 1, finish: -20, step: -3},
      result: [1, -2, -5, -8, -11, -14, -17],
    },
    {
      parameters: {start: 1, finish: -1},
      result: [],
    },
    {
      parameters: {start: 1, finish: 2, step: -1},
      result: [],
    },
    {
      parameters: {start: 1, finish: 1},
      result: [],
    },
  ]

  describe.each(cases)(
    'range',
    ({parameters: {start, finish, step}, result: expected}) => {
      test(rangeSeqTestName({start, finish, step, expected}), () => {
        const sequence = [...range(start, finish, step)]
        expect(sequence).toStrictEqual(expected)
      })
    },
  )

  describe.each(cases)(
    'OverBreak',
    ({parameters: {start, finish, step}, result: expected}) => {
      test(OverBreakSeqTestName({start, finish, step, expected}), () => {
        const sequence = [...new OverBreak(range(start, finish, step))]
        expect(sequence).toStrictEqual(expected)
      })
    },
  )
})

describe('Errors', () => {
  const cases = [
    {
      parameters: {start: 'A'},
      name: 'Throws an error when the parameter `start` is not an integer',
      error: TypeError('Argument `start` must be an integer'),
    },
    {
      parameters: {start: 1, finish: 10.1},
      name: 'Throws an error when the parameter `finish` is not an integer',
      error: TypeError('Argument `finish` must be an integer'),
    },
    {
      parameters: {start: 1, finish: 10, step: '%'},
      name: 'Throws an error when the parameter step  is not an integer',
      error: TypeError('Argument `step` must be an integer'),
    },
    {
      parameters: {start: 1, finish: 10, step: 0},
      name: 'Throws an error when the parameter step is zero',
      error: new Error('Argument `step` must not be zero'),
    },
  ]

  describe.each(cases)(
    'range',
    ({parameters: {start, finish, step}, error, name}) => {
      test(name, () => {
        const sequence = range(start, finish, step)
        expect(() => sequence.next()).toThrow(error)
      })
    },
  )

  describe.each(cases)(
    'OverBreak',
    ({parameters: {start, finish, step}, error, name}) => {
      test(name, () => {
        const sequence = new OverBreak(range(start, finish, step))
        expect(() => sequence.next()).toThrow(error)
      })
    },
  )
})

describe('After break', () => {
  const limit = 3
  let sequence = undefined

  beforeEach(() => {
    sequence = range()
  })

  test('range() - no iterations after break', () => {
    for (const number of sequence) {
      if (number > limit) break
    }
    const {done} = sequence.next()
    expect(done).toBe(true)
  })

  test('OverBreak - iterations after break', () => {
    const seq = new OverBreak(sequence)
    for (const number of seq) {
      if (number > limit) break
    }
    const {done} = seq.next()
    expect(done).toBe(false)
  })
})
