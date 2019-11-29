import isValidDate from 'date-fns/isValid'
import parseDate from 'date-fns/parse'
import path from 'path'

import {
  computeAspectRatio,
  isAnAlbumDirectory,
  testFileExtention,
  parseAlbumName,
} from './utils'
import { fileMetadata, getDirs, getFilesPaths } from './file-utils'

const PHOTO_FILE_EXTENSIONS = ['jpg', 'jpeg']

export async function generateMetadata(rootPath, config) {
  const inputDirectory = path.join(rootPath, config.photosFolderName)
  const albums = []
  for await (const dir of getDirs(inputDirectory)) {
    if (isAnAlbumDirectory(dir)) {
      const album = parseAlbumName(dir)
      for await (const filePath of getFilesPaths(dir)) {
        if (testFileExtention(filePath, PHOTO_FILE_EXTENSIONS)) {
          const { stats, dimensions, exifData } = await fileMetadata(filePath)
          const fileInfo = buildFileInfo(filePath, stats, dimensions, exifData)
          album.photos.push(fileInfo)
        }
      }
      albums.push(album)
    }
  }
  return albums
}

function buildFileInfo(filePath, stats, dimensions, exifData) {
  return {
    dateTaken: getDateTaken(stats.birthtime, exifData),
    originalPath: filePath,
    fileName: path.parse(filePath).base,
    photoName: path.parse(filePath).name,
    fileSize: stats.size,
    dimensions: {
      ...dimensions,
      aspectRatio: computeAspectRatio(dimensions),
    },
  }
}

/**
 * @param {string} path to photo file
 * @return {Date} date when given photo was taken or creation date
 * in case exif information is missing
 */
export function getDateTaken(created, exifData) {
  const EXIF_DATE_TIME_FORMAT = 'yyyy:MM:dd HH:mm:ss'
  let exifDateTime
  if (exifData && exifData.SubExif) {
    exifDateTime = exifData.SubExif.DateTimeOriginal
  }
  let dateTaken = parseDate(exifDateTime, EXIF_DATE_TIME_FORMAT, created)
  if (!isValidDate(dateTaken)) {
    dateTaken = created
  }
  return dateTaken
}
