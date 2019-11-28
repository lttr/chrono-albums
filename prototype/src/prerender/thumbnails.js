const { wire } = require('viperhtml')
const justifiedLayout = require('justified-layout')
const html = wire()

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
  const lazyload = index < 15 ? false : true
  const hrefSmall = `img/${photo.photoName}__${resolutions.small}.jpg`
  const hrefMedium = `img/${photo.photoName}__${resolutions.medium}.jpg`
  const hrefLarge = `img/${photo.photoName}__${resolutions.large}.jpg`
  const hrefWebpThumb = `img/${photo.photoName}__${resolutions.thumbnail}.webp`
  const hrefJpgThumb = `img/${photo.photoName}__${resolutions.thumbnail}.jpg`
  const hrefWebpPlaceholder = `img/${photo.photoName}__${resolutions.placeholder}.webp`
  const hrefJpgPlaceholder = `img/${photo.photoName}__${resolutions.placeholder}.jpg`

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

module.exports = thumbnails
