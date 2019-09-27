const sharp = require('sharp')
const fs = require('fs')
const path = require('path')

async function main(rootDir, config) {
  console.log('Resizing photos')

  const { resolutions, jpegOptions, webpOptions } = config

  const outputDirectory = path.join(rootDir, 'dist', config.photosFolderName)

  const structureFile = path.join(rootDir, 'dist', 'structure.json')

  if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory, { recursive: true })
  }

  const albums = JSON.parse(fs.readFileSync(structureFile, 'utf8'))
  albums.forEach(album => {
    album.photos.forEach(async photo => {
      return await processFile(photo.originalPath, photo.fileName, resolutions)
    })
  })

  async function processFile(filePath, fileName, resolutions) {
    await Promise.all([
      Object.values(resolutions).map(resolution => {
        processResolution(filePath, fileName, resolution)
      }),
    ])
  }

  async function processResolution(filePath, fileName, resolution) {
    const outputJpg = path.join(outputDirectory, resizedFileName(fileName, resolution, 'jpg'))
    const outputWebp = path.join(outputDirectory, resizedFileName(fileName, resolution, 'webp'))

    let buffer
    if (resolution > 400) {
      buffer = await sharp(filePath)
        .resize(resolution, resolution, {
          fit: sharp.fit.inside,
          withoutEnlargement: true,
        })
        .withMetadata()
        .toBuffer()
    } else if (resolution <= 400 && resolution > 50) {
      buffer = await sharp(filePath)
        .resize(resolution, resolution, {
          fit: sharp.fit.outside,
          withoutEnlargement: true,
        })
        .toBuffer()
    } else {
      buffer = await sharp(filePath)
        .resize(resolution, resolution, {
          fit: sharp.fit.outside,
          withoutEnlargement: true,
        })
        .blur(7)
        .toBuffer()
    }

    await sharp(buffer)
      .jpeg(jpegOptions)
      .toFile(outputJpg)

    if (resolution <= 400) {
      await sharp(buffer)
        .webp(webpOptions)
        .toFile(outputWebp)
    }
  }

  function resizedFileName(fileName, resolution, extension) {
    const index = fileName.lastIndexOf('.')
    const fileWithoutExtension = fileName.slice(0, index)
    return `${fileWithoutExtension}__${resolution}.${extension}`
  }
}

module.exports = main
