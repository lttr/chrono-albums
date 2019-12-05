import { promises as fs } from 'fs'

export async function makeSureDirExists(dir) {
  try {
    await fs.mkdir(dir, { recursive: true })
  } catch (err) {
    if (err.code === 'EEXIST') {
      // This is ok, we want the directory to exist
    } else {
      throw err
    }
  }
}
