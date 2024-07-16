import React, { Fragment, Component } from 'react';
import { ImagePicker, launchCamera, launchImageLibrary, showImagePicker } from 'react-native-image-picker';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  Image,
  TouchableOpacity,
  Dimensions,
  Platform,
  PermissionsAndroid,
  Alert,
} from 'react-native';

const options = {
  title: 'Select Avatar',
  customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
  storageOptions: {
    skipBackup: true,
    path: 'images',
  },
};

class UploadImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      uploading: false,
    };
  }

  async componentDidMount() {
    if (Platform.OS === 'android') {
      await this.requestCameraPermission();
      await this.requestExternalStoragePermission();
    }
  }

  requestCameraPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: 'Camera Permission',
          message: 'App needs camera permission',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Camera permission granted');
      } else {
        console.log('Camera permission denied');
        Alert.alert('Camera permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  requestExternalStoragePermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'External Storage Write Permission',
          message: 'App needs write permission',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Write external storage permission granted');
      } else {
        console.log('Write external storage permission denied');
        Alert.alert('External storage permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  };

  handleImageResponse = (response) => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
      Alert.alert('ImagePicker Error', response.error);
    } else {
      if (this.state.images.length < 2) {
        const newImages = [...this.state.images, response];
        this.setState({
          images: newImages,
          uploading: true,
        });

        this.uploadImagesToServer(newImages);
      } else {
        Alert.alert('You can only select 2 images');
      }
    }
  };

  showImagePicker = () => {
    if (this.state.images.length < 2) {
      showImagePicker(options, this.handleImageResponse);
    } else {
      Alert.alert('You can only select 2 images');
    }
  };

  launchCamera = () => {
    if (this.state.images.length < 2) {
      launchCamera(options, this.handleImageResponse);
    } else {
      Alert.alert('You can only select 2 images');
    }
  };

  launchImageLibrary = () => {
    if (this.state.images.length < 2) {
      launchImageLibrary(options, this.handleImageResponse);
    } else {
      Alert.alert('You can only select 2 images');
    }
  };

  uploadImagesToServer = async (images) => {
    const data = new FormData();
    images.forEach((image, index) => {
      data.append(`photo${index + 1}`, {
        uri: image.uri,
        type: image.type || 'image/jpeg', // default to image/jpeg if type is null
        name: image.fileName || `image${index + 1}.jpg`, // default to image.jpg if fileName is null
      });
    });

    try {
      const response = await fetch('https://example.com/upload-images', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: data,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const json = await response.json();
      console.log('Upload response:', json);

      // After successful upload, update state to stop uploading
      this.setState({ uploading: false });
    } catch (error) {
      console.error('Error uploading images:', error);
      Alert.alert('Error uploading images', error.message);
      this.setState({ uploading: false });
    }
  };

  removeImage = (index) => {
    const images = [...this.state.images];
    images.splice(index, 1);
    this.setState({ images });
  };

  renderImages() {
    return this.state.images.map((image, index) => (
      <View key={index} style={styles.imageContainer}>
        <Image source={{ uri: image.uri }} style={styles.images} />
        <TouchableOpacity style={styles.removeIcon} onPress={() => this.removeImage(index)}>
          <Text style={styles.removeIconText}>X</Text>
        </TouchableOpacity>
      </View>
    ));
  }

  render() {
    const { uploading } = this.state;

    if (uploading) {
      return (
        <View style={styles.body}>
          <Text style={{ textAlign: 'center', fontSize: 20, paddingBottom: 10 }}>Uploading Images...</Text>
          {/* You can add a spinner or progress indicator here */}
        </View>
      );
    }

    return (
      <Fragment>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <View style={styles.body}>
            <Text style={styles.headerText}>Pick Images from {"\n"}Camera / Gallery</Text>
            <View style={styles.ImageSections}>
              {this.renderImages()}
            </View>

            <View style={styles.btnParentSection}>
              <TouchableOpacity onPress={this.launchCamera} style={styles.btnSection}>
                <Text style={styles.btnText}>Take Picture</Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={this.launchImageLibrary} style={styles.btnSection}>
                <Text style={styles.btnText}>Upload from Device</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  body: {
    backgroundColor: '#f9f9f9',
    justifyContent: 'center',
    borderColor: '#e0e0e0',
    borderWidth: 1,
    padding: 20,
  },
  headerText: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    paddingBottom: 20,
  },
  ImageSections: {
    flexDirection: 'row',
    padding: 8,
    justifyContent: 'center',
  },
  images: {
    width: 150,
    height: 150,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    marginHorizontal: 5,
  },
  imageContainer: {
    position: 'relative',
  },
  removeIcon: {
    position: 'absolute',
    top: 5,
    right: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeIconText: {
    color: '#fff',
    fontSize: 18,
  },
  btnParentSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  btnSection: {
    width: 250,
    height: 50,
    backgroundColor: '#007da5',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    marginBottom: 15,
  },
  btnText: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default UploadImage;
