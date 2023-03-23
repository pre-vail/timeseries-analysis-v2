'use strict'

import _ from 'underscore'

export const extraction = {
  // 19 noiseData
  // added an 'options' arg with a default for 'start'
  // 'start' is used to ensure that the data value at 'i' corresponds
  // to the correct value in both this.data and this.original
  noiseData(options) {
    options = _.extend(
      {
        start: 0
      },
      options
    )

    const dataLength = this.data.length

    // Reset the buffer
    this.buffer = []

    let correspondingOriginalIndex = options.start

    for (let i = 0; i < dataLength; i++) {
      this.buffer[i] = [this.data[i][0], this.original[correspondingOriginalIndex][1] - this.data[i][1]]
      ++correspondingOriginalIndex
    }

    this.data = this.clone(this.buffer)

    return this
  }
}