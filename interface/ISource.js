'use strict'

import chalk from 'chalk'

const mulberryUnderline = chalk.hex('#862e9c').underline

export const ISource = {
  get(target, prop, receiver) {
    let value

    switch (prop) {
      case 'targetName':
        value = target.name
        break

      case 'proxyName':
        value = 'ISource'
        break

      default:
        const thisHasProp = this.hasOwnProperty(prop)
        const targetHasProp = target.hasOwnProperty(prop)

        if (thisHasProp) value = Reflect.get(this, prop)
        else if (targetHasProp) value = Reflect.get(target, prop)
        else if (prop === '_eventHandlers') value = false
        else console.warn(mulberryUnderline.bgRedBright(`\nISource: ${prop} is not a property of 'this' or target\n`))
    }

    return value
  },

  instantiate(Source, wallet) {
    console.log(mulberryUnderline('ISource instantiate\n'))

    // instantiate source module (ex. Chainlink); this = Core
    const source = new Source(
      this.verbosity,
      wallet,
      this.sendSns.bind(this),
      this.emit.bind(this)
    )

    this.source_main = source.main.bind(source)
  },

  addEventListeners() {
    // listen for an event from another Class within the Server module
    // this.on(<event name>, this.source_main)
  }
}