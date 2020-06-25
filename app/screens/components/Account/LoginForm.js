import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { scale } from '../../../../config/react-native-size';
import { Input, Icon, Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { validarEmail } from '../../../utils/validations';
import * as firebase from 'firebase';
import Loading from '../Loading';

const LoginForm = ({toastRef}) => {
    const Navigation = useNavigation();

    const [mostrarPass, setMostrarPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const onChange = (e, type) => {
        setFormData({... formData, [type]: e.nativeEvent.text.trim()});
    }

    const onSubmit = () => {
        
        const { email, password } = formData;
        if(email.trim() === '' || password.trim() === ''){
            toastRef.current.show('Todos los campos son obligatorios');
            return;
        } 
        const valido = validarEmail(email);
        if(!valido){
            toastRef.current.show('Ingresa un correo válido');
            return;  
        } 
        
        if(password.length < 6){
            toastRef.current.show('La contraseña debe de ser al menos de 6 caráteres')
            return;
        }

        setLoading(true);
        firebase
            .auth()
            .signInWithEmailAndPassword(email, password)
            .then(() => {
                setLoading(false);

                Navigation.navigate('account');
            })
            .catch(() => {
                setLoading(false);
                toastRef.current.show('Error al iniciar sesión, vuelve a intentar');
            })
    }

    return ( 
        <View style={styles.formContainer}>
            <Input 
                placeholder='Correo electrónico'
                containerStyle={styles.inputForm}
                leftIcon={
                    <Icon 
                        type='material-community'
                        name='email'
                        iconStyle={styles.iconRight}
                    />
                }
                onChange={(e) => onChange(e, 'email')}
            />
            <Input 
                placeholder='Contraseña'
                containerStyle={styles.inputForm}
                password={true}
                secureTextEntry={mostrarPass ? false : true}
                leftIcon={
                    <Icon 
                        type='material-community'
                        name='lock'
                        iconStyle={styles.iconRight}
                    />
                }
                rightIcon={
                    <Icon 
                        type='material-community'
                        name={mostrarPass ? 'eye-off-outline' : 'eye-outline'}
                        iconStyle={styles.iconRight}
                        onPress={() => setMostrarPass(!mostrarPass)}
                    />
                }
                onChange={(e) => onChange(e, 'password')}
            />
            <Button 
                title='Inciar sesión'
                containerStyle={styles.btnContainerLogin}
                buttonStyle={styles.btnLogin}
                onPress={() => onSubmit()}
            />
            <Loading 
                isVisible={loading}
                text='Inciando sesión'
            />
        </View>
     );
}

const styles = StyleSheet.create({
    formContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: scale(30)
    },
    inputForm: {
        width: '100%',
        marginTop: scale(10)
    },
    iconRight: {
        color: '#C1C1C1'
    },
    btnContainerLogin: {
        marginTop: scale(10),
        width: '95%'
    },
    btnLogin: {
        backgroundColor: '#00A680'
    }
});
 
export default LoginForm;