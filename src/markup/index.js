const fs = require('fs')
const path = require('path')

const renderAlbum = require('./renderMarkup')

function main(rootDir, config) {
  const outputDirectory = path.join(rootDir, 'dist')
  if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory)
  }

  const structureFile = path.join(rootDir, 'dist', 'structure.json')

  const albums = JSON.parse(fs.readFileSync(structureFile, 'utf8'))
  const output = renderAlbum(config, albums).toString()

  const outputFile = path.join(outputDirectory, 'index.html')
  fs.writeFileSync(outputFile, output)
}

module.exports = main
