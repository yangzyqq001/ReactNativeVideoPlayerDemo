import React, { Component } from 'react'
import {
  Text,
  View,
  TouchableOpacity
} from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/MainScreenStyle'

class MainScreen extends Component {
  constructor(props) {
    super(props);
    this.data = [
      { text: 'VideoPlayerScreen', onDown: 'VideoPlayerScreen' },
    ]
  }

  _initRender = () => {
    return this.data.map((el, i) => {
      return (
        <View style={{ marginTop: 30 }} key={i.toString()}>
          <TouchableOpacity onPress={this._onDowm.bind(this, el.onDown)}>
            <Text style={styles.itemViewText}>{el.text}</Text>
          </TouchableOpacity>
        </View>
      );
    })
  }

  _onDowm = (i) => {
    this.props.navigation.navigate(i);
  }
  render() {
    return (
      <View style={styles.container}>
        <Text style={{ marginTop: 20 }}>MainScreen</Text>
        {this._initRender()}
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainScreen)
