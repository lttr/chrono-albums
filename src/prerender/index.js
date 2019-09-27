const fs = require('fs').promises
const path = require('path')

const renderAlbum = require('./renderMarkup')

async function main(rootDir, config) {
  console.log('Creating markup')
  const outputDirectory = path.join(rootDir, 'dist')
  const outputDirectoryExists = await fs
    .access(outputDirectory)
    .then(() => true)
    .catch(() => false)
  if (!outputDirectoryExists) {
    await fs.mkdir(outputDirectory)
  }

  const structureFile = path.join(rootDir, 'dist', 'structure.json')

  const albums = JSON.parse(await fs.readFile(structureFile, 'utf8'))
  const output = renderAlbum(config, albums).toString()

  const outputFile = path.join(outputDirectory, 'index.html')
  await fs.writeFile(outputFile, output)
}

module.exports = main
