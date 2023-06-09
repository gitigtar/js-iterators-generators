import {OverBreak, range} from '#lib/range.js'

function rangeSeqTestName({parameters, expected}) {
  let name = `range(${parameters})`
  return `${name} generate the sequence: ${expected}`
}

function OverBreakSeqTestName({parameters, expected}) {
  let name = `OverBreak(range(${parameters}))`
  return `${name} generate the sequence: ${expected}`
}

describe('Sequences', () => {
  const cases = [
    {parameters: [1, 4], result: [1, 2, 3]},
    {
      parameters: [1, 20, 3],
      result: [1, 4, 7, 10, 13, 16, 19],
    },
    {
      parameters: [1, -20, -3],
      result: [1, -2, -5, -8, -11, -14, -17],
    },
    {
      parameters: [1, -1],
      result: [],
    },
    {
      parameters: [1, 2, -1],
      result: [],
    },
    {
      parameters: [1, 1],
      result: [],
    },
  ]

  describe.each(cases)('range', ({parameters, result: expected}) => {
    test(rangeSeqTestName({parameters, expected}), () => {
      const sequence = [...range(...parameters)]
      expect(sequence).toStrictEqual(expected)
    })
  })

  describe.each(cases)('OverBreak', ({parameters, result: expected}) => {
    test(OverBreakSeqTestName({parameters, expected}), () => {
      const sequence = [...new OverBreak(range(...parameters))]
      expect(sequence).toStrictEqual(expected)
    })
  })
})

describe('Errors', () => {
  const cases = [
    {
      parameters: [],
      error: TypeError('range expected at least 1 argument, got 0'),
    },
    {
      parameters: [1, 4, 1, 1],
      error: TypeError(`range expected at most 3 arguments, got 4`),
    },
    {
      parameters: ['A'],
      error: TypeError("'string' is not allowed, an integer is expected"),
    },
    {
      parameters: [1, 10.1],
      error: TypeError('an integer is expected, got a float'),
    },
    {
      parameters: [1, 10, '%'],
      error: TypeError("'string' is not allowed, an integer is expected"),
    },
    {
      parameters: [1, 10, 0],
      error: RangeError('the third argument must not be zero'),
    },
    {
      parameters: [-Infinity, Infinity],
      error: RangeError('the argument must be finite'),
    },
  ]

  describe.each(cases)('range', ({parameters, error}) => {
    test(`range(${parameters}) throws an error`, () => {
      const sequence = range(...parameters)
      expect(() => sequence.next()).toThrow(error)
    })
  })

  describe.each(cases)('OverBreak', ({parameters, error}) => {
    test(`OverBreak(range(${parameters})) throws an error`, () => {
      const sequence = new OverBreak(range(...parameters))
      expect(() => sequence.next()).toThrow(error)
    })
  })
})

describe('After break', () => {
  const limit = 3
  let sequence = undefined

  beforeEach(() => {
    sequence = range(Infinity)
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
