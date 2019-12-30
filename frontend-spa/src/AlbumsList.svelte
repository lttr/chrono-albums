<script>
  import { getContext } from 'svelte'
  import { fade } from 'svelte/transition'
  import { link } from 'svelte-spa-router'

  import config from './config'
  import { albumRoute, thumbnailSrc } from './routes'

  const { metadata } = getContext('metadata')

  const albumsByYear = metadata.reduce((acc, curr) => {
    const year = Number(curr.albumDateString.slice(0, 4))
    if (year) {
      if (Array.isArray(acc[year])) {
        acc[year].push(curr)
        acc[year].sort((a, b) => {
          // reverse chronological order
          return a.originalName > b.originalName ? -1 : 1
        })
      } else {
        acc[year] = [curr]
      }
    }
    return acc
  }, {})
  const years = Object.keys(albumsByYear)
</script>

<style>

</style>

<section class="section" in:fade={{ duration: 300 }}>
  <div class="timeline is-centered">

    {#each years as year}
      <header class="timeline-header">
        <span class="tag is-medium is-primary">{year}</span>
      </header>
      {#each albumsByYear[year] as album}
        <div class="timeline-item">
          <div class="timeline-marker" />
          <div class="timeline-content">
            <h2 class="title is-5 is-uppercase">
              <a href={albumRoute(album)} use:link>{album.albumName}</a>
            </h2>
            <p>
              <a href={albumRoute(album)} use:link>
                <img
                  src={thumbnailSrc(album)}
                  alt={album.photos[0].photoName}
                  style="width:320px" />
              </a>
            </p>
          </div>
        </div>
      {/each}
    {/each}

  </div>
</section>
