const fs = require('fs')
const path = require('path')

const fixUtf8 = require('fix-utf8')
const unorm = require('unorm')
const parseName = require('..')

const names = fs.readFileSync(path.resolve(__dirname, './names.txt')).toString().split('\n')
names.pop()

function clean (name) {
  return unorm.nfkd(fixUtf8(name)).replace(/[\u0300-\u036F]/g, '')
}

const name = names[names.length * Math.random() | 0]
console.log(name)
console.log(clean(name))
console.log(parseName(clean(name)))
