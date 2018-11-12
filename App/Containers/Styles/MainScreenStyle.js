import { StyleSheet } from 'react-native'
import { ApplicationStyles } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  itemViewText: {
    fontSize: 18,
  }
})
