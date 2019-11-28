import test from 'ava'

import { isArrayEmpty } from '../src/'

test('is an empty array', t => {
  t.true(isArrayEmpty([]))
})

test('is not an array', t => {
  t.false(isArrayEmpty({}))
})
