const thumbnails = require('./thumbnails')

const photoSwipeElement = require('./photoSwipeElement')

const { wire } = require('viperhtml')
const html = wire()

module.exports = function(config, albums) {
  return html`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>${config.albumName}${config.title && '-'}${config.title}</title>
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
          ${albums.map(album => {
            return html`
              <h2>${album.albumName}</h2>
              ${thumbnails(album)}
            `
          })}
        </main>

        ${photoSwipeElement()}

        <script src="https://cdnjs.cloudflare.com/ajax/libs/photoswipe/4.1.1/photoswipe.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/photoswipe/4.1.1/photoswipe-ui-default.min.js"></script>
        <script src="./script.js"></script>
      </body>
    </html>
  `
}
