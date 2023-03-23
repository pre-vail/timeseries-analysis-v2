'use strict'

import _ from 'underscore'
import gimage from 'google-image-chart'

export const utils = {
  // 01 output
  output() {
    return this.data
  },

  // 02 save
  save() {
  },

  // 03 chart
  chart(options) {
    options = _.extend(
      {
        main: false,
        width: 800,
        height: 200,
        bands: [],
        lines: [],
        points: [],
      },
      options
    )
  
    // Google Chart
    const chart = new gimage.charts.line({
      width: options.width,
      height: options.height,
      bands: options.bands,
      hlines: options.lines,
      points: options.points,
      autoscale: true,
    })

    chart.fromTimeseries(this.data)

    // include the original data
    if (options.main) chart.fromTimeseries(this.original)

    // include saved data
    _.each(this.saved, (saved) => {
      chart.fromTimeseries(saved.data)
    })
  
    return chart.render()
  },

  // 04 fill
  // Returns an array filled with the specified value.
  fill(value, n) {
    const array = []
    for (let i = 0; i < n; i++) array.push(value)
    return array
  },

  // 05 clone
  // this method has been updated by adding an input array to be cloned instead
  // of just cloning this.data each time which is what the original method did
  clone(arrayToBeCloned) {
    const clone = _.map(arrayToBeCloned, (entry) => {
      // multiplying by 1 changes the type of entry[1] to Number
      return [entry[0], entry[1] * 1]
    })
    return clone
  },

  // 06 reset
  // this method originally had this.data = this.original which does not actually do what may have
  // been intended by the author because this.data and this.original are arrays and this.original
  // is set equal to data.slice(0) in the constructor, then any changes to the values in this.data
  // are reflected in this.original
  // ex. if this.data[0][1] is changed from 0 to 100, then this.original[0][1] will now equal 100
  // one exception is that changing the length of this.data does not change the length of this.original
  // this method is never actually called by any of the other methods in the package
  reset() {
    this.data = this.clone(this.original)
    return this
  },

  // 07 toArray
  toArray() {
  },

  // 12 offset
  offset(value, data, ret) {
    if (!data) data = this.data
  
    // Reset the buffer
    this.buffer = this.clone(data)
  
    const l = data.length
    for (let i = 0; i < l; i++) {
      this.buffer[i] = [this.buffer[i][0], this.buffer[i][1] + value]
    }

    if (!ret) {
      this.data = this.clone(this.buffer)
      return this
    } else
      return this.buffer
  },

  // 23 slice
  // even though this method is called 'slice', it actually uses the 'splice' native method
  // this may be a mistake made by the author of the timeseries-analysis package
  // this method is never actually called by any of the other methods in the package
  slice(from, to) {
    if (!from) from = 0
    if (!to) to = this.data.length - 1
    // overwriting this.data sets it equal to the array of deleted elements
    this.data = this.data.splice(from, to)
    return this
  },

  // 24 cycle
  cycle() {
  }
}