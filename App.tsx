// import { PermissionsAndroid, Platform } from 'react-native';
// import React from 'react';
// import { View, Text } from 'react-native';
// import QRCodeScanner from 'react-native-qrcode-scanner';
// import Scan from './Components/Scan';

// async function requestCameraPermission() {
//   if (Platform.OS === 'android') {
//     try {
//       const granted = await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.CAMERA,
//         {
//           title: "Camera Permission",
//           message: "App needs access to your camera ",
//           buttonNeutral: "Ask Me Later",
//           buttonNegative: "Cancel",
//           buttonPositive: "OK"
//         }
//       );
//       if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//         console.log("You can use the camera");
//       } else {
//         console.log("Camera permission denied");
//       }
//     } catch (err) {
//       console.warn(err);
//     }
//   }
// }

// requestCameraPermission();
// const App = () => {
//   // const onSuccess = (e) => {
//   //   console.log(e.data); // handle the scanned QR code
//   // };

//   return (<>
//     {/* <QRCodeScanner
//       onRead={onSuccess}
//       topContent={
//         <Text style={{ fontSize: 18 }}>
//           Scan the QR code.
//         </Text>
//       }
//       bottomContent={
//         <View style={{ marginTop: 20 }}>
//           <Text style={{ fontSize: 18 }}>
//             Place the camera over the QR code to scan.
//           </Text>
//         </View>
//       }
//     /> */}
//     <Scan></Scan></>
//   );
// };

// export default App;