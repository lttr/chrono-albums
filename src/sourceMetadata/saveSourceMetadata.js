import { promises as fs } from 'fs'
import path from 'path'
import { makeSureDirExists } from '../utils'

export async function saveSourceMetadata(dir, metadata, config) {
  const json = JSON.stringify(metadata, null, 2)
  const outputDir = path.join(dir, config.output)
  await makeSureDirExists(outputDir)
  try {
    await fs.writeFile(
      path.join(outputDir, config.sourceMetadataFileName),
      json
    )
  } catch (err) {
    console.error(err)
  }
}
