'use strict'

import _ from 'underscore'

export const analysis = {
  // 21 supports
  supports() {
  },

  // 25 outliers
  outliers(options) {
    // Original code by Professor Hossein Arsham - http://home.ubalt.edu/ntsbarsh/Business-stat/otherapplets/Outlier.htm
    // Re-written for timeseries-analysis.
    // updated for timeseries-analysis-v2

    options = _.extend(
      {
        threshold: 2.5,
      },
      options
    )

    // create a copy of the data
    this.buffer = this.clone(this.data)

    // standardize the data
    this.standardize()

    const outliers = []

    _.each(this.data, (datapoint, index) => {
      if (Math.abs(datapoint[1]) > options.threshold)
        outliers.push([index, datapoint, this.buffer[index][1]])
    })

    // restore the data
    this.data = this.clone(this.buffer)
    delete this.buffer

    return outliers
  },

  // 32 SolveLE
  SolveLE(mat, vec, n) {
    // Gaussian elimination solver.
    // Use the coefficients from the Least Square method and make it into the real AR coefficients.
    // Original code by Rainer Hegger (1998). Modified by Paul Bourke.
    // Ported to Javascript by Julien Loutre for timeseries-analysis, from Paul Bourke's C code.

    let maxi
    let vswap = []
    let mswap = []
    let hvec = []

    let max
    let h
    let pivot
    let q

    for (let i = 0; i < n - 1; i++) {
      max = Math.abs(mat[i][i])
      maxi = i

      for (let j = i + 1; j < n; j++) {
        if ((h = Math.abs(mat[j][i])) > max) {
          max = h
          maxi = j
        }
      }

      if (maxi != i) {
        mswap = mat[i]
        mat[i] = mat[maxi]
        mat[maxi] = mswap
        vswap = vec[i]
        vec[i] = vec[maxi]
        vec[maxi] = vswap
      }

      hvec = mat[i]
      pivot = hvec[i]

      if (Math.abs(pivot) == 0.0) {
        // console.log('Singular matrix - fatal!')
        return false
      }

      for (let j = i + 1; j < n; j++) {
        q = -mat[j][i] / pivot
        mat[j][i] = 0.0

        for (let k = i + 1; k < n; k++) {
          mat[j][k] += q * hvec[k]
        }

        vec[j] += q * vec[i]
      }
    }

    vec[n - 1] /= mat[n - 1][n - 1]

    for (let i = n - 2; i >= 0; i--) {
      hvec = mat[i]

      for (let j = n - 1; j > i; j--) {
        vec[i] -= hvec[j] * vec[j]
      }

      vec[i] /= hvec[i]
    }

    return vec
  },

  // 33 regression_analysis
  regression_analysis() {
  },

  // 34 durbinWatson
  durbinWatson() {
  }
}