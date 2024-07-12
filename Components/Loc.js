import React, { useEffect, useState } from 'react';
import { View, Text, PermissionsAndroid, Platform, StyleSheet } from 'react-native';
import GetLocation from 'react-native-get-location';

const App = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('You can use the location');
          getLocation();
        } else {
          console.log('Location permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    } else {
      getLocation();
    }
  };

  const getLocation = () => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
    .then(location => {
      setLocation(location);
      setError(null);
    })
    .catch(error => {
      // setError(error.message);
      setLocation(null);
    });
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  return (
    <View style={styles.container}>
      {location && (
        <Text style={styles.locationText}>
          Latitude: {location.latitude}, Longitude: {location.longitude}
        </Text>
      )}
      {error && <Text style={styles.errorText}>Error: {error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  locationText: {
    fontSize: 16,
  },
  errorText: {
    marginTop: 20,
    fontSize: 16,
    color: 'red',
  },
});

export default App;
