import AlbumsList from './AlbumsList.svelte'
import Album from './Album.svelte'

export const routes = {
  '/': AlbumsList,
  '/album/:albumId': Album,
}
