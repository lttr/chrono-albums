import path from 'path'
import sharp, { fit } from 'sharp'

import { makeSureDirExists } from '../utils'

export async function processFile(
  originalAlbumName,
  filePath,
  fileName,
  outputDir,
  config
) {
  const { jpegOptions, webpOptions } = config
  await Promise.all([
    Object.values(config.resolutions).map(async resolution => {
      const resizedFileNameFunction = resizedFileName(
        outputDir,
        originalAlbumName,
        fileName,
        resolution
      )
      const outputJpg = await resizedFileNameFunction('jpg')
      const outputWebp = await resizedFileNameFunction('webp')
      return await resize(
        filePath,
        resolution,
        outputJpg,
        outputWebp,
        jpegOptions,
        webpOptions
      )
    }),
  ])
}

async function resize(
  inputFilePath,
  resolution,
  outputJpg,
  outputWebp,
  jpegOptions,
  webpOptions
) {
  let buffer
  if (resolution > 400) {
    buffer = await sharp(inputFilePath)
      .resize(resolution, resolution, {
        fit: fit.inside,
        withoutEnlargement: true,
      })
      .withMetadata()
      .toBuffer()
  } else if (resolution <= 400 && resolution > 50) {
    buffer = await sharp(inputFilePath)
      .resize(resolution, resolution, {
        fit: fit.outside,
        withoutEnlargement: true,
      })
      .toBuffer()
  } else {
    buffer = await sharp(inputFilePath)
      .resize(resolution, resolution, {
        fit: fit.outside,
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

function resizedFileName(
  outputDirectory,
  originalAlbumName,
  fileName,
  resolution
) {
  return async function(extension) {
    const index = fileName.lastIndexOf('.')
    const fileWithoutExtension = fileName.slice(0, index)
    const newFileName = `${fileWithoutExtension}__${resolution}.${extension}`
    const newDir = path.join(outputDirectory, originalAlbumName)
    await makeSureDirExists(newDir)
    return path.join(newDir, newFileName)
  }
}
