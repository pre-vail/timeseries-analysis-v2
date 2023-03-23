'use strict'

import _ from 'underscore'

export const forecast = {
  // 26 regression_forecast
  regression_forecast() {
  },

  // 27 regression_forecast_optimize
  regression_forecast_optimize(options) {
    options = _.extend(
      {
        data: this.data,
        maxPct: 0.2,
        maxSampleSize: false,
      },
      options
    )

    const l = options.data.length

    let maxSampleSize = Math.round(l * options.maxPct)
    if (options.maxSampleSize) maxSampleSize = Math.min(maxSampleSize, options.maxSampleSize)
    const maxDegree = Math.round(maxSampleSize)

    const methods = ['ARMaxEntropy', 'ARLeastSquare']
    let MSEData = []

    // for each method
    for (let i = 0; i < methods.length; i++) {
      // for each sample (data entry)
      // TODO: why start at 3?
      for (let ss = 3; ss <= maxSampleSize; ss++) {
        // for each degree (sample size rounded to the nearest whole number)
        for (let deg = 1; deg <= maxDegree; deg++) {
          // if the degree <= the sample size
          if (deg <= ss) {
            const mse = this.regression_forecast_mse({
              method: methods[i],
              sample: ss,
              degree: deg,
              data: options.data,
            })
            // console.log('method', methods[i])
            // console.log('deg', deg)
            // console.log('ss', ss)
            // console.log('mse', mse)

            if (!isNaN(mse)) {
              MSEData.push({
                MSE: mse,
                method: methods[i],
                degree: deg,
                sample: ss,
              })
            }
          } else
            break
        }
      }
    }

    // Now we sort by MSE
    MSEData = MSEData.sort((a, b) => (a.MSE - b.MSE))
    // console.log('MSEData', MSEData, '\n')

    // console.log("Best Settings: ",MSEData[0])

    // Return the best settings
    return MSEData[0]
  },

  // 28 regression_forecast_mse
  // Calculate the MSE for a forecast, for a set of parameters
  regression_forecast_mse(options) {
    options = _.extend(
      {
        method: 'ARMaxEntropy', // ARMaxEntropy | ARLeastSquare
        sample: 50,
        degree: 5,
        data: this.data,
      },
      options
    )

    const mean = this.mean(options.data)
    options.data = this.offset(-mean, options.data, true)

    const backup = _.map(options.data, (item) => [item[0], item[1] * 1])
    const buffer = _.map(options.data, (item) => [item[0], item[1] * 1])

    const l = options.data.length
    let MSE = 0
    let n = 0

    for (let i = options.sample; i < l; i++) {
      const sample = buffer.slice(i - options.sample, i)

      // Get the AR coeffs
      const coeffs = this[options.method]({degree: options.degree, data: sample})
      // console.log('coeffs', coeffs, '\n')

      const knownValue = buffer[i][1] * 1
      // console.log('knownValue', knownValue)

      buffer[i][1] = 0

      for (let j = 0; j < coeffs.length; j++) {
        if (options.method == 'ARMaxEntropy')
          buffer[i][1] -= backup[i - 1 - j][1] * coeffs[j]
        else
          buffer[i][1] += backup[i - 1 - j][1] * coeffs[j]
      }
      // console.log('buffer[i][1]', buffer[i][1])

      MSE += (knownValue - buffer[i][1]) * (knownValue - buffer[i][1])
      n++
      // console.log('MSE', MSE)
      // console.log('n', n)
      // console.log()
    }

    MSE /= n

    //this.data = buffer

    // Put back the mean
    //this.offset(mean)

    return MSE
  },

  // 29 sliding_regression_forecast
  sliding_regression_forecast() {
  },
}