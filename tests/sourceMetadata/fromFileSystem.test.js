import test from 'ava'

import { generateFromFileSystem } from '../../src/sourceMetadata'

test('generate source metadata from file system', async t => {
  const actual = await generateFromFileSystem('tests/fixture1')
  t.snapshot(actual)
})
