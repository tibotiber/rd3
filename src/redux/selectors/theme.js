import {createSelector} from 'reselect'
import themes from 'utils/themes'

const getThemeName = state => state

export const getTheme = createSelector(getThemeName, theme => themes[theme])
