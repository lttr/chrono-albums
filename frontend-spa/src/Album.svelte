<script>
  import { getContext } from 'svelte'
  import { fade } from 'svelte/transition'
  import { location, querystring, link } from 'svelte-spa-router'
  import justifiedLayout from 'justified-layout'
  import PhotoSwipe from 'photoswipe'
  import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default'

  import BackArrow from './BackArrow.svelte'
  import Photoswipe from './Photoswipe.svelte'
  import Figure from './Figure.svelte'
  import config from './config'
  import { appWidth } from './store'
  import { photoSrc } from './helpers'

  export let params = {}

  const { metadata } = getContext('metadata')
  const { justifiedLayoutOptions } = config
  const albumWidth = justifiedLayoutOptions.containerWidth

  let photoswipeElement
  let pageScrollY
  let imageSize = 'small'
  let firstResize = true
  let imageSrcWillChange = false

  let album
  let geometry
  let albumHeight

  $: {
    album = getCurrentAlbum()
    const aspectRatios = album.photos.map(photo => photo.dimensions.aspectRatio)
    geometry = justifiedLayout(aspectRatios, {
      ...justifiedLayoutOptions,
      containerWidth: $appWidth,
    })
    albumHeight = geometry.containerHeight
  }

  function getCurrentAlbum() {
    return metadata.find(
      album => album.originalName === decodeURIComponent(params.albumId)
    )
  }

  function openPhotoSwipe(e, index, disableAnimation, fromURL) {
    const imgElement = e.target
    const items = getCurrentAlbum().photos.map(photo => {
      const { resolutions } = config
      const { aspectRatio } = photo.dimensions
      function buildItem(size) {
        return {
          src: photoSrc(album, photo, 'jpg', size),
          w:
            aspectRatio > 1
              ? resolutions[size]
              : resolutions[size] * aspectRatio,
          h:
            aspectRatio > 1
              ? resolutions[size] / aspectRatio
              : resolutions[size],
          title: photo.caption,
          msrc: photoSrc(album, photo, 'jpg', 'small'),
        }
      }
      return {
        small: buildItem('small'),
        medium: buildItem('medium'),
        large: buildItem('large'),
      }
    })
    console.log(items)

    const options = {
      // galleryUID: album.albumName,
      // galleryPIDs: true,
      history: false,
      getThumbBoundsFn: photoIndex => {
        const rect = imgElement.getBoundingClientRect()
        return {
          x: rect.left,
          y: rect.top + pageScrollY,
          w: rect.width,
        }
      },
      shareButtons: [
        {
          id: 'download',
          label: 'Stáhnout fotku',
          url: '{{raw_image_url}}',
          download: true,
        },
      ],
    }

    // if (fromURL) {
    //   if (options.galleryPIDs) {
    //     // parse real index when custom PIDs are used
    //     // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
    //     for (var j = 0; j < items.length; j++) {
    //       if (items[j].pid == index) {
    //         options.index = j
    //         break
    //       }
    //     }
    //   } else {
    //     options.index = parseInt(index, 10)
    //   }
    // } else {
    //   options.index = parseInt(index, 10)
    // }

    // // exit if index not found
    // if (isNaN(options.index)) {
    //   return
    // }

    // if (disableAnimation) {
    //   options.showAnimationDuration = 0
    // }

    const pswpElement = photoswipeElement.getPhotoswipeWrapper()
    const gallery = new PhotoSwipe(
      pswpElement,
      PhotoSwipeUI_Default,
      items,
      options
    )

    listenToGalleryViewportChange(gallery)
    listenToGettingImage(gallery)

    gallery.init()
  }

  function listenToGalleryViewportChange(gallery) {
    // beforeResize event fires each time size of gallery viewport updates
    gallery.listen('beforeResize', () => {
      // gallery.viewportSize.x - width of PhotoSwipe viewport
      // gallery.viewportSize.y - height of PhotoSwipe viewport
      // window.devicePixelRatio - ratio between physical pixels and device independent pixels (Number)
      //                          1 (regular display), 2 (@2x, retina) ...

      // calculate real pixels when size changes
      const realViewportWidth = gallery.viewportSize.x * window.devicePixelRatio

      // Code below is needed if you want image to switch dynamically on window.resize

      // Find out if current images need to be changed
      if (imageSize !== 'large' && realViewportWidth >= 1200) {
        imageSize = 'large'
        imageSrcWillChange = true
      } else if (
        imageSize !== 'medium' &&
        realViewportWidth < 1200 &&
        realViewportWidth >= 800
      ) {
        imageSize = 'medium'
        imageSrcWillChange = true
      } else if (imageSize !== 'small' && realViewportWidth < 800) {
        imageSize = 'small'
        imageSrcWillChange = true
      }

      // Invalidate items only when source is changed and when it's not the first update
      if (imageSrcWillChange && !firstResize) {
        // invalidateCurrItems sets a flag on slides that are in DOM,
        // which will force update of content (image) on window.resize.
        gallery.invalidateCurrItems()
      }

      if (firstResize) {
        firstResize = false
      }

      imageSrcWillChange = false
    })
  }

  function listenToGettingImage(gallery) {
    // gettingData event fires each time PhotoSwipe retrieves image source & size
    gallery.listen('gettingData', (index, item) => {
      // Set image source & size based on real viewport width
      console.log(item)
      item = {
        ...item,
        ...item[imageSize],
      }
      console.log(item)
    })
  }
</script>

<style>
  .album {
    position: relative;
    padding: 1em 0;
  }
</style>

<svelte:window bind:scrollY={pageScrollY} />

<a href="/" use:link>
  <BackArrow />
</a>

<h1 class="title ">{album.albumName}</h1>

<div
  in:fade={{ duration: 300 }}
  class="album"
  style="width: {$appWidth}px; height: {albumHeight}px;"
  itemscope
  itemtype="http://schema.org/ImageGallery">
  {#each album.photos as photo, index}
    <Figure
      {album}
      {photo}
      {index}
      {geometry}
      on:click={e => openPhotoSwipe(e, index)} />
  {/each}
</div>

<Photoswipe bind:this={photoswipeElement} />
