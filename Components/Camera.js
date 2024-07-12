import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { RNCamera } from 'react-native-camera';

const BarcodeScanner = () => {
  const cameraRef = useRef(null);
  const [scanned, setScanned] = useState(false);

  const onBarCodeRead = (e) => {
    if (!scanned) {
      setScanned(true);
      Alert.alert(`Barcode value is ${e.data}`, `Type is ${e.type}`);
      setTimeout(() => setScanned(false), 2000); // Reset after 2 seconds
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      const options = { quality: 0.5, base64: true };
      const data = await cameraRef.current.takePictureAsync(options);
      console.log(data.uri);
      Alert.alert('Picture taken!', data.uri);
    }
  };

  return (
    <View style={styles.container}>
      <RNCamera
        ref={cameraRef}
        style={styles.preview}
        type={RNCamera.Constants.Type.back}
        // flashMode={RNCamera.Constants.FlashMode.on}
        onBarCodeRead={onBarCodeRead}
        autoFocus={RNCamera.Constants.AutoFocus.on}
        captureAudio={false}
      >
        <View style={styles.focusBox} />
        <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
          <Text style={styles.captureButtonText}>CAPTURE</Text>
        </TouchableOpacity>
      </RNCamera>
    </View>
  );
};

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
  focusBox: {
    flex: 1,
    borderColor: 'white',
    borderWidth: 2,
    width: 250,
    height: 250,
    alignSelf: 'center',
    marginVertical: 'auto',
  },
  captureButton: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
  captureButtonText: {
    fontSize: 14,
    color: '#000',
  },
});

export default BarcodeScanner;
