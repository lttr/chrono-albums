import test from 'ava'

import gen from '../../src/sourceMetadata'

test('meta', async t => {
  const actual = await gen()
  t.snapshot(actual)
})
