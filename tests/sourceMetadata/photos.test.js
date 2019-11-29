import test from 'ava'

import {
  computeAspectRatio,
  testFileExtention,
} from '../../src/sourceMetadata/shared/photos'

// computeAspectRatio

test('computes aspect ratio when width is bigger then height', t => {
  const dimentions = { width: 4, height: 3 }
  t.is(computeAspectRatio(dimentions), 0.75)
})

test('computes aspect ratio when height is bigger then width', t => {
  const dimentions = { width: 2, height: 3 }
  t.is(computeAspectRatio(dimentions), 1.5)
})

// testFileExtension

test('returns true when file has correct file extension', t => {
  t.true(testFileExtention('abc.jpg', ['a', 'jpg']))
})

test('returns false when file has incorrect file extension', t => {
  t.false(testFileExtention('abc.png', ['a', 'jpg']))
})
