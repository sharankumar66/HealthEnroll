import React, { useState } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
    TextInput,
    TouchableOpacity,
    Image,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Login() {
    const navigation = useNavigation();

    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    const onPressLogin = () => {
        navigation.navigate('Form');
    };
    const onPressForgotPassword = () => {
        // Do something about forgot password operation
    };
    const onPressSignUp = () => {
        // Do something about signup operation
    };
    const [state, setState] = useState({
        number: '9986700691',
        password: '****',
    });

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.container}>
                    <View>
                        <Image source={require('../images/smalllogo.jpg')} style={styles.image} />
                    </View>
                    <View style={styles.shadowBox}>
                        <Text style={styles.title}>Welcome</Text>
                        <View style={styles.inputView}>
                            <TextInput
                                style={styles.inputText}
                                placeholder="9986700691"
                                placeholderTextColor="#003f5c"
                                onChangeText={text => setState({ ...state, number: text })}
                            />
                        </View>
                        <View style={styles.inputView}>
                            <TextInput
                                style={styles.inputText}
                                secureTextEntry
                                placeholder="****"
                                placeholderTextColor="#003f5c"
                                onChangeText={text => setState({ ...state, password: text })}
                            />
                        </View>
                        <TouchableOpacity
                            onPress={onPressLogin}
                            style={styles.loginBtn}>
                            <Text style={styles.loginText}>LOGIN</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    scrollViewContent: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    image: {
        width: 159,
        height: 65,
        marginBottom: 40,
    },
    title: {
        fontWeight: "bold",
        fontSize: 50,
        color: "black",
        marginBottom: 40,
    },
    shadowBox: {
        width: '80%',
        height: '50%',
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 10,
        borderRadius: 10 // Elevation for Android and iOS
    },
    inputView: {
        width: "80%",
        backgroundColor: "#D0D3D4",
        borderRadius: 10,
        height: 50,
        marginBottom: 20,
        justifyContent: "center",
        padding: 20,
        borderBlockColor: "black",
    },
    inputText: {
        height: 50,
        color: "black",
    },
    forgotAndSignUpText: {
        color: "white",
        fontSize: 11
    },
    loginBtn: {
        width: "80%",
        backgroundColor: "#007da5",
        borderRadius: 25,
        height: 50,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 40,
        marginBottom: 10
    },
    loginText: {
        fontWeight: "bold",
    }
});
