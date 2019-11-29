const ALBUM_NAME_REGEX = /(?<date>[0-9]{4}-[0-9]{2}(-[0-9]{2})?) (?<name>.+)/

/**
 * @typedef { {
 *  modified: number,
 *  originalPath: string,
 *  fileName: string,
 *  photoName: string,
 *  fileSize: number,
 *  dimensions: {
 *    height: number,
 *    width: number,
 *    aspectRatio: number
 *  }
 * } } Photo
 *
 * @typedef { {
 *  albumDateString: string,
 *  albumName: string,
 *  albumTime: Date,
 *  photos?: Array<Photo>
 * } } Album
 */

/**
 * Computes aspect ratio
 *
 * @typedef { {
 *   width: number
 *   height: number
 * } } Dimentions
 *
 * @param {Dimensions} dimentions object with width and height
 * @return {number} height devided by width and rounded to 2 decimal places
 */
export function computeAspectRatio({ width, height }) {
  return Number(Number(height / width).toFixed(2))
}

/**
 * Tests if file has one of permitted extentions
 *
 * @param {string} filePath path to file
 * @param {string[]} fileExtentions array of permitted extensions
 * @return {boolean} true when one of extentions match file name, false otherwise
 */
export function testFileExtention(filePath, fileExtentions) {
  return fileExtentions.some(ext => filePath.toLowerCase().endsWith(ext))
}

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
