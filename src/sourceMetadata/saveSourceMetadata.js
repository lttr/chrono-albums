import { promises as fs } from 'fs'
import path from 'path'

export async function saveSourceMetadata(dir, metadata) {
  const json = JSON.stringify(metadata, null, 2)
  await fs.writeFile(path.join(dir, 'sourceMetadata.json'), json)
}
