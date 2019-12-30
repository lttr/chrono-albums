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

<style>
  /* @import url('https://ctyriadvacitka.skauting.cz/css/skaut-design.min.css'); */
</style>

<section style="margin: 0 auto; width: {$appWidth}px">
  <Router {routes} />
</section>

<svelte:window bind:innerWidth={$windowWidth} />
