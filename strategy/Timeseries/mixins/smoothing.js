'use strict'

import _ from 'underscore'

export const smoothing = {
  // 13 sma
  sma() {
  },

  // 14 ema
  ema() {
  },

  // 15 lwma
  lwma() {
  },

  // 16 dsp_itrend
  dsp_itrend() {
  },

  // 17 pixelize
  pixelize() {
  },

  // 18 smoother
  smoother(options) {
    options = _.extend(
      {
        period: 1,
      },
      options
    )

    const l = this.data.length

    let j
    let i
    
    // Reset the buffer
    this.buffer = this.clone(this.data)
    
    for (j = 0; j < options.period; j++) {
      // TODO: why start at 3 instead of 2?
      for (i = 3; i < l; i++) {
        this.buffer[i - 1] = [
          this.buffer[i - 1][0],
          (this.buffer[i - 2][1] + this.buffer[i][1]) / 2,
        ]
      }
    }

    this.data = this.clone(this.buffer)

    return this
  },

  // 20 osc
  osc() {
  }
}