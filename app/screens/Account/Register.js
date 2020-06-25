import React, { useRef } from 'react';
import { StyleSheet, View, Text, Image } from 'react-native';
import { scale, verticalScale } from '../../../config/react-native-size';
import RegistroForm from '../components/Account/RegistroForm';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-easy-toast';

const Register = () => {
    const toastRef = useRef();

    return ( 
        <KeyboardAwareScrollView>
            <Image 
                source={require('../../../assets/img/logo-login.png')}
                resizeMode='contain'
                style={styles.logo}
            />
            <View style={styles.viewForm}>
                <RegistroForm 
                    toastRef={toastRef}
                />
            </View>
            <Toast 
                ref={toastRef} 
                position='center' 
                opacity={0.9} 
                fadeInDuration={500}
                fadeOutDuration={1000}
            />
        </KeyboardAwareScrollView>    
     );
}

const styles = StyleSheet.create({
    logo: {
        width: '100%',
        height: verticalScale(150),
        marginTop: scale(20)
    },
    viewForm: {
        marginHorizontal: verticalScale(40)
    }
});
 
export default Register;