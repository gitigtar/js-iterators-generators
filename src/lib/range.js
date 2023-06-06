function* range(start = 0, finish = Infinity, step = 1) {
  if (!Number.isInteger(start)) {
    throw TypeError('Argument `start` must be an integer')
  }
  // Number.isInteger(Infinity) === false
  if (!Number.isInteger(finish) && (isNaN(finish) || isFinite(finish))) {
    throw TypeError('Argument `finish` must be an integer')
  }
  if (!Number.isInteger(step)) {
    throw TypeError('Argument `step` must be an integer')
  }
  if (step === 0) {
    throw Error('Argument `step` must not be zero')
  }
  for (
    let n = start;
    (step > 0 && n < finish) || (step < 0 && n > finish);
    n += step
  )
    yield n
}

class OverBreak {
  constructor(iterable) {
    this.it = iterable
  }

  next() {
    return this.it.next()
  }

  [Symbol.iterator]() {
    return this
  }
}

export {range, OverBreak}
