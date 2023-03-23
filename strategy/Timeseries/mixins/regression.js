'use strict'

import _ from 'underscore'

export const regression = {
  // 30 ARMaxEntropy
  ARMaxEntropy(options) {
    // Credits to Alex Sergejew, Nick Hawthorn, Rainer Hegger (1998)
    // Zero-Indexed arrays modification by Paul Sanders (the arrays were One-indexed, FORTRAN style)
    // Ported to Javascript by Julien Loutre for timeseries-analysis, from Paul Bourke's C code.

    options = _.extend(
      {
        degree: 5,
        data: this.data,
        intermediates: false, // Generates and returns the intermediates, a 2D array, instead of the coefficients.
      },
      options
    )

    const scope = this
    const optionsDataLength = options.data.length
    const pef = this.fill(0, optionsDataLength)
    const per = this.fill(0, optionsDataLength)

    let ar = this.fill([], options.degree + 1)
    ar = _.map(ar, (d1) => scope.fill(0, options.degree + 1))

    const h = this.fill(0, optionsDataLength)
    const g = this.fill(0, options.degree + 2)
    const coef = []

    let t1
    let t2

    for (let optionsDegreeIndex = 1; optionsDegreeIndex <= options.degree; optionsDegreeIndex++) {
      let sn = 0.0
      let sd = 0.0

      let jj = optionsDataLength - optionsDegreeIndex

      for (let j = 0; j < jj; j++) {
        t1 = options.data[j + optionsDegreeIndex][1] + pef[j]
        t2 = options.data[j][1] + per[j]
        sn -= 2.0 * t1 * t2
        sd += t1 * t1 + t2 * t2
      }

      t1 = g[optionsDegreeIndex] = sn / sd

      if (optionsDegreeIndex != 1) {
        for (let j = 1; j < optionsDegreeIndex; j++) {
          h[j] = g[j] + t1 * g[optionsDegreeIndex - j]
        }

        for (let j = 1; j < optionsDegreeIndex; j++) {
          g[j] = h[j]
        }

        jj--
      }

      for (let j = 0; j < jj; j++) {
        per[j] += t1 * pef[j] + t1 * options.data[j + optionsDegreeIndex][1]
        pef[j] = pef[j + 1] + t1 * per[j + 1] + t1 * options.data[j + 1][1]
      }

      if (options.intermediates) {
        for (let j = 0; j < optionsDegreeIndex; j++) {
          ar[optionsDegreeIndex][j] = g[j + 1]
        }
      }
    }

    if (!options.intermediates) {
      for (let optionsDegreeIndex = 0; optionsDegreeIndex < options.degree; optionsDegreeIndex++) {
        coef[optionsDegreeIndex] = g[optionsDegreeIndex + 1]
      }
      return coef
    } else {
      return ar
    }
  },

  // 31 ARLeastSquare
  ARLeastSquare(options) {
    // Credits to Rainer Hegger (1998)
    // Ported to Javascript by Julien Loutre for timeseries-analysis, from Paul Bourke's C code.
    const scope = this

    options = _.extend(
      {
        degree: 5,
        data: this.data,
      },
      options
    )

    const coefficients = []
    const optionsDataLength = options.data.length

    let hj
    let hi

    let mat = this.fill([], options.degree)
    mat = _.map(mat, (d1) => scope.fill(0, options.degree))

    for (let i = 0; i < options.degree; i++) {
      coefficients[i] = 0.0

      for (let j = 0; j < options.degree; j++)
        mat[i][j] = 0.0
    }

    for (let i = options.degree - 1; i < optionsDataLength - 1; i++) {
      hi = i + 1

      for (let j = 0; j < options.degree; j++) {
        hj = i - j
        coefficients[j] += options.data[hi][1] * options.data[hj][1]

        for (let k = j; k < options.degree; k++) {
            mat[j][k] += options.data[hj][1] * options.data[i - k][1]
        }
      }
    }

    for (let i = 0; i < options.degree; i++) {
      coefficients[i] /= optionsDataLength - options.degree

      for (let j = i; j < options.degree; j++) {
        mat[i][j] /= optionsDataLength - options.degree
        mat[j][i] = mat[i][j]
      }
    }

    const solved = this.SolveLE(mat, coefficients, options.degree)

    return coefficients
  }
}