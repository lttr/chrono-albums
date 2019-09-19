const { wire } = require('viperhtml')
const html = wire()

function thumbnail(photo) {
  const hrefSmall = `img/${photo.photoName}__640.jpg`
  const hrefMedium = `img/${photo.photoName}__1024.jpg`
  const hrefLarge = `img/${photo.photoName}__1920.jpg`
  const hrefWebpThumb = `img/${photo.photoName}__256.webp`
  const hrefJpgThumb = `img/${photo.photoName}__256.jpg`
  const dimSmall = `${photo.dimensions.width}x${photo.dimensions.height}`
  const dimMedium = `${photo.dimensions.width}x${photo.dimensions.height}`
  const dimLarge = `${photo.dimensions.width}x${photo.dimensions.height}`
  return html`
    <div class="album" itemscope itemtype="http://schema.org/ImageGallery">
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
            <img itemprop="thumbnail" src="${hrefJpgThumb}" />
          </picture>
        </a>
        <!-- <figcaption itemprop="caption description"></figcaption> -->
      </figure>
    </div>
  `
}

module.exports = function(album) {
  return album.photos.map(photo => thumbnail(photo))
}
