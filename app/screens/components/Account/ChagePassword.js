import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Input, Button } from 'react-native-elements';
import { moderateScale, scale } from '../../../../config/react-native-size';
import { reautenticar } from '../../../utils/api';
import * as firebase from 'firebase';

const ChangePassword = ({setShowModal}) => {
    const [showPass, setShowPass] = useState(false);
    const [showNPass, setShowNPass] = useState(false);
    const [showCPass, setShowCPass] = useState(false);
    const [formData, setFormData] = useState({
        password: '',
        newPassword: '',
        repeatNewPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const onChange = (e, type) => {
        setFormData({
            ...formData, [type] : e.nativeEvent.text
        })
    }

    const onSubmit = async () => {
        let errorTemp = {};
        setErrors({});
        const { password, newPassword, repeatNewPassword } = formData;
        if(!password || !newPassword || !repeatNewPassword){
            errorTemp = {
                password: !password ? 'La contraseña no puede estar vacía.' : '',
                newPassword: !newPassword ? 'La nueva contraseña no puede estar vacía.' : '',
                repeatNewPassword: !repeatNewPassword ? 'Repetir nueva contraseña no puede estar vacía.' : '',
            }
            setErrors(errorTemp);
            return;
        }

        if(newPassword !== repeatNewPassword){
            errorTemp = {
                newPassword: 'Las contraseñas no coinciden',
                repeatNewPassword: 'Las contraseñas no coinciden',
            }
            setErrors(errorTemp);
            return;
        }

        if(newPassword.length < 6){
            errorTemp = {
                newPassword: 'La contraseña debe ser mayor a 5 caracteres.',
                repeatNewPassword: 'La contraseña debe ser mayor a 5 caracteres.',
            }
            setErrors(errorTemp);
            return;
        }

        setIsLoading(true);
        await reautenticar(password).then(async () => {
             await firebase
                .auth()
                .currentUser.updatePassword(newPassword).then(() => {
                    setIsLoading(false);
                    setShowModal(false);
                    firebase.auth().signOut();
                    return;
                })
                .catch(() => {
                    setIsLoading(false);
                })
        })
        .catch(() => {
            errorTemp = {
                password: 'La contraseña actual no es correcta',
            }
            setErrors(errorTemp);
            setIsLoading(false);
        })
        
    }

    return ( 
        <View style={StyleSheet.view}>
            <Input 
                placeholder='Contraseña actual'
                containerStyle={styles.input}
                password={true}
                secureTextEntry={showPass ? false : true}
                rightIcon={{
                    type: 'material-community',
                    name: showPass ? 'eye-off-outline' : 'eye-outline',
                    color: '#C1C1C1',
                    onPress: () => setShowPass(!showPass)
                }}
                leftIcon={{
                    type: 'material-community',
                    name: 'lock',
                    color: '#C1C1C1'
                }}
                onChange={e => onChange(e, 'password')}
                errorMessage={errors.password}
            />
            <Input 
                placeholder='Nueva contraseña'
                containerStyle={styles.input}
                password={true}
                secureTextEntry={showNPass ? false : true}
                rightIcon={{
                    type: 'material-community',
                    name: showNPass ? 'eye-off-outline' : 'eye-outline',
                    color: '#C1C1C1',
                    onPress: () => setShowNPass(!showNPass)
                }}
                leftIcon={{
                    type: 'material-community',
                    name: 'lock-reset',
                    color: '#C1C1C1'
                }}
                onChange={e => onChange(e, 'newPassword')}
                errorMessage={errors.newPassword}
            />
            <Input 
                placeholder='Repetir nueva contraseña'
                containerStyle={styles.input}
                password={true}
                secureTextEntry={showCPass ? false : true}
                rightIcon={{
                    type: 'material-community',
                    name: showCPass ? 'eye-off-outline' : 'eye-outline',
                    color: '#C1C1C1',
                    onPress: () => setShowCPass(!showCPass)
                }}
                leftIcon={{
                    type: 'material-community',
                    name: 'lock-reset',
                    color: '#C1C1C1'
                }}
                onChange={e => onChange(e, 'repeatNewPassword')}
                errorMessage={errors.repeatNewPassword}
            />
            <Button 
                title='Cambiar contraseña'
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress={onSubmit}
                loading={isLoading}
            />
        </View>
     );
}

const styles = StyleSheet.create({
    view: {
        alignItems: 'center',
        paddingVertical: moderateScale(10),
    },
    input: {
        marginBottom: scale(10)
    },
    btnContainer: {
        alignSelf: 'center',
        width: '95%',
        marginVertical: scale(10)
    },
    btn: {
        backgroundColor: '#00A680'
    },
});
 
export default ChangePassword;