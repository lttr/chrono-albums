const path = require('path')

const structure = require('./src/structure')
const resize = require('./src/resize')
const markup = require('./src/markup')
const { copyDirectory } = require('./src/utils')

const config = require('./config')
const rootDir = __dirname

const arg = process.argv[2]

if (arg) {
  switch (arg) {
    case 'structure':
      structure(rootDir, config)
      break
    case 'resize':
      resize(rootDir, config)
      break
    case 'markup':
      markup(rootDir, config)
      break
    case 'copy':
      copyDirectory(path.join('src', 'assets'), 'dist')
      break
  }
} else {
  structure(rootDir, config)
  resize(rootDir, config)
  markup(rootDir, config)
  copyDirectory(path.join('src', 'assets'), 'dist')
}
