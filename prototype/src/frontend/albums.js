import justifiedLayout from 'justified-layout'
import { bind, wire } from 'hypermorphic'
import config from '../../config'
import { initPhotoSwipeFromDOM } from './script'

function ps() {
  initPhotoSwipeFromDOM('.album')
}

const html = wire()

main()

async function main() {
  const structureResult = await fetch('./structure.json')
  const data = await structureResult.json()
  renderChronoAlbums(data)
}

function renderChronoAlbums(data) {
  const chronoAlbumsElement = document.querySelector('.chrono-albums')
  const windowWidth = window.innerWidth
  const width = windowWidth - windowWidth * config.marginPercent * 2
  chronoAlbumsElement.style.width = `${width}px`
  config.justifiedLayoutOptions.containerWidth = width
  bind(chronoAlbumsElement)`${timeline(data, width)}`
}

function renderAlbum(album) {
  const chronoAlbumsElement = document.querySelector('.chrono-albums')
  const windowWidth = window.innerWidth
  const width = windowWidth - windowWidth * config.marginPercent * 2
  chronoAlbumsElement.style.width = `${width}px`
  config.justifiedLayoutOptions.containerWidth = width
  bind(chronoAlbumsElement)`${albums(album, width)}`
}

window.addEventListener('resize', debounce(main, 200))

function debounce(func, wait) {
  let timeout = null
  return (...args) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

async function albums(album, width) {
  const structureResult = await fetch('./structure.json')
  const data = await structureResult.json()
  album = data[0]
  return wire()`
      <h2 class="album-heading">${album.albumName}</h2>
      ${thumbnails(album, config)}
    `
}

function timeline(albums, width) {
  return wire()`
    <section class="section">
      <div class="timeline is-centered">
        <header class="timeline-header">
          <span class="tag is-medium is-primary">2018</span>
        </header>
        ${albums.map(album => {
          const link = '#/' + album.albumName
          return wire()`
            <div class="timeline-item">
              <div class="timeline-marker"></div>
              <div class="timeline-content">
                <h2 class="title is-5 is-uppercase">
                  <a href="${link}" onclick="renderAlbum()">
                    ${album.albumName}
                  </a>
                </h2>
                <p>
                  <a href="${link}">
                    <img
                      src="${'test/photos/' + album.photos[0].photoName + '__320.jpg'}"
                      style="width:340px"
                    />
                  </a>
                </p>
              </div>
            </div>
          `
        })}
      </div>
    </section>
  `
}

/**
 * @typedef { {
 *  placeholder: number,
 *  thumbnail: number,
 *  small: number,
 *  medium: number,
 *  large: number
 * } } Resolutions
 *
 * @typedef {{
 *  containerWidth: number,
 *  containerPadding: number,
 *  boxSpacing: number,
 *  targetRowHeight: number,
 *  targetRowHeightTolerance: number
 * }} JustifiedLayoutOptions
 *
 * @typedef {{
 *  resolutions: Resolutions,
 *  justifiedLayoutOptions: JustifiedLayoutOptions
 * }} Config
 *
 * @typedef { {
 *  modified: number,
 *  originalPath: string,
 *  fileName: string,
 *  photoName: string,
 *  fileSize: number,
 *  dimensions: {
 *    height: number,
 *    width: number,
 *    aspectRatio: number
 *  }
 * } } Photo
 *
 * @typedef { {
 *  albumDateString: string,
 *  albumName: string,
 *  albumTime: Date,
 *  photos: Array<Photo>
 * } } Album
 *
 * @typedef {{
 *  aspectRatio : number,
 *  top : number,
 *  left : number,
 *  width : number,
 *  height : number
 * }} Box
 *
 * @typedef {{
 *  containerHeight: number,
 *  widowCount: number,
 *  boxes: Array<Box>
 * }} Geometry
 */

/**
 * @param {Photo} photo
 * @param {Resolutions} resolutions
 * @param {Box} boxGeometry
 */
function thumbnail(photo, index, resolutions, boxGeometry) {
  const lazyload = index < 4 ? false : true
  const hrefSmall = `${config.photosFolderName}/${photo.photoName}__${resolutions.small}.jpg`
  const hrefMedium = `${config.photosFolderName}/${photo.photoName}__${resolutions.medium}.jpg`
  const hrefLarge = `${config.photosFolderName}/${photo.photoName}__${resolutions.large}.jpg`
  const hrefWebpThumb = `${config.photosFolderName}/${photo.photoName}__${resolutions.thumbnail}.webp`
  const hrefJpgThumb = `${config.photosFolderName}/${photo.photoName}__${resolutions.thumbnail}.jpg`
  const hrefWebpPlaceholder = `${config.photosFolderName}/${photo.photoName}__${resolutions.placeholder}.webp`
  const hrefJpgPlaceholder = `${config.photosFolderName}/${photo.photoName}__${resolutions.placeholder}.jpg`

  const { aspectRatio } = photo.dimensions
  let dimSmall
  let dimMedium
  let dimLarge
  if (aspectRatio > 1) {
    dimSmall = `${resolutions.small}x${resolutions.small / aspectRatio}`
    dimMedium = `${resolutions.medium}x${resolutions.medium / aspectRatio}`
    dimLarge = `${resolutions.large}x${resolutions.large / aspectRatio}`
  } else {
    dimSmall = `${resolutions.small * aspectRatio}x${resolutions.small}`
    dimMedium = `${resolutions.medium * aspectRatio}x${resolutions.medium}`
    dimLarge = `${resolutions.large * aspectRatio}x${resolutions.large}`
  }

  return html`
    <figure
      style="${boxGeometry}"
      class="photo"
      itemprop="associatedMedia"
      itemscope
      itemtype="http://schema.org/ImageObject"
    >
      <a
        class="photo-link"
        href="${hrefMedium}"
        itemprop="contentUrl"
        data-src-small="${hrefSmall}"
        data-src-medium="${hrefMedium}"
        data-src-large="${hrefLarge}"
        data-size-small="${dimSmall}"
        data-size-medium="${dimMedium}"
        data-size-large="${dimLarge}"
      >
        <picture>
          ${lazyload
            ? html`
                <source
                  srcset="${hrefWebpPlaceholder}"
                  data-srcset="${hrefWebpThumb}"
                  type="image/webp"
                />
                <img
                  class="photo-image lazyload"
                  itemprop="thumbnail"
                  src="${hrefJpgPlaceholder}"
                  data-src="${hrefJpgThumb}"
                  data-aspectRatio="${aspectRatio}"
                  width="${boxGeometry.width}"
                  height="${boxGeometry.height}"
                />
              `
            : html`
                <source srcset="${hrefWebpThumb}" type="image/webp" />
                <img
                  class="photo-image"
                  itemprop="thumbnail"
                  src="${hrefJpgThumb}"
                  data-aspectRatio="${aspectRatio}"
                  width="${boxGeometry.width}"
                  height="${boxGeometry.height}"
                />
              `}
        </picture>
      </a>
      <!-- <figcaption class="photo-caption" itemprop="caption description"></figcaption> -->
    </figure>
  `
}

/**
 * @param {Album} album
 * @param {Config} config
 */
function thumbnails(album, config) {
  const { resolutions, justifiedLayoutOptions } = config
  const aspectRatios = album.photos.map(photo => photo.dimensions.aspectRatio)
  /** @type Geometry */
  // @ts-ignore
  const geometry = justifiedLayout(aspectRatios, justifiedLayoutOptions)
  const containerStyles = {
    width: justifiedLayoutOptions.containerWidth,
    height: geometry.containerHeight,
  }
  return html`
    <div
      class="album"
      onconnected="${ps}"
      style="${containerStyles}"
      itemscope
      itemtype="http://schema.org/ImageGallery"
    >
      ${album.photos.map((photo, index) =>
        thumbnail(photo, index, resolutions, geometry.boxes[index])
      )}
    </div>
  `
}
