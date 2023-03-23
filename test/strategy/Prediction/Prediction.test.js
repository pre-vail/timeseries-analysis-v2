// npm test ./test/strategy/Prediction/Prediction.test.js
'use strict'

// https://www.chaijs.com/api
import {expect, assert} from 'chai'

import {data} from '../../../source/Coingecko/readFile.js'
import {Prediction} from '../../../strategy/Prediction/Prediction.js'

const NUMBER_OF_PREDICTIONS_TO_MAKE = 5
const OFFSET = 3

const verbosity = 1

// cli args
const options = {
  numberOfPredictionsToMake: NUMBER_OF_PREDICTIONS_TO_MAKE,
  offset: OFFSET,
  useNoise: true,
  keepOutliers: false
}

const prediction = new Prediction(verbosity, options)

describe('Prediction', () => {
  // it('getBestSettings', () => {
  //   prediction.getBestSettings()
  // })

  // it('getCoefficients', () => {
  //   prediction.getCoefficients()
  // })

  // it('makePrediction', () => {
  //   prediction.makePrediction()
  // })

  // it('createForecastTimestamp', () => {
  //   prediction.timeseries.addData(data)
  //   prediction.createForecastTimestamp()
  // })

  it('main', () => {
    prediction.main(data)
  })
})