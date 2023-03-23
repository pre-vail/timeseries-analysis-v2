'use strict'

export const importAsPromise = {
  async import(path, name) {
    const promise = import(path)
    const promiseResolved = await Promise.resolve(promise)
    return promiseResolved[name]
  }
}