import test from 'ava'

import {
  isAnAlbumDirectory,
  parseAlbumName,
} from '../../src/sourceMetadata/shared/albums'

// isAnAlbumDirectory

test('album directory name with year and month', t => {
  t.true(isAnAlbumDirectory('2019-08 Album name'))
})

test('album directory name with year, month and day', t => {
  t.true(isAnAlbumDirectory('2019-08-05 Album name'))
})

test('album directory name with year, month and day but no name', t => {
  t.false(isAnAlbumDirectory('2019-08-05'))
})

test('album directory name with name only', t => {
  t.false(isAnAlbumDirectory('Album name'))
})

// parseAlbumName

test('album name parsing can parse expected name format', t => {
  const expected = {
    albumDateString: '2019-08-05',
    albumName: 'Album name',
    albumTime: new Date('2019-08-05'),
    photos: [],
  }
  const directoryName = '2019-08-05 Album name'
  const actual = parseAlbumName(directoryName)
  t.deepEqual(actual, expected)
})

test('album name parsing should throw when name does not include caption', t => {
  const directoryName = '2019-08-05'
  t.throws(() => parseAlbumName(directoryName))
})

test('album name parsing should throw when name does not include date', t => {
  const directoryName = 'Name'
  t.throws(() => parseAlbumName(directoryName))
})
