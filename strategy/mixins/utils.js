'use strict'

import chalk from 'chalk'

const {cyan} = chalk.bold

export const utils = {
  logBegin(caller, color) {
    const colorToUse = color || cyan
    const label = colorToUse(this.title) + ` ${caller}`
    console.time(label)
    console.log(label)
    this.logStamp('\n')
    return label
  },

  logStamp(divider, color) {
    const colorToUse = color || cyan
    const stamp = new Date(Date.now())
    console.log(stamp)

    if (divider) {
      if (divider === '\n') console.log()
      else console.log(colorToUse(divider))
    }
  },

  logEnd(label) {
    console.timeEnd(label)
    console.log()
  },

  // set data and original data arrays
  addData(data) {
    this.data = data
    // the original author wrote this.original = data.slice(0) but this is incorrect because it sets up
    // a common reference between this.data and this.original meaning that if the values in this.data
    // are altered, then the values at the same index in this.original will also be altered
    // therefore it is better to use the original author's custom 'clone' method
    this.original = this.clone(data)
  },

  binarySearch(arr, target, low, high, compareFn) {
    // console.log('target', target)
    // console.log('low', low)
    // console.log('high', high)

    // if invalid
    if (low > high) return false
    // else (if valid)
    else {
      // get middle index
      const mid = Math.round((low + high) / 2)
      // console.log('mid', mid)

      // TODO: remove [0] bc arr should be a 1D array of values, not a nested array
      let currentValue = arr[mid][0]
      // console.log('currentValue', currentValue)

      // if using a custom compare function
      if (compareFn) currentValue = compareFn(target, currentValue, mid, arr)
      // console.log()

      // target = current value
      if (target === currentValue) return mid
      // else if the target is on the right side
      else if (target > currentValue) return this.binarySearch(arr, target, (mid + 1), high, compareFn)
      // else (if the target is on the left side)
      else return this.binarySearch(arr, target, low, (mid - 1), compareFn)
    }
  }

//   async sendErrorsToSns(...args) {
//     const snsMessage = {
//       currentRoundId: this.currentRoundId.toString(),
//       ...args,
//       ...this.caughtErrors
//     }

//     // TODO: change providers if too many errors

//     // send sns message
//     // await this.sendSns(snsMessage)
//     console.error(snsMessage)
//     console.log()

//     // delete errors
//     delete this.caughtErrors
//   }
}