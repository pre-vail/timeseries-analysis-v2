'use strict'

import _ from 'underscore'

export const statistics = {
  // 08 min
  min() {
  },

  // 09 max
  max() {
  },

  // 10 mean
  mean(data) {
    if (!data) data = this.data

    let sum = 0
    let n = 0

    _.each(data, (datapoint) => {
      sum += datapoint[1]
      n++
    })

    return sum / n
  },

  // 11 stdev
  stdev(data) {
    if (!data) data = this.data

    let sum = 0
    let n = 0

    const mean = this.mean()

    _.each(data, (datapoint) => {
      sum += (datapoint[1] - mean) * (datapoint[1] - mean)
      n++
    })

    return Math.sqrt(sum / n)
  },

  // 22 standardize
  standardize(options) {
    options = _.extend({}, options)

    const stdev = this.stdev()
    const mean = this.mean()
    // console.log('stdev', stdev)
    // console.log('mean', mean)
    // console.log()

    this.data = _.map(this.data, (datapoint) => {
      // console.log(datapoint[1])
      datapoint[1] = (datapoint[1] - mean) / stdev
      // console.log(datapoint[1], '\n')
      return datapoint
    })
  
    return this
  }
}