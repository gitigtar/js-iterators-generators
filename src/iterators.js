// THE ITERATOR PROTOCOL
// ---------------------
// An iterator should implement the method `next()` which returns
// an object {done, value}:
//  - `done`: false if the iterator was able to get a value
//     or true if the iterator has completed the iteration sequence;
//  - `value`: the next value from the iteration sequence.
//
function makeIterator() {
  let n = 1
  const finish = 4

  return {
    next: () => {
      if (n < finish) {
        const result = {done: false, value: n}
        n += 1
        return result
      }
      return {done: true}
    },
  }
}

console.log('=== iterator ===')
const iter = makeIterator()

console.log('while loop:')
let res = iter.next()
while (!res.done) {
  console.log(res.value)
  res = iter.next()
}

// The iterator has completed its sequence
console.log('The iterator is exhausted:')
console.log(iter.next())

console.log('\nCan this iterator be used in `for .. of` loop?')
const iterator = makeIterator()
try {
  for (const number of iterator) {
    console.log(number)
  }
} catch (err) {
  console.log('Error:', err.message, '\n')
  // Error: ... is not iterable
}

// THE ITERABLE PROTOCOL
// --------------------
// To be iterable, an object must have the method @@iterator.
// This method is a zero-argument function that returns
// an object, conforming to the `iterator protocol`. The method
// `@@iterator` is available via the key `Symbol.iterator`
// Notes:
//    Some objects might be iterated over only once other
// more than once, it depends on implementation.
//    @@iterator is a well-known symbol:
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol#well-known_symbols
function makeIterable() {
  let n = 1
  const finish = 4
  return {
    [Symbol.iterator]: () => {
      return {
        next: () => {
          if (n < finish) {
            const result = {
              done: false,
              value: n,
            }
            n += 1
            return result
          }
          return {done: true}
        },
      }
    },
  }
}

console.log('=== iterable ===')
console.log('`for .. of` loop:')
for (const number of makeIterable()) {
  console.log(number)
}

console.log('\nspread operator:')
console.log([...makeIterable(), 4, 5])

// The iterator of an iterable:
const it = makeIterable()[Symbol.iterator]()
console.log('\nThe iterator is available via the key `Symbol.iterator`:')
console.log(it.next())
console.log(it.next(), '\n')

//  ITERABLE ITERATOR
// ------------------
// An iterator may be iterable.
class IterableIterator {
  constructor() {
    this.value = 1
    this.finish = 10
  }

  next() {
    if (this.value < this.finish) {
      const result = {
        done: false,
        value: this.value,
      }
      this.value += 1
      return result
    }
    return {done: true}
  }

  [Symbol.iterator]() {
    return this
  }
}

console.log('=== iterable iterator ===')

const iterableIter = new IterableIterator()

console.log('next:')
console.log(iterableIter.next().value)
console.log(iterableIter.next().value)

console.log('`for ... of` break at 5:')
for (const number of iterableIter) {
  console.log(number)
  if (number === 5) break
}

console.log('`for ... of` once more:')
for (const number of iterableIter) {
  console.log(number)
}
console.log()

// OPTIONAL ITERATOR METHODS
// ------------------------
// https://tc39.es/ecma262/multipage/control-abstraction-objects.html#sec-iteration
// An iterator may implement two more optional methods:
// `return(value)` and `throw(exception)`.
// Calling `return` method can be used to perform cleanup actions.
// Calling `throw` means that the caller detects some error condition.
// Notes:
//    If the loop `for ... of` exits because of the `break` statement
// the return() method will be called.
//    The returned object must conform to the IteratorResult interface

class IterableIteratorWithOptionalMethods {
  constructor() {
    this.value = 1
    this.finish = 10
  }

  next() {
    if (this.value < this.finish) {
      const result = {
        done: false,
        value: this.value,
      }
      this.value += 1
      return result
    }
    return {done: true}
  }

  return() {
    console.log('`return` method was called')
    this.value = this.finish
    return {done: true}
  }

  throw(exception) {
    console.log('`throw` method was called')
    console.log(exception.message)
    this.value = this.finish
    return {done: true}
  }

  [Symbol.iterator]() {
    return this
  }
}

console.log('=== iterator with `return` & `throw` methods ===')

const iterableIterator = new IterableIteratorWithOptionalMethods()

for (const number of iterableIterator) {
  console.log(number)
}

const iterableIt = new IterableIteratorWithOptionalMethods()
console.log('\nOne more iterator was created')
console.log('Either `return` or `throw` will be called')
console.log('next:')
console.log(iterableIt.next().value)
console.log(iterableIt.next().value)

console.log('`for ... of` break at 5:')
for (const number of iterableIt) {
  console.log(number)
  if (number === 5) break
  if (Math.random() > 0.6) {
    // Emulate an error condition
    iterableIt.throw(new Error('Something is wrong'))
  }
}

console.log('`for ... of` once more:')
// The iterator has completed its sequence
console.log('The iterator is exhausted')
for (const number of iterableIt) {
  console.log(number)
}
