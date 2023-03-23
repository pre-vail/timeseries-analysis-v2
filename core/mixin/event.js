'use strict'

export const eventObject = {
  /**
   * Subscribe to event, usage:
   *  menu.on('select', function(item) { ... }
   */
  on(eventName, handler) {
    if (!this._eventHandlers) this._eventHandlers = {}
    if (!this._eventHandlers[eventName]) {
      this._eventHandlers[eventName] = []
    }
    this._eventHandlers[eventName].push(handler)
  },

  /**
   * Cancel the subscription, usage:
   *  menu.off('select', handler)
   */
  off(eventName, handler) {
    let handlers = this._eventHandlers?.[eventName]
    if (!handlers) return
    for (let i = 0; i < handlers.length; i++) {
      if (handlers[i] === handler) {
        handlers.splice(i--, 1)
      }
    }
  },

  /**
   * Generate an event with the given name and data
   *  this.emit('select', data1, data2)
   */
  emit(eventName, ...args) {
    // no handlers for that event name
    if (!this._eventHandlers?.[eventName]) return 

    // call the handlers
    // this._eventHandlers[eventName].forEach(handler => handler.apply(this, args))
    ;
    (async () => {
      const allHandlersForEvent = this._eventHandlers[eventName]

      // this is overwritten if handler is bound
      const mapResult = allHandlersForEvent.map(async handler => await handler.apply(this, args))

      /*const allResult = */await Promise.all(mapResult)
    })()
  }
}