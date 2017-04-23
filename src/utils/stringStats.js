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

export function countLettersCoOccurrences (str) {
  let occurrences = []
  ALPHABET.forEach(l1 => {
    ALPHABET.forEach(l2 => {
      const regex = new RegExp(l1 + l2, 'gi')
      const count = (str.match(regex) || []).length
      if (count > 0) {
        occurrences.push({
          letter1: l1,
          letter2: l2,
          count: count
        })
      }
    })
  })
  return occurrences
}
