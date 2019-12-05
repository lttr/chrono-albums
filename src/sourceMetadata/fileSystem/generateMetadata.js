import path from 'path'

import { isAnAlbumDirectory, parseAlbumName } from '../shared/albums'
import { computeAspectRatio, testFileExtention } from '../shared/photos'
import { fileMetadata, getDateTaken, getDirs, getFilesPaths } from './fileUtils'

const PHOTO_FILE_EXTENSIONS = ['jpg', 'jpeg']

export async function generateFromFileSystem(location) {
  const inputDirectory = path.resolve(location)
  const albums = []
  for await (const dir of getDirs(inputDirectory)) {
    if (isAnAlbumDirectory(dir)) {
      const album = parseAlbumName(dir)
      for await (const filePath of getFilesPaths(dir)) {
        if (testFileExtention(filePath, PHOTO_FILE_EXTENSIONS)) {
          const { stats, dimensions, exifData } = await fileMetadata(filePath)
          album.photos.push(
            buildPhotoMetadata(filePath, stats, exifData, dimensions)
          )
        }
      }
      albums.push(album)
    }
  }
  return albums
}

function buildPhotoMetadata(filePath, stats, exifData, dimensions) {
  return {
    dateTaken: getDateTaken(stats.birthtime, exifData),
    originalPath: filePath,
    fileName: path.parse(filePath).base,
    photoName: path.parse(filePath).name,
    fileSize: stats.size,
    dimensions: {
      width: dimensions.width,
      height: dimensions.height,
      aspectRatio: computeAspectRatio(dimensions),
    },
  }
}
