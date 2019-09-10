function initPhotoSwipeFromDOM(gallerySelector) {
  let imageSize = 'small'
  let firstResize = true
  let imageSrcWillChange = false

  const supportsWebpImages = supportsWebp()

  // parse slide data (url, title, size ...) from DOM elements
  // (children of gallerySelector)
  function parseThumbnailElements(element) {
    return (
      Array.from(element.childNodes)
        // include only element nodes
        .filter((figureElement) => figureElement.nodeType === 1)
        .map((figureElement) => {
          const linkElement = figureElement.children[0]

          const sizeSmall = linkElement.getAttribute('data-size-small').split('x')
          const sizeMedium = linkElement.getAttribute('data-size-medium').split('x')
          const sizeLarge = linkElement.getAttribute('data-size-large').split('x')

          // create slide object
          const item = {
            small: {
              src: linkElement.getAttribute('data-src-small'),
              w: parseInt(sizeSmall[0], 10),
              h: parseInt(sizeSmall[1], 10),
            },
            medium: {
              src: linkElement.getAttribute('data-src-medium'),
              w: parseInt(sizeMedium[0], 10),
              h: parseInt(sizeMedium[1], 10),
            },
            large: {
              src: linkElement.getAttribute('data-src-large'),
              w: parseInt(sizeLarge[0], 10),
              h: parseInt(sizeLarge[1], 10),
            },
          }

          if (figureElement.children.length > 1) {
            // <figcaption> content
            item.title = figureElement.children[1].innerHTML
          }

          if (linkElement.children.length > 0) {
            // <img> thumbnail element, retrieving thumbnail url
            item.msrc = linkElement.children[0].getAttribute('src')
          }

          item.el = figureElement // save link to element for getThumbBoundsFn
          return item
        })
    )
  }

  // triggers when user clicks on thumbnail
  function onThumbnailsClick(event) {
    event.preventDefault()
    // find root element of slide
    const clickedListItem = event.target.closest('figure')

    if (!clickedListItem) {
      return
    }

    // find index of clicked item by looping through all child nodes
    // alternatively, you may define index via data- attribute
    const clickedGallery = clickedListItem.parentNode
    const childNodes = clickedListItem.parentNode.childNodes

    const index = Array.from(childNodes)
      // include only element nodes
      .filter((node) => node.nodeType === 1)
      .findIndex((node) => node == clickedListItem)

    if (index >= 0) {
      // open PhotoSwipe if valid index found
      openPhotoSwipe(index, clickedGallery)
    }
    return false
  }

  // parse picture index and gallery index from URL (#&pid=1&gid=2)
  function photoswipeParseHash() {
    const hash = window.location.hash.substring(1)
    const params = {}

    if (hash.length < 5) {
      return params
    }

    const vars = hash.split('&')
    for (let i = 0; i < vars.length; i++) {
      if (!vars[i]) {
        continue
      }
      const pair = vars[i].split('=')
      if (pair.length < 2) {
        continue
      }
      params[pair[0]] = pair[1]
    }

    if (params.gid) {
      params.gid = parseInt(params.gid, 10)
    }

    return params
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
      } else if (imageSize !== 'medium' && realViewportWidth < 1200 && realViewportWidth >= 800) {
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
      // Image sizes
      //
      // large -> 1920
      // medium -> 1024
      // small -> 640

      // Set image source & size based on real viewport width
      switch (imageSize) {
        case 'small':
          item.src = item.small.src
          item.w = item.small.w
          item.h = item.small.h
          break
        case 'medium':
          item.src = item.medium.src
          item.w = item.medium.w
          item.h = item.medium.h
          break
        case 'large':
          item.src = item.large.src
          item.w = item.large.w
          item.h = item.large.h
          break
      }

      if (supportsWebpImages) {
        item.src = item.src.replace(/\.jpg$/, '.webp')
      }
    })
  }

  function openPhotoSwipe(index, galleryElement, disableAnimation, fromURL) {
    const pswpElement = document.querySelector('.pswp')
    const items = parseThumbnailElements(galleryElement)

    // define options (if needed)
    const options = {
      // define gallery index (for URL)
      galleryUID: galleryElement.getAttribute('data-pswp-uid'),
      getThumbBoundsFn: (index) => {
        // See Options -> getThumbBoundsFn section of documentation for more info
        const thumbnail = items[index].el.getElementsByTagName('img')[0] // find thumbnail
        const pageYScroll = window.pageYOffset || document.documentElement.scrollTop
        const rect = thumbnail.getBoundingClientRect()

        return { x: rect.left, y: rect.top + pageYScroll, w: rect.width }
      },
      // ui options
      shareButtons: [
        { id: 'download', label: 'Download photo', url: '{{raw_image_url}}', download: true },
      ],
    }

    // PhotoSwipe opened from URL
    if (fromURL) {
      if (options.galleryPIDs) {
        // parse real index when custom PIDs are used
        // http://photoswipe.com/documentation/faq.html#custom-pid-in-url
        for (var j = 0; j < items.length; j++) {
          if (items[j].pid == index) {
            options.index = j
            break
          }
        }
      } else {
        // in URL indexes start from 1
        options.index = parseInt(index, 10) - 1
      }
    } else {
      options.index = parseInt(index, 10)
    }

    // exit if index not found
    if (isNaN(options.index)) {
      return
    }

    if (disableAnimation) {
      options.showAnimationDuration = 0
    }

    // @ts-ignore
    // Pass data to PhotoSwipe and initialize it
    const gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options)

    listenToGalleryViewportChange(gallery)
    listenToGettingImage(gallery)

    gallery.init()
  }

  // loop through all gallery elements and bind events
  const galleryElements = document.querySelectorAll(gallerySelector)
  Array.from(galleryElements).forEach((galleryElement, index) => {
    galleryElement.setAttribute('data-pswp-uid', index + 1)
    galleryElement.onclick = onThumbnailsClick
  })

  // Parse URL and open gallery if it contains #&pid=3&gid=1
  const hashData = photoswipeParseHash()
  if (hashData.pid && hashData.gid) {
    openPhotoSwipe(hashData.pid, galleryElements[hashData.gid - 1], true, true)
  }
}

initPhotoSwipeFromDOM('.album')

async function supportsWebp() {
  if (!self.createImageBitmap) return false
  const webpData = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA='
  const blob = await fetch(webpData).then((r) => r.blob())
  return createImageBitmap(blob).then(() => true, () => false)
}
