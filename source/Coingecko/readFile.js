'use strict'

import {/*opendir, */readFile} from 'node:fs/promises'

// 1 hour data = [timestamp, open]
// const path = './sample-data/coingecko_eth_hourly_010123_020123.json'

// 4 hour data = [timestamp, open, high, low, close]
// const path = './sample-data/coingecko_eth_4hr_022623_030523.json'

// daily data = [timestamp, open]
const path = './source/Coingecko/sample-data/coingecko_eth_daily_121322_031323.json'

let data = []

try {
  const contents = JSON.parse(await readFile(path, {encoding: 'utf8'}))
  // const contentsLength = contents.length
  // console.log('contentsLength', contentsLength)

  let prices  
  // if coingecko 1 hour and daily data
  if (contents.prices) {
    data = contents.prices
    // if daily prices, remove last entry bc it's not at the end of the day
    if (path.includes('daily')) data = data.slice(0, -1)
  // else if coingecko 4 hour data
  } else {
    for (let i = 0; i < contentsLength; i++) {
      const entry = contents[i]
      // console.log(entry)
      const timestamp = entry[0]
      const price = entry[4]
      data.push([timestamp, price])
    }
  }
} catch (err) {
  console.error(err)
}

export {data}