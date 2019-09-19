const config = require('./config')

const fs = require('fs')
const path = require('path')

const renderAlbum = require('./album/renderAlbum')

const outputDirectory = path.join(__dirname, 'dist')
if (!fs.existsSync(outputDirectory)) {
  fs.mkdirSync(outputDirectory)
}

const structureFile = path.join(__dirname, 'structure.json')
const albums = JSON.parse(fs.readFileSync(structureFile, 'utf8'))
const output = renderAlbum(config, albums).toString()

const outputFile = path.join(outputDirectory, 'index.html')
fs.writeFileSync(outputFile, output)
