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
  Image,
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
      showCamera: false,
      showPreview: false,
      coordinates: {},
    };
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.showCamera ? (
          this.state.showPreview ? (
            <View style={{flex: 1}}>
              <Image source={{uri: this.state.image}} style={{width, height}} />
              {/* <View
                  style={{
                    position: 'absolute',
                    top: this.state.coordinates.origin.y,
                    left: this.state.coordinates.origin.x,
                    width: this.state.coordinates.size.width,
                    height: this.state.coordinates.size.height,
                    borderColor: 'red',
                    borderWidth: 1,
                  }}
                /> */}
              <TouchableOpacity
                onPress={() => {
                  this.setState({showPreview: false, showCamera: false});
                }}
                style={styles.capture}>
                <Text style={{fontSize: 14}}>Done</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <RNCamera
              style={styles.preview}
              type={RNCamera.Constants.Type.front}
              flashMode={RNCamera.Constants.FlashMode.on}
              mirrorImage={true}
              fixOrientation={true}
              onFacesDetected={(res) => {
                if (res.faces.length === 1) {
                  // console.log(
                  //   res.faces[0].leftEyeOpenProbability,
                  //   res.faces[0].rightEyeOpenProbability,
                  // );
                  if (
                    res.faces[0].leftEyeOpenProbability > 0.3 &&
                    res.faces[0].rightEyeOpenProbability > 0.3
                  ) {
                    this.setState({
                      showCapture: true,
                      coordinates: res.faces[0].bounds,
                    });
                  } else {
                    this.setState({showCapture: false});
                  }
                } else {
                  this.setState({showCapture: false});
                }
              }}
              onFaceDetectionError={(res) => {
                console.log(res);
              }}
              faceDetectionMode={RNCamera.Constants.FaceDetection.Mode.accurate}
              faceDetectionLandmarks={
                RNCamera.Constants.FaceDetection.Landmarks.all
              }
              faceDetectionClassifications={
                RNCamera.Constants.FaceDetection.Classifications.all
              }
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
                    <>
                      <Text style={styles.description}>
                        Below button will be ready to click when your selfie is
                        in the frame
                      </Text>
                      <TouchableOpacity
                        onPress={() => this.takePicture(camera)}
                        style={styles.capture}>
                        <Text style={{fontSize: 14}}> SNAP </Text>
                      </TouchableOpacity>
                    </>
                  )
                );
              }}
            </RNCamera>
          )
        ) : (
          <TouchableOpacity onPress={() => this.setState({showCamera: true})}>
            <Image
              source={
                this.state.image
                  ? {uri: this.state.image}
                  : require('./default_user.png')
              }
              style={styles.userIcon}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  }

  takePicture = async function (camera) {
    const options = {
      quality: 1,
      mirrorImage: true,
      forceUpOrientation: true,
      fixOrientation: true,
      orientation: 'portrait',
    };
    const data = await camera.takePictureAsync(options);
    this.setState({image: data.uri, showPreview: true});
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    margin: 20,
    alignSelf: 'center',
    position: 'absolute',
    bottom: 40,
  },
  userIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
  },
  description: {
    color: 'white',
    width: '80%',
    textAlign: 'center',
    position: 'absolute',
    bottom: 140,
  },
});

export default App;
