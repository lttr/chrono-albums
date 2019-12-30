import 'lazysizes'

import config from './config'
import App from './App.svelte'

let app

fetch(config.sourceMetadataFileName)
  .then(res => res.json())
  .then(metadata => {
    app = new App({
      target: document.querySelector('#chrono-albums'),
      props: {
        metadata,
      },
    })
  })

export default app
