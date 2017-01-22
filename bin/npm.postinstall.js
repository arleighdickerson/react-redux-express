const fs = require('fs')

fs.symlink('./', './node_modules/app', err => {
  if (err) {
    console.error(err)
    process.exit(1)
  } else {
    process.exit(0)
  }
})
