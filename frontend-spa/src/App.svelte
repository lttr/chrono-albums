<script>
  import { setContext } from 'svelte'
  import Router from 'svelte-spa-router'

  import { routes } from './routes'
  import { windowWidth, appWidth } from './store'

  export let metadata

  setContext('metadata', {
    metadata,
  })
</script>

<style global>
  @import url('../node_modules/@lttr/skaut-design/css/skaut-design.css');
  @import url('../node_modules/photoswipe/dist/photoswipe.css');
  @import url('../node_modules/photoswipe/dist/default-skin/default-skin.css');
</style>

<svelte:window bind:innerWidth={$windowWidth} />

<section style="margin: 0 auto; width: {$appWidth}px">
  <Router {routes} />
</section>
