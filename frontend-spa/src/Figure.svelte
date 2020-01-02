<script>
  import { photoSrc } from './helpers'

  // todo to config
  const numberOfNonLazyloadedItems = 2

  export let album
  export let photo
  export let index
  export let geometry

  function shouldBeLazyLoaded(index) {
    return index > numberOfNonLazyloadedItems
  }

  function geometryStyles(g) {
    return `
      width: ${g.width}px;
      height: ${g.height}px;
      top: ${g.top}px;
      left: ${g.left}px;
    `
  }

  function imgStyles(dimensions) {
    return `width: ${dimensions.width}px; height: ${dimensions.height}px;`
  }
</script>

<style>
  figure {
    position: absolute;
    margin: 0;
  }
</style>

<figure
  style={geometryStyles(geometry.boxes[index])}
  class="photo"
  itemprop="associatedMedia"
  itemscope
  itemtype="http://schema.org/ImageObject">
  <a
    on:click|preventDefault
    class="photo-link"
    href={photoSrc(album, photo, 'jpg', 'medium')}
    itemprop="contentUrl">
    <picture>
      {#if shouldBeLazyLoaded(index)}
        <source
          srcset={photoSrc(album, photo, 'webp', 'placeholder')}
          data-srcset={photoSrc(album, photo, 'webp', 'thumbnail')}
          type="image/webp" />
        <img
          class="photo-image lazyload"
          alt=""
          itemprop="thumbnail"
          src={photoSrc(album, photo, 'jpg', 'placeholder')}
          data-src={photoSrc(album, photo, 'jpg', 'thumbnail')}
          data-aspectRatio={photo.dimensions.aspectRatio}
          width={geometry.boxes[index].width}
          height={geometry.boxes[index].height}
          style={imgStyles(geometry.boxes[index])} />
      {:else}
        <source
          srcset={photoSrc(album, photo, 'webp', 'thumbnail')}
          type="image/webp" />
        <img
          class="photo-image"
          alt=""
          itemprop="thumbnail"
          src={photoSrc(album, photo, 'jpg', 'thumbnail')}
          data-aspectRatio={photo.dimensions.aspectRatio}
          width={geometry.boxes[index].width}
          height={geometry.boxes[index].height}
          style={imgStyles(geometry.boxes[index])} />
      {/if}
    </picture>
  </a>
  <!-- <figcaption class="photo-caption" itemprop="caption description">
        {photo.caption}
      </figcaption> -->
</figure>
