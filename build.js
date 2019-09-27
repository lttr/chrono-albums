const path = require('path')
const fs = require('fs').promises

const structure = require('./src/structure')
const resize = require('./src/resize')
// const markup = require('./src/prerender')
// const { copyDirectory } = require('./src/utils')

const config = require('./config')
const rootDir = __dirname

const arg = process.argv[2]

async function main() {
  if (arg) {
    switch (arg) {
      case 'structure':
        await structure(rootDir, config)
        break
      case 'resize':
        await resize(rootDir, config)
        break
      // case 'markup':
      //   await markup(rootDir, config)
      //   break
      case 'copy':
        // await copyDirectory(path.join('src', 'assets'), 'dist')
        await fs.copyFile('config.js', path.join('dist', 'config.js'))
        break
    }
  } else {
    await structure(rootDir, config)
    await resize(rootDir, config)
    // await markup(rootDir, config)
    // await copyDirectory(path.join('src', 'assets'), 'dist')
    await fs.copyFile('config.js', path.join('dist', 'config.js'))
  }
}

main()
