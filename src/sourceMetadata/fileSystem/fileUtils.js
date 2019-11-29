import isValidDate from 'date-fns/isValid'
import parseDate from 'date-fns/parse'
import { promises as fs } from 'fs'
import { imageSize } from 'image-size'
import jpegExif from 'jpeg-exif'
import path from 'path'
import { promisify } from 'util'

export const parseExif = promisify(jpegExif.parse)
export const sizeOf = promisify(imageSize)

export async function* getDirs(inputDirectory) {
  const dirs = await fs.readdir(inputDirectory, { withFileTypes: true })
  for (const dir of dirs) {
    const resolvedDir = path.resolve(inputDirectory, dir.name)
    if (dir.isDirectory()) {
      yield resolvedDir
      // NOTE: This is recursive, but album directories are expected to be
      // only 2 levels deep
      yield* getDirs(resolvedDir)
    }
  }
}

export async function* getFilesPaths(inputDirectory) {
  const dirsAndFiles = await fs.readdir(inputDirectory, { withFileTypes: true })
  for (const dirOrFile of dirsAndFiles) {
    const fullPath = path.resolve(inputDirectory, dirOrFile.name)
    const relativePath = path.relative(process.cwd(), fullPath)
    if (dirOrFile.isDirectory()) {
      yield* getFilesPaths(relativePath)
    } else {
      yield relativePath
    }
  }
}

export async function fileMetadata(filePath) {
  const stats = await fs.stat(filePath)
  const dimensions = await sizeOf(filePath)
  const exifData = await parseExif(filePath)
  return { stats, dimensions, exifData }
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
