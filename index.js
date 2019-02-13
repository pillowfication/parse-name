const letterRegex = require('./letter-regex')
const nameRegex = `(?:['‘’”׳-]|${letterRegex})+[.'‘’”׳-]*`
const nicknameRegex = '(?:".*?"|“.*?”|‘.*?’|\\(.*?\\)|\\[.*?\\])'
const prefixRegex = `(?:${[ 'captain', 'doctor', 'dr\\.?', 'frau', 'herr', 'hr\\.?', 'ind\\.?', 'judge', 'misc\\.?', 'miss', 'mister', 'monsieur', 'm\\.?d\\.?', 'mr\\.?', 'mrs\\.?', 'ms\\.?', 'mx\\.?', 'officer', 'prof\\.?', 'professor', 'sir', 'sr\\.?' ].join('|')})`
const suffixRegex = `(?:${[ '2', 'd\\.?c\\.', 'd\\.?o\\.', 'esq\\.?', 'esquire', 'ii', 'iii', 'iv', 'j\\.?d\\.?', 'jnr\\.?', 'jr\\.?', 'll\\.?m\\.?', 'm\\.?d\\.?', 'p\\.?c\\.?', 'ph\\.?d\\.?', 'snr\\.?', 'sr\\.?' ].join('|')})`
const lastNamePrefixRegex = `(?:${[ 'a', 'al', 'ab', 'abd', 'abo', 'abu', 'bar', 'bin', 'da', 'dal', 'de', 'de la', 'del', 'della', 'der', 'di', 'du', 'ibn', 'l\'?', 'la', 'le', 'lo', 'san', 'st.?', 'ste', 'ter', 'van', 'van de', 'van der', 'van den', 'vel', 'ver', 'vere', 'von' ].join('|')})`

const llMatch = new RegExp(letterRegex, 'g')
const nnMatch = new RegExp(`(${nicknameRegex})`, 'g')
const nnReplace = new RegExp(nicknameRegex, 'g')
const pfReplace = new RegExp(`^(${prefixRegex}\\s+)+`, 'g')
const sfReplace = new RegExp(`(\\s+${suffixRegex})+$`, 'g')
const fmlMatch = new RegExp(
  '^' +
  `(${nameRegex})` +
  `(?: (${nameRegex}(?: ${nameRegex})*?)(?= ${nameRegex}))??` +
  `(?: ((?:${lastNamePrefixRegex} )?${nameRegex}))?` +
  '$'
)
const lfmMatch = new RegExp(
  '^' +
  `((?:${lastNamePrefixRegex} )?${nameRegex})` +
  '\\s*,\\s*' +
  `(${nameRegex})` +
  `(?:\\s*,\\s*)?(?: (${nameRegex}(?: ${nameRegex})*))?` +
  '$'
)
const lmfMatch = new RegExp(
  '^' +
  `((?:${lastNamePrefixRegex} )?${nameRegex})` +
  `(?:\\s+(${nameRegex}(?: ${nameRegex})*))?` +
  '\\s*,\\s*' +
  `(${nameRegex})` +
  '$'
)

const dotRegex = /\s*\.[\s–‐­-]*/g
const dashSpaceRegex = /\s*[–‐­-]\s*/g
const miscCharRegex = /[✡*†?]/g
const spaceRegex = /\s+/g
const trimRegex = /(^[\s,]+|[\s,]+$)/g

function clean (string) {
  return string
    .replace(dotRegex, '. ')
    .replace(spaceRegex, ' ')
    .replace(dashSpaceRegex, '-')
    .replace(miscCharRegex, '')
    .replace(trimRegex, '')
    .toLowerCase()
}

function parseName (string) {
  string = clean(string)

  const nicknameMatches = string.match(nnMatch)
  const nicknames = nicknameMatches
    ? nicknameMatches.map(string => string.substring(1, string.length - 1).trim()).join(', ')
    : undefined
  if (nicknames) {
    string = string.replace(nnReplace, '')
  }

  string = string.replace(pfReplace, '')
  string = string.replace(sfReplace, '')
  string = clean(string)

  let match, firstName, middleName, lastName

  /* eslint-disable no-cond-assign */
  if (match = string.match(fmlMatch)) {
    [, firstName, middleName, lastName] = match
  } else if (match = string.match(lfmMatch)) {
    [, lastName, firstName, middleName] = match
  } else if (match = string.match(lmfMatch)) {
    [, lastName, middleName, firstName] = match
  }
  /* eslint-enable no-cond-assign */

  return match && {
    firstName: firstName && firstName.match(llMatch).join(''),
    middleName: middleName && middleName.match(llMatch).join(''),
    lastName: lastName && lastName.match(llMatch).join(''),
    nicknames
  }
}

module.exports = parseName
