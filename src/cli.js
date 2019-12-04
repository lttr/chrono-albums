import program from 'commander'
import { generateFromFileSystem } from './sourceMetadata'

function cli(args) {
  program
    .requiredOption('-p, --plugin <plugin>', 'Plugin name')
    .requiredOption('-l, --location <location>', 'Location (file path or url)')
    .parse(args)

  console.log(program.plugin, program.location)
  switch (program.plugin) {
    case 'file-system':
      generateFromFileSystem(program.location)
      break

    default:
      console.error('unknown log')
      break
  }
}

cli(process.argv)
