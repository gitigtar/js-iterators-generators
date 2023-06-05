import {range} from '../src/lib/range.js'

test('range(1,5) -> [1,2,3,4]', () => {
  expect([...range(1, 5)]).toStrictEqual([1, 2, 3, 4])
})
