const path = require('path')
const fs = require('fs').promises
const { promisify } = require('util')
const { imageSize } = require('image-size')
const sizeOf = promisify(imageSize)

async function* getFiles(inputDirectory) {
  const dirs = await fs.readdir(inputDirectory, { withFileTypes: true })
  for (const dir of dirs) {
    const res = path.resolve(inputDirectory, dir.name)
    if (dir.isDirectory()) {
      yield* getFiles(res)
    } else {
      yield res
    }
  }
}

async function* getDirs(inputDirectory) {
  const dirs = await fs.readdir(inputDirectory, { withFileTypes: true })
  for (const dir of dirs) {
    const resolvedDir = path.resolve(inputDirectory, dir.name)
    if (dir.isDirectory()) {
      yield resolvedDir
      yield* getDirs(resolvedDir)
    }
  }
}

function isAnAlbumDirectory(directoryName) {
  return directoryName.match(/(?<date>[0-9]{4}-[0-9]{2}(-[0-9]{2})?) (?<name>.*)/)
}

async function main(rootPath, config) {
  console.log('Generating structure')
  const inputDirectory = path.join(rootPath, config.photosFolderName)
  const albums = []
  for await (const dir of getDirs(inputDirectory)) {
    const match = isAnAlbumDirectory(dir)
    if (match) {
      const albumTime = new Date(match.groups.date)
      const album = {
        albumDateString: match.groups.date,
        albumName: match.groups.name,
        albumTime,
        photos: [],
      }
      for await (const file of getFiles(dir)) {
        if (file.toLowerCase().endsWith('jpg')) {
          const stats = await fs.stat(file)
          const dimensions = await sizeOf(file)
          // @ts-ignore
          dimensions.aspectRatio = dimensions.width / dimensions.height
          const fileInfo = {
            modified: stats.mtime,
            originalPath: file,
            fileName: path.parse(file).base,
            photoName: path.parse(file).name,
            fileSize: stats.size,
            dimensions,
          }
          album.photos.push(fileInfo)
        }
      }
      albums.push(album)
    }
  }
  const albumMetadata = JSON.stringify(albums, null, 2)
  await fs.writeFile(path.join(rootPath, 'dist', 'structure.json'), albumMetadata)
}

module.exports = main
