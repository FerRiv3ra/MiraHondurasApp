import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native'
import { Input, Button } from 'react-native-elements';
import { scale, moderateScale } from '../../../../config/react-native-size';
import * as firebase from 'firebase';

const CambiarDisplayName = ({ displayName, setShowModal, setReloadUser }) => {
    const [newDisplayName, setNewDisplayName] = useState(displayName);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = () => {
        setError(null);
        if(!newDisplayName){
            setError('El nombre no puede estar vacío');
            return;
        }

        if(displayName === newDisplayName){
            setError('El nombre no puede ser igual al actual');
            return;
        }

        const update = {
            displayName: newDisplayName
        };
        setIsLoading(true);
        firebase
            .auth()
            .currentUser.updateProfile(update)
            .then(() => {
                setIsLoading(false);
                setReloadUser(true);
                setShowModal(false);
            })
            .catch(() => {
                setError('Hubo un error al actualizar el nombre');
                setIsLoading(false);
            })
    }

    return ( 
        <View style={styles.view}>
            <Input 
                placeholder='Nombre y apellidos'
                containerStyle={styles.input}
                leftIcon={{
                    type: 'material-community',
                    name: 'account-circle-outline',
                    color: '#C2C2C2'
                }}
                defaultValue={displayName || ''}
                onChange={e => setNewDisplayName(e.nativeEvent.text.trim())}
                errorMessage={error}
            />
            <Button 
               title='Cambiar nombre'
               containerStyle={styles.container}
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
        paddingHorizontal: moderateScale(10)
    },
    input:{
        marginBottom: scale(10)
    },
    container: {
        marginTop: scale(5),
        marginBottom: scale(10),
        width: '95%'
    },
    btn: {
        backgroundColor: '#00A680'
    }
});
 
export default CambiarDisplayName;