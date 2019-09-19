const config = require('./config')

const fs = require('fs')
const path = require('path')

const renderAlbum = require('./album/renderAlbum')

const outputDirectory = path.join(__dirname, 'dist')
if (!fs.existsSync(outputDirectory)) {
  fs.mkdirSync(outputDirectory)
}

const output = renderAlbum(config).toString()

const outputFile = path.join(outputDirectory, 'index.html')
fs.writeFileSync(outputFile, output)
