'use strict'

// https://www.chaijs.com/api
import {expect, assert} from 'chai'

import {data} from '../../../source/Coingecko/readFile.js'
import {Timeseries} from '../../../strategy/Timeseries/Timeseries.js'

const t = new Timeseries(3)

describe('Timeseries', () => {
  // MUST call this if data is needed to be in the timeseries object
  it('addData', () => {
    const label = t.logBegin('addData')
    t.addData(data)
    console.log('t.data.length', t.data.length)
    console.log('t.original.length', t.original.length)
    console.log('t.output().length', t.output().length)
    t.logEnd(label)
  })

  // it('outliers', () => {
  //   const label = t.logBegin('outliers')
  //   const options = {threshold: 2.5}
  //   const outliers = t.outliers(options)
  //   console.log('outliers', outliers)
  //   t.logEnd(label)
  // })

  // it('smoother', () => {
  //   const label = t.logBegin('smoother')
  //   const url = t.smoother({period: 1}).chart()
  //   console.log(url, '\n')
  //   t.logEnd(label)
  // })

  // it('slice', () => {
  //   const label = t.logBegin('slice')
  //   t.slice()
  //   console.log('t.data.length', t.data.length)
  //   console.log('t.original.length', t.original.length)
  //   console.log('t.output().length', t.output().length)
  //   t.logEnd(label)
  // })

  // it('reset', () => {
  //   const label = t.logBegin('reset')
  //   t.reset()
  //   console.log('t.data.length', t.data.length)
  //   console.log('t.original.length', t.original.length)
  //   console.log('t.output().length', t.output().length)
  //   t.logEnd(label)
  // })

  // it('clone', () => {
  //   const label = t.logBegin('clone')
  //   console.log('t.data.length', t.data.length)
  //   console.log('t.original.length', t.original.length)
  //   console.log('t.output().length', t.output().length)
  //   console.log()

  //   const clone = t.clone(t.data)
  //   console.log('clone.length', clone.length)
  //   console.log('t.original.length', t.original.length)
  //   console.log('t.data.length', t.data.length)
  //   console.log('t.output().length', t.output().length)
  //   console.log()

  //   console.log('t.data[0][1]', t.data[0][1])
  //   t.data[0][1] = 1000
  //   t.data.splice(-1)
  //   console.log('t.data[0][1]', t.data[0][1])
  //   console.log('t.data.length', t.data.length)
  //   console.log('t.output().length', t.output().length)
  //   console.log()

  //   console.log('clone[0][1]', clone[0][1])
  //   console.log('clone.length', clone.length)
  //   console.log()

  //   t.logEnd(label)
  // })

  // it('standardize', () => {
  //   const label = t.logBegin('standardize')
  //   // standardize changes the scale of the values but not their relationship
  //   // to each other, so these two charts only differ by values on the y axis
  //   console.log(t.chart(), '\n')
  //   console.log(t.standardize().chart(), '\n')
  //   t.logEnd(label)
  // })

  // it('offset', () => {
  //   const label = t.logBegin('offset')
  //   t.logEnd(label)
  // })

  // it('fill', () => {
  //   const label = t.logBegin('fill')
  //   t.logEnd(label)
  // })

  // it('noiseData', () => {
  //   const label = t.logBegin('noiseData')
  //   t.logEnd(label)
  // })

  // it('ARMaxEntropy', () => {
  //   const label = t.logBegin('ARMaxEntropy')
  //   console.log(t.ARMaxEntropy())
  //   t.logEnd(label)
  // })

  // it('ARLeastSquare', () => {
  //   const label = t.logBegin('ARLeastSquare')
  //   console.log(t.ARLeastSquare())
  //   t.logEnd(label)
  // })

  // it('regression_forecast_optimize', () => {
  //   const label = t.logBegin('regression_forecast_optimize')
  //   t.logEnd(label)
  // })

  // it('regression_forecast_mse', () => {
  //   const label = t.logBegin('regression_forecast_mse')
  //   t.logEnd(label)
  // })
})