'use strict'

import chalk from 'chalk'
const bgRedBright = chalk.bgRedBright

// https://nodejs.org/api/process.html#process_warning_using_uncaughtexception_correctly
process

.on('unhandledRejection', (reason, error) => {
  console.group()
  console.error(bgRedBright('-- UNHANDLED REJECTION --'))

  console.error(reason)
  console.error()
  console.error(error)
  console.groupEnd()

  // TODO: aws notification

  process.exit(1)
})

.on('uncaughtException', error => {
  console.group()
  console.error(bgRedBright('-- UNCAUGHT EXCEPTION --'))
  console.error(error)
  console.groupEnd()

  // TODO: aws notification

  process.exit(1)
})