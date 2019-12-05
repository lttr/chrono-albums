import program from 'commander'
import {
  generateFromFileSystem,
  saveSourceMetadata,
  generateFromGoogleDrive,
} from './sourceMetadata'
import path from 'path'

async function cli(args) {
  program
    .requiredOption('-p, --plugin <plugin>', 'Plugin name')
    .requiredOption('-l, --location <location>', 'Location (file path or url)')
    .parse(args)

  const cwd = path.resolve(process.cwd())
  const { plugin, location } = program

  switch (plugin) {
    case 'file-system':
      saveSourceMetadata(cwd, await generateFromFileSystem(location))
      break

    case 'google-drive':
      saveSourceMetadata(cwd, await generateFromGoogleDrive(location))
      break

    default:
      console.error('unknown log')
      break
  }
}

cli(process.argv)
