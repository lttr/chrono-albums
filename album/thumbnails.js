const { wire } = require('viperhtml')
const html = wire()
module.exports = data => html`
  <div class="album" itemscope itemtype="http://schema.org/ImageGallery">
    <figure itemprop="associatedMedia" itemscope itemtype="http://schema.org/ImageObject">
      <a
        href="../dist-images/IMG_0316__1024.jpg"
        itemprop="contentUrl"
        data-src-small="../dist-images/test_01__640.jpg"
        data-src-medium="../dist-images/test_01__1024.jpg"
        data-src-large="../dist-images/test_01__1920.jpg"
        data-size-small="1024x1024"
        data-size-medium="1024x1024"
        data-size-large="1024x1024"
      >
        <picture>
          <source srcset="../dist-images/test_01__256.webp" type="image/webp" />
          <img itemprop="thumbnail" src="../dist-images/test_01__256.jpg" />
        </picture>
      </a>
      <figcaption itemprop="caption description">Comment</figcaption>
    </figure>
  </div>
`
