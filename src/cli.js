import program from 'commander'
import path from 'path'

import { clean } from './clean'
import config from './config'
import { preparePhotos } from './photosPreparation'
import {
  generateFromFileSystem,
  generateFromGoogleDrive,
  saveSourceMetadata,
} from './sourceMetadata'

async function cli(args) {
  program
    .requiredOption('-p, --plugin <plugin>', 'Plugin name')
    .option('-l, --location <location>', 'Location (file path or url)')
    .parse(args)

  const cwd = path.resolve(process.cwd())
  const { plugin, location } = program

  switch (plugin) {
    case 'file-system':
      saveSourceMetadata(cwd, await generateFromFileSystem(location), config)
      break

    case 'google-drive':
      saveSourceMetadata(cwd, await generateFromGoogleDrive(location), config)
      break

    case 'photos-preparation':
      preparePhotos(cwd, config)
      break

    case 'clean':
      await clean(path.join(cwd, config.output))
      break

    default:
      console.error('unknown log')
      break
  }
}

cli(process.argv).catch(reason => {
  console.log(reason)
})
