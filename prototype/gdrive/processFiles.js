const fs = require('fs')

const data = require('./data.json')

const rootFolderName = 'Fotky24'

function buildTree(data, rootFolderName) {
  const copiedData = [...data]
  const rootFolder = copiedData.find(folder => folder.name === rootFolderName)

  function build(arrayOfFolders, currentFolder) {
    const children = [
      ...arrayOfFolders.filter(
        folder => folder.parents[0] === currentFolder.id
      ),
    ]
    if (children.length) {
      currentFolder.children = children
      children.forEach(folder => {
        // folder.parent = currentFolder
        build(arrayOfFolders, folder)
      })
    }
  }

  build(copiedData, rootFolder)

  return rootFolder
}

function formatTree(tree) {
  const log = []
  function printTree(root, level) {
    log.push(
      `${root.name.replace(
        /^/,
        Array(level)
          .fill('-')
          .join('')
      )}`
    )
    if (root.children) {
      for (const child of root.children) {
        printTree(child, level + 1)
      }
    }
  }
  printTree(tree, 0)
  return log.join('\n')
}

const tree = buildTree(data, rootFolderName)
// const formattedTree = formatTree(tree)

fs.writeFileSync('tree.json', JSON.stringify(tree))
