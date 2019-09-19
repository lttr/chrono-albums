const thumbnails = require('./thumbnails')

const photoSwipeElement = require('./photoSwipeElement')

const { wire } = require('viperhtml')
const html = wire()

module.exports = data => {
  return html`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>${data.albumName}${data.title && '-'}${data.title}</title>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/photoswipe/4.1.1/photoswipe.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/photoswipe/4.1.1/default-skin/default-skin.min.css"
        />
        <link rel="stylesheet" href="./style.css" />
      </head>
      <body>
        <main>
          <h2>${data.albumName}</h2>
          ${thumbnails(data)}
        </main>

        ${photoSwipeElement()}

        <script src="https://cdnjs.cloudflare.com/ajax/libs/photoswipe/4.1.1/photoswipe.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/photoswipe/4.1.1/photoswipe-ui-default.min.js"></script>
        <script src="./script.js"></script>
      </body>
    </html>
  `
}
