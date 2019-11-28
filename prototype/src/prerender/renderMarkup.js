const thumbnails = require('./thumbnails')

const photoSwipeElement = require('./photoSwipeElement')

const { wire } = require('viperhtml')
const html = wire()

function renderMarkup(config, albums) {
  return html`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>${config.title}</title>
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
          <div class="chrono-albums">
            ${albums.map(album => {
              return html`
                <h2>${album.albumName}</h2>
                ${thumbnails(album, config)}
              `
            })}
          </div>
        </main>

        ${photoSwipeElement()}

        <script src="https://cdnjs.cloudflare.com/ajax/libs/photoswipe/4.1.1/photoswipe.min.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/photoswipe/4.1.1/photoswipe-ui-default.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/lazysizes@5.1.1/lazysizes.min.js"></script>
        <script src="./script.js"></script>
      </body>
    </html>
  `
}

module.exports = renderMarkup
