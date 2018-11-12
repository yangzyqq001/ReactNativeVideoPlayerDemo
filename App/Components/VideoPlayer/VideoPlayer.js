import React, { Component } from 'react';
import PropTypes from 'prop-types'
import {
  View,
  Dimensions,
  Image,
  Text,
  Slider,
  TouchableWithoutFeedback,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import Video from 'react-native-video';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

function formatTime(second) {
  let h = 0, i = 0, s = parseInt(second);
  if (s > 60) {
    i = parseInt(s / 60);
    s = parseInt(s % 60);
  }
  // 补零
  let zero = function (v) {
    return (v >> 0) < 10 ? "0" + v : v;
  };
  return [zero(h), zero(i), zero(s)].join(":");
}
//https://github.com/react-native-community/react-native-video
//https://juejin.im/post/5a9f9fde518825557207e7b0
//https://github.com/mrarronz/react-native-blog-examples/tree/master/Chapter7-VideoPlayer/VideoExample
//{path: "file:///storage/emulated/0/DCIM/Camera/VID_20181107_175423.mp4", uri: "content://media/external/video/media/475574"}
//http://vjs.zencdn.net/v/oceans.mp4
export default class VideoPlayer extends Component {
  static defaultProps = {
    videoWidth: screenWidth,
    videoHeight: screenHeight,
    repeat: false,
  }

  static propTypes = {
    videoUrl: PropTypes.string,
    videoWidth: PropTypes.number,
    videoHeight: PropTypes.number,
    repeat: PropTypes.bool,
    onPlayError: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      videoUrl: this.props.videoUrl,
      videoCover: "http://124.129.157.208:8889/data/uploads/kecheng/2018/01/18/5a600b2c99836.png@0o_0l_220w.png",
      showVideoCover: false,    // 是否显示视频封面
      videoWidth: this.props.videoWidth,
      videoHeight: this.props.videoHeight,
      showVideoControl: false, // 是否显示视频控制组件
      isPlaying: true,        // 视频是否正在播放
      currentTime: 0,        // 视频当前播放的时间
      duration: 0,           // 视频的总时长
      playFromBeginning: false, // 是否从头开始播放
      isBufferLoading: false, // 是否缓冲中 
    };
  }

  render() {
    return (
      <View style={styles.container} >
        <View style={{ width: this.state.videoWidth, height: this.state.videoHeight, backgroundColor: '#000000' }}>
          <Video
            ref={(ref) => this.videoPlayer = ref}
            source={{ uri: this.state.videoUrl }}
            rate={1.0}
            volume={1.0}
            muted={false}
            paused={!this.state.isPlaying}
            resizeMode={'contain'}
            playWhenInactive={false}
            playInBackground={false}
            repeat={true}
            ignoreSilentSwitch={'ignore'}
            progressUpdateInterval={250.0}
            onLoadStart={this._onLoadStart}
            onLoad={this._onLoaded}
            onProgress={this._onProgressChanged}
            onEnd={this._onPlayEnd}
            onError={this._onPlayError}
            onBuffer={this._onBuffering}
            style={{ width: this.state.videoWidth, height: this.state.videoHeight }}
          />
          {
            this.state.showVideoCover ?
              <Image
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: this.state.videoWidth,
                  height: this.state.videoHeight
                }}
                resizeMode={'contain'}
                source={{ uri: this.state.videoCover }}
              /> : null
          }

          <TouchableWithoutFeedback onPress={() => { this.hideControl() }}>
            <View
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: this.state.videoWidth,
                height: this.state.videoHeight,
                backgroundColor: this.state.isPlaying ? 'transparent' : 'rgba(0, 0, 0, 0.2)',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
              {
                this.state.isBufferLoading &&
                <ActivityIndicator size="large"
                  color={'#00cdec'} style={{
                    position: 'absolute',
                  }} />
              }
              {
                this.state.isPlaying ? null :
                  <TouchableWithoutFeedback onPress={() => { this.onPressPlayButton() }}>
                    <Image
                      style={styles.playButton}
                      source={require('./image/icon_video_play.png')}
                    />
                  </TouchableWithoutFeedback>
              }
            </View>
          </TouchableWithoutFeedback>
          {
            this.state.showVideoControl ?
              <View style={[styles.control, { width: this.state.videoWidth }]}>
                <TouchableOpacity activeOpacity={0.3} onPress={() => { this.onControlPlayPress() }}>
                  <Image
                    style={styles.playControl}
                    source={this.state.isPlaying ? require('./image/icon_control_pause.png') : require('./image/icon_control_play.png')}
                  />
                </TouchableOpacity>
                <Text style={styles.time}>{formatTime(this.state.currentTime)}</Text>
                <Slider
                  style={{ flex: 1 }}
                  maximumTrackTintColor={'#999999'}
                  minimumTrackTintColor={'#00c06d'}
                  thumbImage={require('./image/icon_control_slider.png')}
                  value={this.state.currentTime}
                  minimumValue={0}
                  maximumValue={this.state.duration}
                  onValueChange={(currentTime) => { this.onSliderValueChanged(currentTime) }}
                />
                <Text style={styles.time}>{formatTime(this.state.duration)}</Text>
                {/* <TouchableOpacity activeOpacity={0.3} >
                  <Image
                    style={styles.shrinkControl}
                    source={this.state.isFullScreen ? require('./image/icon_control_shrink_screen.png') : require('./image/icon_control_full_screen.png')}
                  />
                </TouchableOpacity> */}
              </View> : null
          }
        </View>
        {/* <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <Button title={'开始播放'} onPress={() => { this.playVideo() }} />
          <Button title={'暂停播放'} onPress={() => { this.pauseVideo() }} />
          <Button title={'切换视频'} onPress={() => { this.switchVideo("http://124.129.157.208:8810/SD/zhishidian/grade_8_1/wuli_shu/01.mp4", 0) }} />
        </View> */}
      </View>
    )
  }

  /// -------Video组件回调事件-------

  _onLoadStart = () => {
    console.log('视频开始加载');
  };

  _onBuffering = () => {
    console.log('视频缓冲中...')
    this.setState({
      isBufferLoading: true
    });
  };

  _onLoaded = (data) => {
    console.log('视频加载完成');
    this.setState({
      isBufferLoading: false
    });
    this.setState({
      duration: data.duration,
    });
  };

  _onProgressChanged = (data) => {
    this.setState({
      isBufferLoading: false
    });
    console.log('视频进度更新');
    if (this.state.isPlaying) {
      this.setState({
        currentTime: data.currentTime,
      })
    }
  };

  _onPlayEnd = () => {
    console.log('视频播放结束');
    if (!this.props.repeat) {
      this.setState({
        currentTime: 0,
        isPlaying: false,
        playFromBeginning: true
      });
    }
  };

  _onPlayError = (e) => {
    console.log('视频播放失败');
    console.log(e);
    this.props.onPlayError(e);
  };

  ///-------控件点击事件-------

  /// 控制播放器工具栏的显示和隐藏
  hideControl() {
    this.clearTimeOuthideControl();
    if (this.state.showVideoControl) {
      this.setState({
        showVideoControl: false,
      })
    } else {
      this.setState(
        {
          showVideoControl: true,
        },
        // 5秒后自动隐藏工具栏
        this.createTimeOuthideControl
      )
    }
  }
  //添加延时隐藏工具栏
  createTimeOuthideControl() {
    this.timer = setTimeout(() => {
      this.setState({
        showVideoControl: false
      })
    }, 5000);
  }

  //清理隐藏工具栏timer
  clearTimeOuthideControl() {
    this.timer && clearTimeout(this.timer);
  }

  componentWillUnmount() {
    this.clearTimeOuthideControl();
  }

  /// 点击了播放器正中间的播放按钮
  onPressPlayButton() {
    let isPlay = !this.state.isPlaying;
    this.setState({
      isPlaying: isPlay,
      showVideoCover: false
    });
    if (this.state.playFromBeginning) {
      this.videoPlayer.seek(0);
      this.setState({
        playFromBeginning: false,
      })
    }
  }

  /// 点击了工具栏上的播放按钮
  onControlPlayPress() {
    this.onPressPlayButton();
  }

  /// 进度条值改变
  onSliderValueChanged(currentTime) {
    this.videoPlayer.seek(currentTime);
    if (this.state.isPlaying) {
      this.setState({
        currentTime: currentTime
      })
    } else {
      this.setState({
        currentTime: currentTime,
        isPlaying: true,
        showVideoCover: false
      })
    }
  }

  /// -------外部调用事件方法-------

  ///播放视频，提供给外部调用
  playVideo() {
    this.setState({
      isPlaying: true,
      showVideoCover: false
    })
  }

  /// 暂停播放，提供给外部调用
  pauseVideo() {
    this.setState({
      isPlaying: false,
    })
  }

  /// 切换视频并可以指定视频开始播放的时间，提供给外部调用
  switchVideo(videoURL, seekTime) {
    this.setState({
      videoUrl: videoURL,
      currentTime: seekTime,
      isPlaying: true,
      showVideoCover: false
    });
    this.videoPlayer.seek(seekTime);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0'
  },
  playButton: {
    width: 50,
    height: 50,
  },
  playControl: {
    width: 24,
    height: 24,
    marginLeft: 15,
  },
  shrinkControl: {
    width: 15,
    height: 15,
    marginRight: 15,
  },
  time: {
    fontSize: 12,
    color: 'white',
    marginLeft: 10,
    marginRight: 10
  },
  control: {
    flexDirection: 'row',
    height: 44,
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    position: 'absolute',
    bottom: 0,
    left: 0
  },
});