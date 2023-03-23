'use strict'

import chalk from 'chalk'

const aquaUnderline = chalk.hex('#3ec189').underline

export const IStrategy = {
  get(target, prop, receiver) {
    let value

    switch (prop) {
      case 'targetName':
        value = target.name
        break

      case 'proxyName':
        value = 'IStrategy'
        break

      default:
        const thisHasProp = this.hasOwnProperty(prop)
        const targetHasProp = target.hasOwnProperty(prop)

        if (thisHasProp) value = Reflect.get(this, prop)
        else if (targetHasProp) value = Reflect.get(target, prop)
        else if (prop === '_eventHandlers') value = false
        else console.warn(aquaUnderline.bgRedBright(`\nIStrategy: ${prop} is not a property of 'this' or target\n`))
    }

    return value
  },

  instantiate(Strategy, options) {
    console.log(aquaUnderline('IStrategy instantiate\n'))

    // instantiate strategy module (ex. Prediction); this = Core
    const strategy = new Strategy(
      this.verbosity,
      options
    )

    this.strategy_main = strategy.main.bind(strategy)
  },

  addEventListeners() {
    // listen to Source
    // this.on('source_event', this.strategy_main)
  }
}