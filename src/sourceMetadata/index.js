import mergeOptions from 'merge-options'
// import { promises as fs } from 'fs'
// import path from 'path'

import defaultConfig from '../config.default'
import { generateMetadata } from './generateMetadata'

const rootDir = './tests'

export default async function main(customConfig = {}) {
  const config = mergeOptions(defaultConfig, customConfig)
  const albumMetadata = await generateMetadata(`${rootDir}/fixture1`, config)
  return albumMetadata

  // const json = JSON.stringify(albumMetadata, null, 2)
  // await fs.writeFile(path.join(rootDir, 'structure.json'), json)
}
