<script>
  import { getContext } from 'svelte'
  import { fade } from 'svelte/transition'
  import { location, link } from 'svelte-spa-router'
  import justifiedLayout from 'justified-layout'

  import BackArrow from './BackArrow.svelte'
  import Photoswipe from './Photoswipe.svelte'
  import config from './config'
  import { photoSrc } from './helpers'
  import { appWidth } from './store'

  // todo to config
  const numberOfNonLazyloadedItems = 2

  export let params = {}

  const { metadata } = getContext('metadata')
  const { justifiedLayoutOptions } = config
  const albumWidth = justifiedLayoutOptions.containerWidth

  let album
  let geometry
  let albumHeight

  $: {
    album = metadata.find(
      album => album.originalName === decodeURIComponent(params.albumId)
    )
    const aspectRatios = album.photos.map(photo => photo.dimensions.aspectRatio)
    geometry = justifiedLayout(aspectRatios, {
      ...justifiedLayoutOptions,
      containerWidth: $appWidth,
    })
    albumHeight = geometry.containerHeight
  }

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
  .album {
    position: relative;
    padding: 1em 0;
  }

  figure {
    position: absolute;
    margin: 0;
    margin-block: 0;
    margin-inline: 0;
  }
</style>

<a href="/" use:link>
  <BackArrow />
</a>

<h1>{album.albumName}</h1>

<div
  in:fade={{ duration: 300 }}
  class="album"
  style="width: {$appWidth}px; height: {albumHeight}px;"
  itemscope
  itemtype="http://schema.org/ImageGallery">
  {#each album.photos as photo, index}
    <figure
      style={geometryStyles(geometry.boxes[index])}
      class="photo"
      itemprop="associatedMedia"
      itemscope
      itemtype="http://schema.org/ImageObject">
      <a
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
        {album.title}
      </figcaption> -->
    </figure>
  {/each}
</div>

<Photoswipe />
