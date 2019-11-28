const fs = require('fs').promises
const path = require('path')

async function copyDirectory(from, to) {
  console.log('Copying files')
  try {
    await fs.mkdir(to)
  } catch (error) {
    if (error.code !== 'EEXIST') {
      console.log(error.message)
    }
  }
  const entries = await fs.readdir(from, { withFileTypes: true })
  for (let entry of entries) {
    const srcPath = path.join(from, entry.name)
    const destPath = path.join(to, entry.name)
    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath)
    } else {
      await fs.copyFile(srcPath, destPath)
    }
  }
}

module.exports.copyDirectory = copyDirectory
