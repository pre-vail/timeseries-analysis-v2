'use strict'

import chalk from 'chalk'

import {importAsPromise} from './mixin/import.js'
// import {eventObject} from './mixin/event.js'
// import {sns} from './mixin/sns.js'
// import {ipcServer} from './mixin/ipc.js'

const VERBOSITY_LOWER_LIMIT = 0
const VERBOSITY_UPPER_LIMIT = 3

const blue = chalk.blue.bold

export class Core {
  /*╔═════════════════════════════╗
    ║  STATIC PRIVATE PROPERTIES  ║
    ╚═════════════════════════════╝*/

  static title = blue('CORE')

  // default is silent
  static #verbosity = 0
  static get verbosity() {return Core.#verbosity}
  static set verbosity(value) {Core.#verbosity = Core.#limitPrivateProperty('verbosity', value)}

  // interfaces
  static #IStrategyProxy
  static get IStrategyProxy() {return Core.#IStrategyProxy}
  static set IStrategyProxy(proxy) {Core.#IStrategyProxy = Core.#limitPrivateProperty('IStrategyProxy', proxy)}

  // static #ISourceProxy
  // static get ISourceProxy() {return Core.#ISourceProxy}
  // static set ISourceProxy(proxy) {Core.#ISourceProxy = Core.#limitPrivateProperty('ISourceProxy', proxy)}

  // limit all private properties
  static #limitPrivateProperty(name, value) {
    let newValue

    switch (name) {
      case 'verbosity':
        if (typeof value != 'number') throw new TypeError('verbosity should be a number')
        else if (value < VERBOSITY_LOWER_LIMIT) newValue = VERBOSITY_LOWER_LIMIT
        else if (value > VERBOSITY_UPPER_LIMIT) newValue = VERBOSITY_UPPER_LIMIT
        else newValue = value
        break

      case 'IStrategyProxy':
      case 'ISourceProxy':
        if (value.targetName === 'Core' && value.proxyName + 'Proxy' === name) newValue = value
        else throw new TypeError(`${name}: invalid proxy`)
        break

      default:
        throw new RangeError(`private property #${name} does not have a defined range of values`)
    }

    return newValue
  }

  /*╔═════════════════╗
    ║   CONSTRUCTOR   ║
    ╚═════════════════╝*/

  constructor(
    verbosity
  ) {
    Core.verbosity = verbosity
  }

  /*╔═══════════════════════════════╗
    ║ MIXINS, INTERFACES, & MODULES ║
    ╚═══════════════════════════════╝*/

  static addMixins() {
    // assign custom import and event mixins
    Object.assign(Core, importAsPromise/*, eventObject, sns, ipcServer*/)
  }

  static async addInterfaces() {
    // strategy
    const IStrategy = await Core.import('../../interface/IStrategy.js', 'IStrategy')
    const IStrategyProxy = new Proxy(Core, IStrategy)
    Core.IStrategyProxy = IStrategyProxy

    // source
    // const ISource = await Core.import('../../interface/ISource.js', 'ISource')
    // const ISourceProxy = new Proxy(Core, ISource)
    // Core.ISourceProxy = ISourceProxy
  }

  static async addModules(strategyName, options) {
    // strategy
    const Strategy = await Core.import(`../../strategy/${strategyName}/${strategyName}.js`, strategyName)
    Core.IStrategyProxy.instantiate(Strategy, options)

    // source
    // const Source = await Core.import(`../../source/${sourceName}/${sourceName}.js`, sourceName)
    // Core.ISourceProxy.instantiate(Source, Core.#wallet)
  }

  /*╔═════════════════════╗
    ║ ADD EVENT LISTENERS ║
    ╚═════════════════════╝*/

  static addEventListeners() {
    // strategy
    // Core.IStrategyProxy.addEventListeners()

    // source
    // Core.ISourceProxy.addEventListeners()
  }

  /*╔════════════╗
    ║ START CORE ║
    ╚════════════╝*/

  static logStamp(divider) {
    const stamp = new Date(Date.now())
    console.log(stamp)

    if (divider) {
      if (divider === '\n') console.log()
      else console.log(blue(divider))
    }
  }

  static async start() {
    console.time(Core.title)
    console.log(blue(Core.title))
    Core.logStamp('\n')

    // start the Strategy
    await this.strategy_main()

    console.timeEnd(Core.title)
    console.log()
  }
}