import React, { Component } from 'react'
import { ScrollView, Text, Image, View } from 'react-native'
import { Images } from '../Themes'

// Styles
import styles from './Styles/LaunchScreenStyles'

export default class LaunchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nRemainTime: 1
    }
  }

  next() {
    this.timer = setInterval(() => {
      this.setState(previousState => {
        let newValue = previousState.nRemainTime - 1;
        console.log(newValue);
        if (newValue <= 0) {
          console.log("go next");
          if (this.timer) {
            clearInterval(this.timer);
          }
          this.props.navigation.navigate('MainScreen');
        } else {
          this.setState({
            nRemainTime: newValue
          });
        }
      });
    }, 1000);
  }

  componentDidMount() {
    this.next();
  }
  render() {
    return (
      <View style={styles.mainContainer}>
        <Image source={Images.background} style={styles.backgroundImage} resizeMode='stretch' />
        <ScrollView style={styles.container}>
          <View style={styles.centered}>
            <Image source={Images.launch} style={styles.logo} />
          </View>

          <View style={styles.section} >
            <Image source={Images.ready} />
            <Text style={styles.sectionText}>
              This probably isn't what your app is going to look like. Unless your designer handed you this screen and, in that case, congrats! You're ready to ship. For everyone else, this is where you'll see a live preview of your fully functioning app using Ignite.
            </Text>
          </View>

        </ScrollView>
      </View>
    )
  }
}
