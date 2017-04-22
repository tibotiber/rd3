export const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('')

export function countLettersOccurrences (str) {
  let occurrences = {}
  ALPHABET.forEach(l => {
    const letterRegex = new RegExp(l, 'gi')
    occurrences[l] = (str.match(letterRegex) || []).length
  })
  return occurrences
}

export function countLetters (str) {
  return (str.match(/[a-zA-Z]/gi) || []).length
}
