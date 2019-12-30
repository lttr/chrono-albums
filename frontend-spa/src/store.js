import { writable, derived } from 'svelte/store'

import config from './config'

export const windowWidth = writable(800)

export const appWidth = derived(windowWidth, ($windowWidth, set) => {
  set($windowWidth - $windowWidth * config.marginPercent * 2)
})
