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
