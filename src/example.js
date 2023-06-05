import {OverBreak, range} from './lib/range.js'

let sequence = range(1, 20, 3)
console.log('range(1, 20, 3)')
console.log('for .. of')
for (const number of sequence) {
  console.log(number)
}

sequence = range(1, -20, -3)
console.log('\nrange(1, -20, -3)')
console.log('for .. of, break if < -10')
for (const number of sequence) {
  console.log(number)
  if (number < -10) break
}

console.log('for .. of, once more')
console.log('The iterator is exhausted:')
for (const number of sequence) {
  console.log(number)
}

sequence = new OverBreak(range(-5, 15, 2))
console.log('\nrange(-5, 15, 2), can be iterated after `break`')
console.log('for .. of, break if > 3')
for (const number of sequence) {
  console.log(number)
  if (number > 3) break
}

console.log('for .. of, once more')
for (const number of sequence) {
  console.log(number)
}

console.log('for .. of, once more')
console.log('The iterator is exhausted:')
for (const number of sequence) {
  console.log(number)
}
