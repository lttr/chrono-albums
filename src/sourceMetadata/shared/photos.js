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
  return Number(Number(width / height).toFixed(2))
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
