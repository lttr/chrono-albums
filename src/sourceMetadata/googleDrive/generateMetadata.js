import { list } from './listFiles'
import { googleApiClient } from './googleApiClient'

export async function generateFromGoogleDrive(rootFolderId) {
  const result = await googleApiClient(list(rootFolderId))
  return result
}
