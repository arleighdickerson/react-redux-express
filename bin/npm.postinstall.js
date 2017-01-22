const fs = require('fs')

const from = '..'
const to = './node_modules/app'

fs.unlink(to, () => fs.symlink(from, to, err => {
  if (err) {
    console.error(err)
    process.exit(1)
  } else {
    process.exit(0)
  }
}))
