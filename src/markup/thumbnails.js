const { wire } = require('viperhtml')
const html = wire()

function thumbnail(photo, resolutions) {
  const hrefSmall = `img/${photo.photoName}__${resolutions.small.toString()}.jpg`
  const hrefMedium = `img/${photo.photoName}__${resolutions.medium.toString()}.jpg`
  const hrefLarge = `img/${photo.photoName}__${resolutions.large.toString()}.jpg`
  const hrefWebpThumb = `img/${photo.photoName}__${resolutions.thumbnail.toString()}.webp`
  const hrefJpgThumb = `img/${photo.photoName}__${resolutions.thumbnail.toString()}.jpg`

  const { aspectRatio } = photo.dimensions
  let dimSmall
  let dimMedium
  let dimLarge
  let thumbnailWidth
  let thumbnailHeight
  if (aspectRatio > 1) {
    thumbnailWidth = resolutions.thumbnail
    thumbnailHeight = resolutions.thumbnail / aspectRatio
    dimSmall = `${resolutions.small}x${resolutions.small / aspectRatio}`
    dimMedium = `${resolutions.medium}x${resolutions.medium / aspectRatio}`
    dimLarge = `${resolutions.large}x${resolutions.large / aspectRatio}`
  } else {
    thumbnailWidth = resolutions.thumbnail * aspectRatio
    thumbnailHeight = resolutions.thumbnail
    dimSmall = `${resolutions.small * aspectRatio}x${resolutions.small}`
    dimMedium = `${resolutions.medium * aspectRatio}x${resolutions.medium}`
    dimLarge = `${resolutions.large * aspectRatio}x${resolutions.large}`
  }

  return html`
    <figure itemprop="associatedMedia" itemscope itemtype="http://schema.org/ImageObject">
      <a
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
          <source srcset="${hrefWebpThumb}" type="image/webp" />
          <img
            itemprop="thumbnail"
            src="${hrefJpgThumb}"
            data-aspectRatio="${aspectRatio}"
            width="${thumbnailWidth}"
            height="${thumbnailHeight}"
          />
        </picture>
      </a>
      <!-- <figcaption itemprop="caption description"></figcaption> -->
    </figure>
  `
}

module.exports = function(album, resolutions) {
  return html`
    <div class="album" itemscope itemtype="http://schema.org/ImageGallery">
      ${album.photos.map(photo => thumbnail(photo, resolutions))}
    </div>
  `
}
