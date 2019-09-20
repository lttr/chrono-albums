const fs = require('fs').promises
const path = require('path')

const structure = require('./src/structure')
const resize = require('./src/resize')
const markup = require('./src/markup')

const config = require('./config')
const rootDir = __dirname

structure(rootDir, config)
resize(rootDir, config)
markup(rootDir, config)

async function copyDirectory(from, to) {
  try {
    await fs.mkdir(to)
  } catch (e) {
    console.log(e)
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

copyDirectory(path.join('src', 'assets'), 'dist')
