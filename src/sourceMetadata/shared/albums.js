const ALBUM_NAME_REGEX = /(?<date>[0-9]{4}-[0-9]{2}(-[0-9]{2})?) (?<name>.+)/

/**
 * @param {string} directoryName
 * @return {boolean} true when directory name matches expected album name structure
 */
export function isAnAlbumDirectory(directoryName) {
  return ALBUM_NAME_REGEX.test(directoryName)
}

/**
 * Returns structured album metadata parsed from directory name
 *
 * @param {string} directoryName
 * @return {Album}
 */
export function parseAlbumName(directoryName) {
  const match = directoryName.match(ALBUM_NAME_REGEX)
  if (!match) {
    throw new Error(`Album name ${directoryName} has unexpected format`)
  }
  return {
    albumDateString: match.groups.date,
    albumName: match.groups.name,
    albumTime: new Date(match.groups.date),
    photos: [],
  }
}
