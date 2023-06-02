// ITERABLE
// --------
// A slightly modified code from `iterator.js`.

class Iterable {
  constructor() {
    this.value = 1
    this.finish = 6
  }

  [Symbol.iterator]() {
    // `self` is used as this time we use a function
    //  rather than an arrow function
    const self = this
    return {
      next() {
        if (self.value < self.finish) {
          const result = {
            done: false,
            value: self.value,
          }
          self.value += 1
          return result
        }
        return {done: true}
      },
    }
  }
}

console.log('=== iterable ===')
const iterable = new Iterable()

console.log('`for ... of` break at 3: ')
for (const number of iterable) {
  console.log(number)
  if (number === 3) break
}

console.log('\n`for ... of` once more: ')
for (const number of iterable) {
  console.log(number)
}

console.log('\n`for ... of` once more: ')
// The iterator has completed its sequence
console.log('The iterator is exhausted')
for (const number of iterable) {
  console.log(number)
}

// ITERABLE WITH YIELD
// -------------------
// Let's simplify the class `Iterable` with the `yield` operator.
// The `yield` operator pauses the function execution and the value
// of the expression following the yield keyword is returned
// via the iterator protocol. A function with the yield operator is
// named a generator function and it should be decorated with the `*`.

class IterableWithYield {
  constructor() {
    this.value = 1
    this.finish = 6
  }

  *[Symbol.iterator]() {
    while (this.value < this.finish) {
      const {value} = this
      this.value += 1
      yield value
    }
  }
}

console.log('\n=== iterable with yield ===')
const integers = new IterableWithYield()

console.log('`for ... of` break at 3: ')
for (const number of integers) {
  console.log(number)
  if (number === 3) break
}

console.log('\n`for ... of` once more: ')
for (const number of integers) {
  console.log(number)
}

console.log('\n`for ... of` once more: ')
// The iterator has completed its sequence
console.log('The iterator is exhausted')
for (const number of integers) {
  console.log(number)
}

// GENERATOR
// ---------
// We can try use a generator function instead of class.
// This function returns a generator object - an iterable
// iterator.
// Notes:
//  This iterable differs from the previous two in that no more
//  iterations is available after `break` in `for ... of` loop.
function* generator() {
  const start = 1
  const finish = 5
  for (let n = start; n < finish; n += 1) yield n
}

console.log('\n=== generator ===')
const numbers = generator()

console.log('Use next:')
console.log(numbers.next().value)

console.log('\n`for ... of` break at 3:')
for (const number of numbers) {
  console.log(number)
  if (number === 3) break
}

console.log('\n`for ... of` once more:')
// The iterator has completed its sequence
console.log('The iterator is exhausted')
for (const number of numbers) {
  console.log(number)
}
