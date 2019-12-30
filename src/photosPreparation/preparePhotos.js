import { promises as fs } from 'fs'
import path from 'path'

import { processFile } from './resize'

export async function preparePhotos(rootDir, config) {
  const outputDirectory = path.join(
    rootDir,
    config.output,
    config.photosFolderName
  )
  const sourceMetadataPath = path.join(
    rootDir,
    config.output,
    config.sourceMetadataFileName
  )

  let sourceMetadata
  try {
    sourceMetadata = await fs.readFile(sourceMetadataPath, 'utf8')
  } catch (err) {
    throw new Error('Source metadata file does not exist.')
  }

  let albums
  try {
    albums = JSON.parse(sourceMetadata)
  } catch (err) {
    throw new Error('Source metadata file is not a JSON file.')
  }

  albums.forEach(album => {
    album.photos.forEach(async photo => {
      return await processFile(
        album.originalName,
        photo.originalPath,
        photo.fileName,
        outputDirectory,
        config
      )
    })
  })
}
