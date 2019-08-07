const initPhotoSwipeFromDOM = (gallerySelector) => {
  // parse slide data (url, title, size ...) from DOM elements
  // (children of gallerySelector)
  const parseThumbnailElements = (element) => {
    return (
      Array.from(element.childNodes)
        // include only element nodes
        .filter((figureElement) => figureElement.nodeType === 1)
        .map((figureElement) => {
          const linkElement = figureElement.children[0] // <a> element

          const size = linkElement.getAttribute('data-size').split('x')

          // create slide object
          const item = {
            src: linkElement.getAttribute('href'),
            w: parseInt(size[0], 10),
            h: parseInt(size[1], 10),
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
  const onThumbnailsClick = (event) => {
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
  const photoswipeParseHash = () => {
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

  const openPhotoSwipe = (index, galleryElement, disableAnimation, fromURL) => {
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

// execute above function
initPhotoSwipeFromDOM('.my-gallery')
