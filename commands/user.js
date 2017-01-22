const prompt = require('prompt')
const User = require('mongoose').model('User');

const promptAttributes = [
  'firstName',
  'lastName',
  'email',
  'username',
  {
    name: 'password',
    hidden: true
  }
]

function normalizePromptResult(result) {
  return {
    ...result,
    provider: 'local'
  }
}

export function create() {
  prompt.get(promptAttributes, (err, result) => {
    console.log(result)
    const user = new User(normalizePromptResult(result))
    user.save()
      .then(res => {
        console.log(res)
        process.exit(1)
      })
      .catch(e => {
        console.error(e)
        process.exit(1)
      })
  })
}
