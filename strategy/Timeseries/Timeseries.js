'use strict'

import _ from 'underscore'

// these are the original methods from the original timeseries-analysis package
import {analysis} from './mixins/analysis.js'
import {extraction} from './mixins/extraction.js'
import {forecast} from './mixins/forecast.js'
import {regression} from './mixins/regression.js'
import {smoothing} from './mixins/smoothing.js'
import {statistics} from './mixins/statistics.js'
import {utils} from './mixins/utils.js'

// these are additional methods that are not part of the original timeseries-analysis package
import {utils as additionalUtils} from '../mixins/utils.js'

export class Timeseries {
  constructor(verbosity, options) {
    this.title = 'TIMESERIES'

    this.verbosity = verbosity
    this.options = _.extend({}, options)

    this.buffer = []
    this.saved = []

    // add mixins
    Object.assign(
      this,
      // original
      analysis,
      extraction,
      forecast,
      regression,
      smoothing,
      statistics,
      utils,
      // additional
      additionalUtils
    )
  }
}