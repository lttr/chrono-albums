import AlbumsList from './AlbumsList.svelte'
import Album from './Album.svelte'

import config from './config'

export const routes = {
  '/': AlbumsList,
  '/album/:albumId': Album,
}

export function albumRoute(album) {
  return `/album/${album.originalName}`
}

export function thumbnailSrc(album) {
  const parts = [
    config.photosFolderName,
    album.originalName,
    `${album.photos[0].photoName}__320.jpg`,
  ]
  return encodeURI('/' + parts.join('/'))
}

export function photoSrc(album, photo, extension, resolution) {
  const parts = [
    config.photosFolderName,
    album.originalName,
    `${photo.photoName}__${config.resolutions[resolution]}.${extension}`,
  ]
  return encodeURI('/' + parts.join('/'))
}
