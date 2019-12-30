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
  @import url('../node_modules/@lttr/skaut-design/css/skaut-design.css');
</style>

<svelte:window bind:innerWidth={$windowWidth} />

<section style="margin: 0 auto; width: {$appWidth}px">
  <Router {routes} />
</section>
