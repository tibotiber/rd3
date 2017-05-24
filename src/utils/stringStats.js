export const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('')

export const countLettersOccurrences = str => {
  let occurrences = {}
  ALPHABET.forEach(l => {
    const letterRegex = new RegExp(l, 'gi')
    occurrences[l] = (str.match(letterRegex) || []).length
  })
  return occurrences
}

export const countLetters = (str, letter) => {
  if (!letter) {
    return (str.match(/[a-zA-Z]/gi) || []).length
  } else if (Array.isArray(letter)) {
    const regex = new RegExp(`[${letter.join()}]`, 'gi')
    return (str.match(regex) || []).length
  } else {
    const regex = new RegExp(letter, 'gi')
    return (str.match(regex) || []).length
  }
}

export const countLettersCoOccurrences = str => {
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
