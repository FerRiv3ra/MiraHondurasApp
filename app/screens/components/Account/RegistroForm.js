import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { scale } from '../../../../config/react-native-size';
import { Input, Icon, Button } from 'react-native-elements';
import { validarEmail } from '../../../utils/validations';
import * as firebase from 'firebase';
import { useNavigation } from '@react-navigation/native';
import Loading from '../Loading';

const RegistroForm = ({toastRef}) => {
    const navigation = useNavigation();

    const [mostrarPass, setMostrarPass] = useState(false);
    const [mostrarConfirm, setMostrarConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPass: ''
    });

    const onChange = (e, type) => {
        setFormData({... formData, [type]: e.nativeEvent.text.trim()});
    }

    const onSubmit = () => {
        const { email, password, confirmPass } = formData;
        
        if(email.trim() === '' || password.trim() === '' || confirmPass.trim() === ''){
            toastRef.current.show('Todos los campos son obligatorios');
            return;
        } 

        const valido = validarEmail(email);
        if(!valido){
            toastRef.current.show('Ingresa un correo válido');
            return;  
        } 

        if(password !== confirmPass){
            toastRef.current.show('Las cosntraseñas no son iguales');
            return;
        }
        
        if(password.length < 6){
            toastRef.current.show('La contraseña debe de ser al menos de 6 caráteres')
            return;
        }

        setLoading(true);
        firebase
            .auth()
            .createUserWithEmailAndPassword(email, password)
            .then(() => {
                setLoading(false);
                navigation.navigate('account');
            })
            .catch(() => {
                setLoading(false);
                toastRef.current.show('El correo ya esta registrado');
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
                rightIcon={
                    <Icon 
                        type='material-community'
                        name={mostrarPass ? 'eye-off-outline' : 'eye-outline'}
                        iconStyle={styles.iconRight}
                        onPress={() => setMostrarPass(!mostrarPass)}
                    />
                }
                leftIcon={
                    <Icon 
                        type='material-community'
                        name='lock'
                        iconStyle={styles.iconRight}
                    />
                }
                onChange={(e) => onChange(e, 'password')}
            />
            <Input 
                placeholder='Repetir contraseña'
                containerStyle={styles.inputForm}
                password={true}
                secureTextEntry={mostrarConfirm ? false : true}
                rightIcon={
                    <Icon 
                        type='material-community'
                        name={mostrarConfirm ? 'eye-off-outline' : 'eye-outline'}
                        iconStyle={styles.iconRight}
                        onPress={() => setMostrarConfirm(!mostrarConfirm)}
                    />
                }
                leftIcon={
                    <Icon 
                        type='material-community'
                        name='lock'
                        iconStyle={styles.iconRight}
                    />
                }
                onChange={(e) => onChange(e, 'confirmPass')}
            />
            <Button
                title='Crear cuenta'
                containerStyle={styles.btnRegistro}
                buttonStyle={styles.btnRegister}
                onPress={() => onSubmit()}
            />
            <Loading 
                isVisible={loading}
                text='Creando cuenta'
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
    btnRegistro: {
        marginTop: scale(20),
        width: '95%'
    },
    btnRegister: {
        backgroundColor: '#00A680'
    },
    iconRight: {
        color: '#C1C1C1'
    }
})
 
export default RegistroForm;