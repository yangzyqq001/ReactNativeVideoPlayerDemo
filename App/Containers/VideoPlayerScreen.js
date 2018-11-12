import React, { Component } from 'react'
import {
  View,
  StatusBar,
  Dimensions,
} from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import Video from 'react-native-video';
import VideoPlayer from '../Components/VideoPlayer/VideoPlayer';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
// Styles
import styles from './Styles/VideoPlayerScreenStyle'

class VideoPlayerScreen extends Component {
  _onPlayError = (e) => {
    console.log('VideoPlayerScreen paly error');
    console.log(e);
  };
  render() {
    return (
      <View style={styles.container}>
        <StatusBar hidden={true} />
        <VideoPlayer
          videoUrl={'http://vjs.zencdn.net/v/oceans.mp4'}
          repeat={false}
          videoWidth={screenWidth}
          videoHeight={screenHeight}
          onPlayError={this._onPlayError}
        />
        {/* <Video
          ref={(ref) => this.videoPlayer = ref}
          source={{ uri: 'http://vjs.zencdn.net/v/oceans.mp4' }}
          // rate={1.0}
          // volume={1.0}
          // muted={false}
          // paused={false}
          // resizeMode={'contain'}
          // playWhenInactive={false}
          // playInBackground={false}
          repeat={true}
          // ignoreSilentSwitch={'ignore'}
          // progressUpdateInterval={250.0}
          style={{ width: 360, height: 200 }}
        /> */}
      </View>
    )
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

export default connect(mapStateToProps, mapDispatchToProps)(VideoPlayerScreen)
