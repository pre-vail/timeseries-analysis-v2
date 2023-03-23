'use strict'

import chalk from 'chalk'

import {Timeseries} from '../Timeseries/Timeseries.js'
import {utils} from '../mixins/utils.js'

const {black, gray, cyan, blue, magenta, green, red, yellow} = chalk.bold

const PERIOD_RANGE_LOW = 5
const PERIOD_RANGE_HIGH = 20

const OUTLIERS_RANGE_LOW = 2.0
const OUTLIERS_RANGE_HIGH = 3.0

const SMOOTHING_RANGE_LOW = 1
const SMOOTHING_RANGE_HIGH = 3

export class Prediction {
  constructor(verbosity, options) {
    this.title = 'PREDICTION'

    this.verbosity = verbosity

    // instantiate a new timeseries
    this.timeseries = new Timeseries(this.verbosity)

    this.options = options

    this.tabularData = []

    // add mixins
    Object.assign(this, utils)
  }

  getBestSettings({currentOffset, useNoise, keepOutliers}) {
    const label = this.logBegin('getBestSettings', gray)

    let absoluteBestSettings
    let prevOutlierDidNotFilterOutAnyData = false

    // get the original data length
    const originalDataLength = this.timeseries.original.length
    if (this.verbosity === 3) console.log('originalDataLength', originalDataLength, '\n')

    // for each of the number of periods from low to high (ex. from 10 - 30)
    for (let p = PERIOD_RANGE_LOW; p < (PERIOD_RANGE_HIGH + 1); p++) {
      // reset the timeseries data back to the origianl data
      this.timeseries.reset()

      // set the start and end of the range
      const start = originalDataLength - p - currentOffset
      const end = currentOffset ? -currentOffset : originalDataLength

      if (this.verbosity === 3) {
        console.log('p', p)
        console.log('currentOffset', currentOffset)
        console.log('start', start)
        console.log('end', end)
      }

      // keep the last 'p' number of data entries
      this.timeseries.data = this.timeseries.data.slice(start, end)
      if (this.verbosity === 3) console.log('this.timeseries.data.length', this.timeseries.data.length, '\n')

      // log the chart url
      if (this.verbosity > 1) console.log(`after keeping the last ${p} periods\n${this.timeseries.chart()}\n`)

      // if keeping the outliers, then only do this loop once because
      // there is no need to loop over multiple outlier range values
      const startingOutlierValue = keepOutliers ? OUTLIERS_RANGE_HIGH : OUTLIERS_RANGE_LOW

      // for each outlier setting (ex. from 2.0 to 3.0)
      for (let o = startingOutlierValue; o < (OUTLIERS_RANGE_HIGH + 0.1); o+=0.1) {
        if (this.verbosity === 3) console.log('o', o)

        let dataBeforeRemovingTheOutliers
        let threshhold

        // if not keeping the outliers
        if (!keepOutliers) {
          // round outlier value down to nearest tenth (ex. 2.900000000000001 is rounded down to 2.9)
          threshhold = Number(o.toFixed(1))
          if (this.verbosity === 3) console.log('threshhold', threshhold)

          // if the previous outlier threshhold did not filter out any of the data
          if (threshhold > OUTLIERS_RANGE_LOW && prevOutlierDidNotFilterOutAnyData) {
            // skip this outlier value because its threshhold is even less restrictive
            // so it is guaranteed to also not filter out any of the data
            if (threshhold === OUTLIERS_RANGE_HIGH && this.verbosity > 1) console.log('---\n')
            continue
          // else (if the previous outlier did filter out some data values)
          } else {
            // get the outliers
            const outliers = this.timeseries.outliers({threshold: threshhold})
            const outliersLength = outliers.length

            if (this.verbosity === 3) {
              console.log('outliersLength', outliersLength)
              console.log('outliers', outliers)
              console.log()
            }

            // if there are outliers
            if (outliersLength) {
              // get the indexes of the outliers in the data array
              const outlierIndexes = outliers.map(entry => entry[0])

              // save a copy of the data before removing the outliers
              dataBeforeRemovingTheOutliers = this.timeseries.clone(this.timeseries.data)

              // set the buffer equal to the data with the outliers removed
              this.timeseries.buffer =
                this.timeseries.data.filter(
                  (entry, index) => {
                    if (!outlierIndexes.includes(index)) return entry
                  }
                )

              // overwrite the current data with the buffer
              this.timeseries.data = this.timeseries.clone(this.timeseries.buffer)

              // log the chart url
              if (this.verbosity > 1) console.log(`after removing ${outliersLength} outliers\n${this.timeseries.chart()}\n`)
            // else (if there are no outliers)
            } else
              // set flag because this outlier threshhold did not filter out any of the data
              prevOutlierDidNotFilterOutAnyData = true

            if (this.verbosity > 1)
              console.log('prevOutlierDidNotFilterOutAnyData', prevOutlierDidNotFilterOutAnyData, '\n')
          }
        }

        // for each degree of smoothing
        for (let s = SMOOTHING_RANGE_LOW; s < (SMOOTHING_RANGE_HIGH + 1); s++) {
          if (this.verbosity === 3) console.log('s', s, '\n')

          // save a copy of the data before smoothing it out
          const dataBeforeSmoothing = this.timeseries.clone(this.timeseries.data)

          // smooth the data
          this.timeseries.smoother({period: s})

          // log the chart url
          if (this.verbosity > 1) console.log(`after smoothig ${s} times\n${this.timeseries.chart()}\n`)

          // if modeling the noise
          if (useNoise) {
            // extract the noise data
            this.timeseries.noiseData({start})

            // log the chart url
            if (this.verbosity > 1) console.log(`after noise data ${s} times\n${this.timeseries.chart()}\n`)
          }

          // optimize using the maximum percentage of data values (maxPct = 1 = 100%)
          // ex: { MSE: 0.05086675645862624, method: 'ARMaxEntropy', degree: 4, sample: 20 }
          const bestSettings = this.timeseries.regression_forecast_optimize({maxPct: 1})
          if (this.verbosity > 1) console.log('bestSettings', bestSettings, '\n')

          // if no absolute settings yet OR the current best settings have a lower MSE 
          if (
            !absoluteBestSettings
            ||
            bestSettings.MSE < absoluteBestSettings.MSE
          ) {
            // update the absolute best settings
            absoluteBestSettings = bestSettings

            // add the # of periods
            absoluteBestSettings.numbPeriods = p

            // if not keeping the outliers, add the outlier threshhold
            if (!keepOutliers) absoluteBestSettings.threshhold = threshhold

            // add the degree of smoothing
            absoluteBestSettings.smoother = s

            // add the current data entries from the timeseries object
            // absoluteBestSettings.data = this.timeseries.data

            // add the google chart url
            absoluteBestSettings.url = this.timeseries.chart()

            if (this.verbosity > 1) console.log('absoluteBestSettings', absoluteBestSettings, '\n')
          }

          // reset the timeseries data back to what it was before the smoothing
          this.timeseries.data = this.timeseries.clone(dataBeforeSmoothing)

          if (this.verbosity === 3) console.log('this.timeseries.data.length', this.timeseries.data.length, '\n')
          if (this.verbosity > 1) console.log('---\n')
        }

        // if outliers were removed
        if (dataBeforeRemovingTheOutliers)
          // reset the timeseries data back to what it was before removing the outliers
          this.timeseries.data = this.timeseries.clone(dataBeforeRemovingTheOutliers)
      }

      // reset flag because the number of periods is about to be updated
      // and the outlier check has to be done again for the new period
      prevOutlierDidNotFilterOutAnyData = false
    }

    // log the absolute best settings
    console.log('absoluteBestSettings', absoluteBestSettings, '\n')

    // keep the last 'absoluteBestSettings.numbPeriods' number of data entries
    this.timeseries.data = this.timeseries.data.slice(-absoluteBestSettings.numbPeriods)

    this.logEnd(label)
  
    return absoluteBestSettings
  }

  getCoefficients(absoluteBestSettings) {
    const label = this.logBegin('getCoefficients', gray)

    // get method name, sample degree, and sample size from best settings
    const {method, degree, sample} = absoluteBestSettings

    // get last absoluteBestSettings.sample # of data entries
    const bestSettingsSampleOfData = this.timeseries.data.slice(-sample)
    const bestSettingsSampleOfDataLength = bestSettingsSampleOfData.length
    if (this.verbosity > 1) console.log('bestSettingsSampleOfDataLength', bestSettingsSampleOfDataLength, '\n')

    // get coeffs by using either ARMaxEntropy or ARLeastSquare
    const coeffs = this.timeseries[method]({data: bestSettingsSampleOfData, degree})

    // set a flag based on whether or not the absoluteBestSettings.method is max entropy
    const maxEntropyOrNot = (method === 'ARMaxEntropy')
    const blueOrMagenta = maxEntropyOrNot ? blue : magenta

    if (this.verbosity) {
      console.log(blueOrMagenta(method))
      console.log('coeffs.length', coeffs.length)
    }
    if (this.verbosity === 3) console.log('coeffs', coeffs)
    if (this.verbosity) console.log()

    this.logEnd(label)

    return {maxEntropyOrNot, coeffs}
  }

  createPredictionTimestamp() {
    const label = this.logBegin('createPredictionTimestamp', gray)

    const dataLength = this.timeseries.data.length
    let diffsTotal = 0

    // get all of the timestamp diffs and add them together 
    for (let d = (dataLength - 1); d > 0; d--) {
      const laterTimestamp = this.timeseries.data[d][0]
      const earlierTimestamp = this.timeseries.data[d-1][0]
      const diff = laterTimestamp - earlierTimestamp
      diffsTotal += diff
    }

    // get avgerage timestamp difference is milliseconds
    // using dataLength - 1 because each requirs 2 data values so there are (length - 1) diffs
    // ex: if dataLength = 20 then the number of diffs = 19
    const avgTimeDiff = diffsTotal / (dataLength - 1)
    if (this.verbosity) console.log('avgTimeDiff', (avgTimeDiff / 1000), 'secs\n')

    // get the timestamp of last data entry and create date
    const lastTimestamp = this.timeseries.data[dataLength - 1][0]

    // get predicted timestamp and create date
    const timestampForPrediction = lastTimestamp + avgTimeDiff
    const dateForPrediction = new Date(timestampForPrediction)
    const dateForPredictionISO = dateForPrediction.toISOString()// TODO: round down to nearest second

    this.logEnd(label)

    return {lastTimestamp, dateForPredictionISO}
  }

  makePrediction({maxEntropyOrNot, coeffs, lastTimestamp, dateForPredictionISO, row}) {
    const label = this.logBegin('makePrediction', gray)

    // prediction starts at 0 and is both added to and subtracted from based on the coefficients
    let prediction = 0

    const dataLength = this.timeseries.data.length

    // Loop through the coefficients
    for (let c = 0; c < coeffs.length; c++) {
      // t.data contains the current dataset, which is in the format [ [date, value], [date,value], ... ]
      // For each coefficient, we substract from "forecast" the value of the "N - x" datapoint's value,
      // multiplicated by the coefficient, where N is the last known datapoint value,
      // and x is the coefficient's index

      // get the data entry that this coefficient will be applied to
      const dataEntryIndex = dataLength - 1 - c
      const dataEntry = this.timeseries.data[dataEntryIndex]

      // get data timestamp
      const dataEntryTimestamp = dataEntry[0]
      const dataEntryDate = new Date(dataEntryTimestamp)

      // get last data value multiplied by the current coefficient
      const dataEntryValue = dataEntry[1]
      const product = dataEntryValue * coeffs[c]

      if (this.verbosity === 3) {
        console.log('c', c)
        console.log('prediction', prediction)
        console.log(`coeffs[${c}]`, coeffs[c])
        console.log('dataEntryIndex', dataEntryIndex)
        console.log('dataEntry', dataEntry)
        console.log('dataEntryDate', dataEntryDate.toISOString())
        console.log(`${dataEntryValue} * ${coeffs[c]}`, product)
      }

      // update prediction
      if (maxEntropyOrNot) prediction -= product
      else prediction += product

      if (this.verbosity === 3) console.log('prediction: in progress', prediction, '\n')
    }

    if (this.verbosity) console.log('prediction: final', prediction, '\n')

    const lastValue = this.timeseries.data[dataLength - 1][1]
    const lastDate = new Date(lastTimestamp)

    const dateForPredictionISOParsed = Date.parse(dateForPredictionISO)
    const blueOrMagenta = maxEntropyOrNot ? blue : magenta
    const formattedPrediction = Number(prediction.toFixed(2))

    // add the prediction date and value to the table row
    row.prediction_date = dateForPredictionISO
    row.prediction = formattedPrediction

    if (this.verbosity) {
      console.log('last      ', lastTimestamp, Number(lastValue.toFixed(2)), lastDate.toISOString())
      console.log('prediction', dateForPredictionISOParsed, blueOrMagenta(formattedPrediction), dateForPredictionISO)
    }

    this.logEnd(label)

    return {prediction, formattedPrediction, dateForPredictionISOParsed}
  }

  getKnownValueAndTimestamp({currentOffset, formattedPrediction, row, diffsTotal}) {
    const label = this.logBegin('getKnownValueAndTimestamp', gray)

    const actualEntryIndex = this.timeseries.original.length - currentOffset
    const actualTimestamp = this.timeseries.original[actualEntryIndex][0]
    const actualDate = new Date(actualTimestamp)
    const actualValue = this.timeseries.original[actualEntryIndex][1]
    const dateForActualISO =  actualDate.toISOString()
    const formattedActual = Number(actualValue.toFixed(2))

    // get the diff between the prediction and the known value
    const diff = formattedPrediction - formattedActual
    diffsTotal += diff

    let predictionVsActualDiff = diff.toFixed(2)
    if (diff > 0) predictionVsActualDiff = '+' + predictionVsActualDiff
    const greenOrRedOrGray = (diff > 0) ? green : (diff < 0) ? red : gray

    if (this.verbosity) {
      console.log('actual    ', actualTimestamp, cyan(formattedActual), dateForActualISO)
      console.log('diff                    ', greenOrRedOrGray(predictionVsActualDiff))
    }

    // add to the row data for the table
    row.diff = predictionVsActualDiff
    row.actual = formattedActual
    row.actual_date = dateForActualISO

    this.logEnd(label)

    return diffsTotal
  }

  main(data) {
    // get the cli options
    const {numberOfPredictionsToMake, offset, useNoise, keepOutliers} = this.options

    // create console.time label
    const label = this.logBegin(numberOfPredictionsToMake + ' predictions', yellow)

    // add the timeseries data
    this.timeseries.addData(data)

    if (this.verbosity) {
      console.log('numberOfPredictionsToMake', numberOfPredictionsToMake)
      console.log('offset', offset)
      console.log('useNoise', useNoise)
      console.log('keepOutliers', keepOutliers)
      console.log()
      console.log('this.timeseries.original.length', this.timeseries.original.length, '\n')
      console.log(`original data\n${this.timeseries.chart()}\n`)
    }

    // if predicting at least one known value
    const offsetAbsVal = Math.abs(offset)
    let currentOffset = offsetAbsVal

    // keep a total for all diffs
    let diffsTotal = 0

    // for each prediction to make
    for (let n = 0; n < numberOfPredictionsToMake; n++) {
      const numberOfPredictedValues = n + 1

      if (this.verbosity) {
        console.log(black(`prediction #${numberOfPredictedValues}`))
        console.log('currentOffset', currentOffset)
        console.log()
      }

      // get best settings
      const absoluteBestSettings = this.getBestSettings({currentOffset, useNoise, keepOutliers})

      // start a new row of values
      const row = {
        '#': numberOfPredictedValues,
        method: absoluteBestSettings.method,
      }

      // get coefficients using autoregression (either MaxEntropy or LeastSquares)
      const {maxEntropyOrNot, coeffs} = this.getCoefficients(absoluteBestSettings)

      // compute the timestamp of the prediction based on the average timestamp diff of the known values
      const {lastTimestamp, dateForPredictionISO} = this.createPredictionTimestamp()

      // make prediction using coefficients
      const {prediction, formattedPrediction, dateForPredictionISOParsed} = this.makePrediction(
        {maxEntropyOrNot, coeffs, lastTimestamp, dateForPredictionISO, row}
      )

      // if predicting a known value
      if (currentOffset) {
        // get known value and timestamp
        diffsTotal = this.getKnownValueAndTimestamp({currentOffset, formattedPrediction, row, diffsTotal})

        // decrement the offset
        --currentOffset
      // else (if this this prediction does not have a matching known value)
      } else {
        // add predicted timestamp and value to the original data
        this.timeseries.original.push([dateForPredictionISOParsed, prediction])

        // remove the oldest original data value
        // this.timeseries.original = this.timeseries.original.slice(1)
      }

      // add row to table array
      this.tabularData.push(row)

      // update the total number of data entries (should be the same as the beginning of the loop)
      const dataLength = this.timeseries.data.length

      // update the predicted:known ratio
      const numberOfKnownValues = dataLength - numberOfPredictedValues + offsetAbsVal
      const numberOfPredictedUnknownValues = (numberOfPredictedValues - offsetAbsVal)
      const predictedPercentage = (numberOfPredictedUnknownValues / dataLength) * 100

      if (this.verbosity > 1) {
        console.log('dataLength', dataLength)
        console.log('this.timeseries.data[0] ', this.timeseries.data[0])
        console.log(`this.timeseries.data[${dataLength - 1}]`, this.timeseries.data[dataLength - 1])
        console.log()
      }

      if (this.verbosity && numberOfPredictedUnknownValues > 0) {
        // TODO: log diff bet. last and first entries in hours, mins, secs
        console.log('predicted:known', `${numberOfPredictedUnknownValues}:${numberOfKnownValues}`)
        console.log('predictedPercentage', Number(predictedPercentage.toFixed(2)), '%')
        console.log()
      }

      if (this.verbosity) console.log('~~~\n')
    }

    // add a row just showing the diffs total
    if (offsetAbsVal) {
      let diff
      if (diffsTotal > 0) diff = '+' + diffsTotal.toFixed(2)
      else diff = diffsTotal.toFixed(2)
      this.tabularData.push({diff})
    }

    if (this.verbosity) {
      console.log('numberOfPredictionsToMake', numberOfPredictionsToMake)
      console.log('offset', offset)
      console.log('useNoise', useNoise)
      console.log('keepOutliers', keepOutliers)
    }

    // display output in a table
    console.table(this.tabularData)

    // TODO: send possible signal
    

    this.logEnd(label)
  }
}