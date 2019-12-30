import {
  bind,
  wire,
} from 'https://cdn.jsdelivr.net/npm/hyperhtml@2.31.6/esm.min.js'

import config from '../config.js'

export async function chronoAlbums() {
  const structureResult = await fetch(config.sourceMetadataFileName)
  const data = await structureResult.json()

  const chronoAlbumsElement = document.querySelector('.chrono-albums')
  bind(chronoAlbumsElement)`${render(data)}`
}

function render(data) {
  return wire(data)`
    <style>
    @import 'https://cdn.jsdelivr.net/npm/photoswipe/dist/photoswipe.min.css';
    @import 'https://cdn.jsdelivr.net/npm/photoswipe/dist/default-skin/default-skin.min.css';
    @import 'https://cdn.jsdelivr.net/npm/@lttr/skaut-design/css/skaut-design.min.css';
    </style>
  `
}
