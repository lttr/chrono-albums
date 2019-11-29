import { list } from './listFiles'
import { googleApiClient } from './googleApiClient'

export async function generateFromGoogleDrive() {
  const rootFolderId = '1E05JjLmDRRbJgWFKRQfyCriAQCOGeKw7'
  const result = await googleApiClient(list(rootFolderId))
  console.log(JSON.stringify(result, null, 2))
  return result
}
