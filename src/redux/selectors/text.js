import {createSelector} from 'reselect'

export const getText = state => state

export const getUsers = createSelector(getText, text => {
  return text.sortBy((v, k) => k).keySeq()
})

export const getTexts = createSelector(getText, text => {
  return text.sortBy((v, k) => k).valueSeq()
})
