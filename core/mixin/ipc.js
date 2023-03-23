'use strict'
// https://github.com/RIAEvangelist/node-ipc
import ipc from 'node-ipc'

ipc.config.id = 'SERVER'
ipc.config.retry = 1500
ipc.config.silent = true

// TODO: change to serveNet
ipc.serve()
ipc.server.start()

export const ipcServer = {ipc}