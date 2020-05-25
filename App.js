/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {PureComponent} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  ImageBackground,
} from 'react-native';
import {RNCamera} from 'react-native-camera';

const {height, width} = Dimensions.get('window');

const PendingView = () => <View />;

class App extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      showCapture: false,
      coordinates: {},
    };
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.image ? (
          <View style={{flex: 1}}>
            <ImageBackground
              source={{uri: this.state.image}}
              style={{flex: 1, width}}>
              <View
                style={{
                  position: 'absolute',
                  top: this.state.coordinates.origin.y,
                  left: this.state.coordinates.origin.x,
                  width: this.state.coordinates.size.width,
                  height: this.state.coordinates.size.height,
                  borderColor: 'red',
                  borderWidth: 1,
                }}
              />
              <TouchableOpacity
                onPress={() => {
                  this.setState({image: null});
                }}
                style={styles.capture}>
                <Text style={{fontSize: 14}}> Go back </Text>
              </TouchableOpacity>
            </ImageBackground>
          </View>
        ) : (
          <RNCamera
            style={styles.preview}
            type={RNCamera.Constants.Type.front}
            flashMode={RNCamera.Constants.FlashMode.on}
            onFacesDetected={(res) => {
              if (res.faces.length > 0) {
                this.setState({
                  showCapture: true,
                  coordinates: res.faces[0].bounds,
                });
              } else {
                this.setState({showCapture: false});
              }
            }}
            onFaceDetectionError={(res) => {
              console.log(res);
            }}
            faceDetectionMode={RNCamera.Constants.FaceDetection.Mode.accurate}
            androidCameraPermissionOptions={{
              title: 'Permission to use camera',
              message: 'We need your permission to use your camera',
              buttonPositive: 'Ok',
              buttonNegative: 'Cancel',
            }}
            androidRecordAudioPermissionOptions={{
              title: 'Permission to use audio recording',
              message: 'We need your permission to use your audio',
              buttonPositive: 'Ok',
              buttonNegative: 'Cancel',
            }}>
            {({camera, status, recordAudioPermissionStatus}) => {
              if (status !== 'READY') {
                return <PendingView />;
              }
              return (
                this.state.showCapture && (
                  <TouchableOpacity
                    onPress={() => this.takePicture(camera)}
                    style={styles.capture}>
                    <Text style={{fontSize: 14}}> SNAP </Text>
                  </TouchableOpacity>
                )
              );
            }}
          </RNCamera>
        )}
      </View>
    );
  }

  takePicture = async function (camera) {
    const options = {quality: 1};
    const data = await camera.takePictureAsync(options);
    this.setState({image: data.uri});
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});

export default App;
