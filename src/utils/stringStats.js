export const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('')

export function countLettersOccurrences (str) {
  let occurrences = {}
  ALPHABET.forEach(l => {
    const letterRegex = new RegExp(l, 'gi')
    occurrences[l] = (str.match(letterRegex) || []).length
  })
  return occurrences
}
