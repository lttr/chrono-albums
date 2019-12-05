import { promises as fs } from 'fs'

export async function clean(outputDir) {
  await fs.rmdir(outputDir, { recursive: true })
}
