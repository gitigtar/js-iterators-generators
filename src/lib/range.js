function* range(...args) {
  if (args.length === 0) {
    throw TypeError('range expected at least 1 argument, got 0')
  }

  if (args.length > 3) {
    throw TypeError(`range expected at most 3 arguments, got ${args.length}`)
  }

  let start = 0
  let finish = undefined
  let step = 1

  switch (args.length) {
    case 1:
      finish = args[0]
      break
    case 2:
      start = args[0]
      finish = args[1]
      break
    case 3:
      start = args[0]
      finish = args[1]
      step = args[2]
  }

  // argObj: {argName: arg}
  // Examples:
  //  {'start': 0}
  //  {'finish': -Infinity}
  //  {step: -1}
  const validate = argObj => {
    const [argName, arg] = Object.entries(argObj)[0]

    let argType = typeof arg
    if (argType !== 'number') {
      throw TypeError(`'${argType}' is not allowed, an integer is expected`)
    }

    // arg is a number, but it may be unacceptable
    if (!Number.isInteger(arg) && isFinite(arg)) {
      // `arg` is a float
      throw RangeError('an integer is expected, got a float')
    }

    if (argName === 'step' && arg === 0) {
      throw RangeError('the third argument must not be zero')
    }

    if (['start', 'step'].includes(argName) && !isFinite(arg)) {
      // `arg` is ±Infinity
      throw RangeError('the argument must be finite')
    }

    // arg is OK!
    return
  }

  validate({start})
  validate({finish})
  validate({step})

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
