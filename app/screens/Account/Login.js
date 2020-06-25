import React, { useRef } from 'react';
import { StyleSheet, View, ScrollView, Text, Image } from 'react-native';
import { Divider } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { scale, verticalScale } from '../../../config/react-native-size';
import LoginForm from '../components/Account/LoginForm';
import Toast from 'react-native-easy-toast';

const Login = () => {
    const toastRef = useRef();

    return ( 
        <ScrollView>
            <Image 
                source={require('../../../assets/img/logo-login.png')}
                resizeMode='contain'
                style={styles.logo}
            />
            <View style={styles.viewContainer}>
                <LoginForm 
                    toastRef={toastRef}
                />
                <CreateAccount />
            </View>
            <Divider 
                style={styles.divider}
            />

            <Toast 
                ref={toastRef} 
                position='center' 
                opacity={0.9} 
                fadeInDuration={500}
                fadeOutDuration={1000}
            />
        </ScrollView>
     );
}

function CreateAccount() {
    const Navigation = useNavigation();
    
    return (
        <Text style={styles.textRegister}>
            ¿Aún no tienes una cuenta?
            <Text 
                style={styles.btnRegistro}
                onPress={() => Navigation.navigate('registro')}
            > Regístrate</Text>
        </Text>
    )
}
 
const styles = StyleSheet.create({
    logo: {
        width: '100%',
        height: verticalScale(150),
        marginTop: scale(20)
    },
    viewContainer: {
        marginHorizontal: scale(40)
    },
    textRegister: {
        marginTop: scale(15),
        marginHorizontal: scale(10),
        textAlign: 'center',
        fontSize: scale(14)
    },
    btnRegistro: {
        color: '#00A680',
        fontWeight: 'bold'
    },
    divider: {
        backgroundColor: '#00A680',
        margin: scale(40)
    }
});

export default Login;