import { google } from 'googleapis'
import { isAnAlbumDirectory, parseAlbumName } from '../shared/albums'
import { computeAspectRatio } from '../shared/photos'

export function list(rootFolderId) {
  return async oAuthClient => {
    const drive = google.drive({ version: 'v3', auth: oAuthClient })

    const folders = []
    const children = await listChildFolders(drive, rootFolderId)
    for (const child of children) {
      const grandChildren = await listChildFolders(drive, child.id)
      folders.push(...grandChildren)
    }

    const albums = []
    for (const folder of folders) {
      if (isAnAlbumDirectory(folder.name)) {
        const album = parseAlbumName(folder.name)
        const drivePhotos = await listPhotos(drive, folder.id)
        for (const drivePhoto of drivePhotos) {
          album.photos.push(buildPhotoMetadata(drivePhoto))
        }
        albums.push(album)
      }
    }
    return albums
  }
}

function buildPhotoMetadata(drivePhoto) {
  return {
    dateTaken: drivePhoto.createdTime,
    originalPath: drivePhoto.webContentLink,
    fileName: drivePhoto.name.toLocaleLowerCase(),
    photoName: drivePhoto.name
      .toLocaleLowerCase()
      .replace('.jpg', '')
      .replace('.jpeg', ''),
    fileSize: parseInt(drivePhoto.size, 10),
    dimensions: {
      width: drivePhoto.imageMediaMetadata.width,
      height: drivePhoto.imageMediaMetadata.height,
      aspectRatio: computeAspectRatio(drivePhoto.imageMediaMetadata),
    },
  }
}

async function listChildFolders(drive, rootFolderId) {
  const query = [
    `'${rootFolderId}' in parents`,
    `and`,
    `mimeType = 'application/vnd.google-apps.folder'`,
  ].join(' ')
  const fields = ['id', 'name'].join(', ')
  const result = await queryDrive(drive, query, fields)
  return result
}

async function listPhotos(drive, rootFolderId) {
  const query = [
    `'${rootFolderId}' in parents`,
    `and`,
    `mimeType contains 'image/jpeg'`,
  ].join(' ')
  const fields = [
    'id',
    'name',
    'imageMediaMetadata',
    'webContentLink',
    'createdTime',
    'size',
  ].join(', ')
  const result = await queryDrive(drive, query, fields)
  return result
}

async function queryDrive(drive, query, fields) {
  let pageToken = null
  let result = null
  const allFiles = []
  do {
    try {
      result = await drive.files.list({
        q: query,
        fields: `nextPageToken, files(${fields})`,
        spaces: 'drive',
        pageToken: pageToken,
      })
    } catch (err) {
      console.log('The API returned an error: ' + err)
    }
    const files = result && result.data && result.data.files
    if (files && files.length) {
      allFiles.push(...files)
      pageToken = result.data.nextPageToken
    } else {
      console.log('No files found.')
    }
  } while (pageToken)
  return allFiles
}
