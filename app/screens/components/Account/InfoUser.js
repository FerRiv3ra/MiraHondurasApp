import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Avatar } from 'react-native-elements';
import { scale, moderateScale } from '../../../../config/react-native-size';
import * as firebase from 'firebase';
import * as permissions from 'expo-permissions';
import * as imagePicker from 'expo-image-picker';

const InfoUser = ({userInfo, toastRef, setLoadingText, setLoading}) => {
    const { photoURL, displayName, email, uid } = userInfo;

    const changeAvatar = async () => {
        const resultPermissions = await permissions.askAsync(permissions.CAMERA_ROLL);
        const resultPermissionsCamera = resultPermissions.permissions.cameraRoll.status;

        if(resultPermissionsCamera === 'denied'){
            toastRef.current.show('Es necesario aceptar los permisos de la galeria');
        }else{
            const result = await imagePicker.launchImageLibraryAsync({
                allowsEditing: true,
                aspect: [4, 3]
            });

            if(result.cancelled){
                toastRef.current.show('Selección de imagen cancelada');
            }else{
                subirImagen(result.uri).then(() => {
                    actualizarPhotoUrl();
                }).catch(() => {
                    toastRef.current.show('Error al subir la imagen, vuelve a intentarlo');
                })
            }
        }
    };

    const subirImagen =async (uri) => {
        setLoadingText('Actualizando imagen');
        setLoading(true);

        const respuesta = await fetch(uri);
        const blob = await respuesta.blob();

        const ref = firebase.storage().ref().child(`avatar/${uid}`);
        return ref.put(blob);
    }

    const actualizarPhotoUrl = () => {
        firebase
            .storage()
            .ref(`avatar/${uid}`)
            .getDownloadURL()
            .then(async (response) => {
                const update = {
                    photoURL: response
                };
                await firebase.auth().currentUser.updateProfile(update);
                setLoading(false);
            })
            .catch(() => {
                toastRef.current.show('Error al subir la imagen, vuelve a intentarlo');
            })
    }

    return ( 
        <View style={styles.viewUserInfo}>
            <Avatar 
                rounded
                size='large'
                showAccessory
                onPress={changeAvatar}
                containerStyle={styles.userInfoAvatar}
                source={photoURL ? { uri: photoURL} : require('../../../../assets/img/avatar-default.jpg')}
            />
            <View>
                <Text style={styles.displayName}>{displayName ? displayName : 'Anónimo'} </Text>
                <Text>{email ? email : 'Social login'}</Text>
            </View>
        </View>
     );
}

const styles = StyleSheet.create({
    viewUserInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F2F2F2',
        paddingVertical: moderateScale(30)
    },
    userInfoAvatar: {
        marginRight: scale(20)
    },
    displayName: {
        fontWeight: 'bold',
        paddingBottom: moderateScale(5)
    }
});
 
export default InfoUser;