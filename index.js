/* CLI ARGS
(s) strategy name; default = Prediction
(n) number of predictions to make; default = 1
(o) offset of first prediction; default = 0 = after last know value, 1 = predict last known value
(u) make predictions based on the noise instead of the signal; default = false (this is suggested as it gives better predictions)
(k) keep the outliers; default = false
(v) verbosity that can be increased; default = 0 (silent), max = 3
*/
/* CLI EXAMPLES
node .
node . -s Prediction
node . -s Prediction -n 3 -v 1
node . -s Prediction -o 4 -v 1
node . -s Prediction -u -v 1
node . -s Prediction -uk -v 1
node . -s Prediction -uk -n 3 -v 1
node . -s Prediction -o 4 -v 1
node . -s Prediction -n 2 -o 1 -v 1
*/
'use strict'
// import _ from './env.js'

import chalk from 'chalk'
import {Command} from 'commander'

const program = new Command()
program
  // .requiredOption()
  .option('-s, --strategyName <name>', 'strategy to use; default = Prediction', 'Prediction')
  .option('-n, --numberOfPredictionsToMake <number>', 'number of predictions to make; default = 1', 1)
  .option('-o, --offset <number>', 'offset of first prediction; default = 0 = after last know value, 1 = predict last known value', 0)
  .option('-u, --useNoise', 'make predictions based on the noise instead of the signal; default = false', false)
  .option('-k, --keepOutliers', 'keep the outliers; default = false', false)
  .option('-v, --verbosity <number>', 'verbosity from 0 (silent) to 3; default = 1', 1)
program.parse()

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import#import_a_module_for_its_side_effects_only
import './error/processOnError.js'

// Core class
import {Core} from './core/Core.js'

// colors
const pink = chalk.hex('#ffc0cb')

// CLI ARGS

console.log()

// strategy name ex. Prediction
const strategyName = program.opts().strategyName
console.log(pink('strategyName'), strategyName)

// number of predictions to make; default = 1
const numberOfPredictionsToMake = program.opts().numberOfPredictionsToMake
console.log(pink('numberOfPredictionsToMake'), numberOfPredictionsToMake)

// offset of first prediction; default = 0 = after last know value, 1 = predict last known value
const offset = program.opts().offset
console.log(pink('offset'), offset)

// make predictions based on the noise instead of the signal: default = false
const useNoise = program.opts().useNoise
console.log(pink('useNoise'), useNoise)

// keep the outliers: default = false
const keepOutliers = program.opts().keepOutliers
console.log(pink('keepOutliers'), keepOutliers)

// verbosity from cli
const verbosity = program.opts().verbosity
console.log(pink('verbosity'), verbosity)

console.log()

;
(async () => {
  try {
    // instantiate Core class
    new Core(
      verbosity
    )

    // add mixins, interfaces, modules, and event listeners
    Core.addMixins()

    await Core.addInterfaces()

    const options = {numberOfPredictionsToMake, offset, useNoise, keepOutliers}
    await Core.addModules(strategyName, options)

    Core.addEventListeners()
  
    // start Core
    await Core.start()
  } catch(error) {
    console.error(error)
    process.exit(1)
  }
})()