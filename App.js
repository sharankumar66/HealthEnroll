import React from 'react';
import Scan from './Components/Scan';
import EnrollmentForm from './Components/EnrollmentForm';
import Api from './Components/Api';
// import EnrollmentForm from './Components/Api1';
import  Location  from './Components/Loc';
import Login from './Components/Login';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BarcodeScanner from './Components/Camera';
import Test from './Components/QrReader';
import { ScrollView,StyleSheet} from 'react-native';
import Appp from './Components/Add_image';


const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <>
     <ScrollView contentContainerStyle={styles.scrollViewContent}>
    {/* <Scan /> */}
    {/* <EnrollmentForm /> */}
    {/* <Api /> */}
    {/* <EnrollmentForm></EnrollmentForm> */}
    {/* <Location /> */}
    <NavigationContainer>
      <Stack.Navigator initialRouterName="Login">
        <Stack.Screen name='Login' component={Login} />
        <Stack.Screen name='Form' component={Api} />
        <Stack.Screen name='Scan' component={Scan} />
      </Stack.Navigator>
    </NavigationContainer>
    {/* <Login></Login> */}
    {/* <BarcodeScanner/> */}
    {/* <Test/> */}
    
    </ScrollView>
    </>

  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
});
export default App;