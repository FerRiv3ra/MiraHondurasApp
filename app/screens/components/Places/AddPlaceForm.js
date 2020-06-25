import React, { useState, useEffect } from 'react';
import { StyleSheet, View, ScrollView, Alert, Dimensions, Picker } from 'react-native';
import { Icon, Image, Avatar, Button, Input, Text } from 'react-native-elements';
import { scale, verticalScale } from '../../../../config/react-native-size';
import { map }  from 'lodash';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import MapView from 'react-native-maps';
import uuid from 'random-uuid-v4';
import Modal from '../Modal';

import { firebaseApp } from '../../../utils/firebase';
import firebase from 'firebase/app';
import 'firebase/storage';
import 'firebase/firestore';
const db = firebase.firestore(firebaseApp);

const widthScreen = Dimensions.get('window').width;

const AddPlaceForm = ({toastRef, setIsLoading, navigation}) => {
    const [categoria, setCategoria] = useState('rest');
    const [namePlace, setNamePlace] = useState('');
    const [direccion, setDireccion] = useState('');
    const [descrip, setDescrip] = useState('');
    const [departamento, setDepartamento] = useState('atl');
    const [imageSelected, setImageSelected] = useState([]);
    const [isVisibleMap, setIsVisibleMap] = useState(false);
    const [locationPlace, setLocationPlace] = useState(null);

    const addPlace = () => {
        if(namePlace.trim() === '' || direccion.trim() === '' || descrip.trim() === ''){
            toastRef.current.show('Todos los campos son obligatorios', 1500);
            return;
        }

        if(imageSelected.length === 0){
            toastRef.current.show('Debes subir por lo menos una imagen');
            return;
        }

        if(!locationPlace){
            toastRef.current.show('Aun no has seleccionado una ubicación');
            return
        }

        setIsLoading(true);
        subirImagenesFS().then((response) => {          
            db.collection('places')
                .add({
                    name: namePlace,
                    direccion: direccion,
                    departamento: departamento,
                    categoria: categoria,
                    description: descrip,
                    location: locationPlace,
                    images: response,
                    rating: 0,
                    ratingTotal: 0,
                    votos: 0,
                    create: new Date(),
                    createBy: firebase.auth().currentUser.uid
                }).then(() => {
                    setIsLoading(false);
                    navigation.navigate('places');
                }).catch(() => {
                    setIsLoading(false);
                    toastRef.current.show('Error al subir el lugar, vuelve a intentarlo');
                })
        })
    }

    const subirImagenesFS = async () => {
        const imageBlob = [];

        await Promise.all(
            map(imageSelected, async (image) => {
                const response = await fetch(image);
                const blob = await response.blob();
                const ref = firebase.storage().ref('places').child(uuid());
                await ref.put(blob).then(async (result) => {
                    await firebase
                        .storage()
                        .ref(`places/${result.metadata.name}`)
                        .getDownloadURL()
                        .then((photoUrl) => {
                            imageBlob.push(photoUrl);
                        })
                        .catch((error) => {
                            toastRef.current.show('Error al subir las imágenes, vuelve a intentarlo', 1500);
                            setIsLoading(false);
                            throw error;
                        });
                });
            })
        );

        return imageBlob;
    };

    return ( 
        <ScrollView style={styles.scrollView}>
            <ImagePlace imgPlace={imageSelected[0]} />
            <FormAdd 
                categoria={categoria}
                departamento={departamento}
                locationPlace={locationPlace}
                setDepartamento={setDepartamento}
                setCategoria={setCategoria}
                setNamePlace={setNamePlace}
                setDireccion={setDireccion}
                setDescrip={setDescrip}
                addPlace={addPlace}
                setIsVisibleMap={setIsVisibleMap}
            />
            <SubirImagen 
                toastRef={toastRef}
                setImageSelected={setImageSelected}
                imageSelected={imageSelected}
            />
            <Button 
                title='Agregar lugar'
                onPress={addPlace}
                buttonStyle={styles.btnAdd}
            />
            <Map                
                isVisibleMap={isVisibleMap}
                setIsVisibleMap={setIsVisibleMap}
                setLocationPlace={setLocationPlace}
                toastRef={toastRef}
            />
        </ScrollView>
     );
}

function ImagePlace({imgPlace}){
    return(
        <View style={styles.viewFoto}>
            <Image 
                source={imgPlace ? {uri: imgPlace} : require('../../../../assets/img/no-image.png')}
                style={{width: widthScreen, height: verticalScale(200)}}
            />
        </View>
    )
}

function FormAdd(props){
    const {
        categoria, 
        setCategoria, 
        setNamePlace, 
        setDireccion, 
        setDescrip, 
        departamento, 
        setDepartamento, 
        setIsVisibleMap,
        locationPlace
    } = props;
    return(
        <View style={styles.viewForm}>
            <Input 
                placeholder='Nombre del lugar'
                containerStyle={styles.Input}
                onChange={e => setNamePlace(e.nativeEvent.text)}
            />
            <Input 
                placeholder='Dirección'
                containerStyle={styles.Input}
                onChange={e => setDireccion(e.nativeEvent.text)}
                rightIcon={{
                    type: 'material-community',
                    name: 'google-maps',
                    color: locationPlace ? '#00A680' : '#C2C2C2',
                    onPress: () => setIsVisibleMap(true)
                }}
            />
            <Text style={{textAlign: 'center', fontWeight: 'bold'}}>Seleccione departamento</Text>
            <Picker
                onValueChange={ departamento => setDepartamento(departamento) }
                selectedValue={departamento}
                itemStyle={{height: 120}}
            >
                <Picker.Item label='Atlántida' value='atl' />
                <Picker.Item label="Choluteca" value="cho" />
                <Picker.Item label="Colón" value="col" />
                <Picker.Item label="Comayagua" value="com" />
                <Picker.Item label="Copán" value="cop" />
                <Picker.Item label="Cortés" value="cor" />
                <Picker.Item label="El Paraíso" value="epa" />
                <Picker.Item label="Francisco Morazán" value="fco" />
                <Picker.Item label="Gracias a Dios" value="gdi" />
                <Picker.Item label="Intibucá" value="int" />
                <Picker.Item label="Islas de la Bahía" value="iba" />
                <Picker.Item label="La Paz" value="lpa" />
                <Picker.Item label="Lempira" value="lem" />
                <Picker.Item label="Ocotepeque" value="oco" />
                <Picker.Item label="Olancho" value="ola" />
                <Picker.Item label="Santa Bárbara" value="sba" />
                <Picker.Item label="Valle" value="val" />
                <Picker.Item label="Yoro" value="yor" />
            </Picker>
            <Text style={{textAlign: 'center', fontWeight: 'bold'}}>Seleccione categoría</Text>
            <Picker
                onValueChange={ categoria => setCategoria(categoria) }
                selectedValue={categoria}
                itemStyle={{height: 120}}
            >
                <Picker.Item label="Restaurante" value="rest" />
                <Picker.Item label="Turístico" value="turist" />
                <Picker.Item label="Hotel" value="hotel" />
            </Picker>
            <Input 
                placeholder='Descripción'
                multiline={true}
                inputContainerStyle={styles.textArea}
                onChange={e => setDescrip(e.nativeEvent.text)}
            />
        </View>
    )
}

function Map({isVisibleMap, setIsVisibleMap, setLocationPlace, toastRef}){
    const [location, setLocation] = useState(null);
    useEffect(() => {
        (async () => {
            const resultPermissions = await Permissions.askAsync(
                Permissions.LOCATION
            );
            const statusPermissions = resultPermissions.permissions.location.status;

            if(statusPermissions !== 'granted'){
                toastRef.current.show('Tienes que aceptar los permisos de localización.', 3000);
                return;
            }

            const loc = await Location.getCurrentPositionAsync({});
            setLocation({
                latitude: loc.coords.latitude,
                longitude: loc.coords.longitude,
                latitudeDelta: 0.001,
                longitudeDelta: 0.001
            });
        })()
    }, []);

    const confirmLocation = () => {
        setLocationPlace(location);
        toastRef.current.show('Localización guardada correctamente');
        setIsVisibleMap(false);
    }

    return(
        <Modal isVisible={isVisibleMap} setIsVisible={setIsVisibleMap}>
            <View>
                {location && (
                    <MapView
                        style={styles.mapStyle}
                        initialRegion={location}
                        showsUserLocation={true}
                        onRegionChange={(region) => setLocation(region)}
                    >
                        <MapView.Marker
                           coordinate={{
                               latitude: location.latitude,
                               longitude: location.longitude
                           }} 
                           draggable
                        />
                    </MapView>
                )}
                <View style={styles.viewMapBtn}>
                    <Button 
                        title='Guardar ubicación'
                        containerStyle={{paddingRight: 5}}
                        buttonStyle={{backgroundColor: '#00A680'}}
                        onPress={confirmLocation}
                    />
                    <Button 
                        title='Cancelar' 
                        containerStyle={{paddingLeft: 5}} 
                        buttonStyle={{backgroundColor: '#A60D0D'}}
                        onPress={() => setIsVisibleMap(false)}
                    />
                </View>
            </View>
        </Modal>
    )
}

function SubirImagen({toastRef, setImageSelected, imageSelected}) {
    const imageSelect = async () => {
        const resulPermissions = await Permissions.askAsync(
            Permissions.CAMERA_ROLL
        );

        if(resulPermissions.permissions.cameraRoll.status === 'denied'){
            toastRef.current.show('Debes permitir acceso para subir imágenes', 3000);
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3]
        });

        if(result.cancelled){
            toastRef.current.show('No se ha seleccionado ninguna imagen', 2000);
            return;
        }

        setImageSelected([
            ...imageSelected, result.uri
        ])
    }

    const eliminarImagen = image => {
        Alert.alert(
            'Eliminar imagen',
            '¿Estás seguro de eliminar la imagen?',
            [
                {
                    text: 'cancel',
                    style: 'cancel'
                },
                {
                    text: 'Eliminar',
                    onPress: () => {
                        const arrayImage = imageSelected.filter(imageURL => imageURL !== image);
                        setImageSelected(arrayImage);
                    }
                }
            ],
            { cancelable: false}
        )
    }

    return(
        <View style={styles.viewImage}>
            {imageSelected.length < 4 && (<Icon 
                type='material-community'
                name='camera'
                color='#7A7A7A'
                containerStyle={styles.containerIcon}
                onPress={imageSelect}
            />)}
            {imageSelected.map((image, index) => (
                <Avatar 
                    key={index}
                    style={styles.miniatura}
                    source={{uri: image}}
                    onPress={() => eliminarImagen(image)}
                />
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    scrollView: {
        height: '100%'
    },
    viewForm: {
        marginHorizontal: scale(10)
    },
    Input: {
        marginBottom: 10
    },
    textArea: {
        height: 100,
        width: '100%',
        padding: 0,
        margin: 0
    },
    btnAdd: {
        backgroundColor: '#00A680',
        margin: scale(10)
    },
    viewImage: {
        flexDirection: 'row',
        marginHorizontal: scale(10),
        marginTop: scale(20)
    },
    containerIcon: {
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: scale(10),
        width: scale(70),
        height: scale(70),
        backgroundColor: '#E3E3E3'
    },
    miniatura: {
        width: scale(70),
        height: scale(70),
        marginRight: 10
    },
    viewFoto: {
        alignItems: 'center',
        height: verticalScale(200),
        marginBottom: 10
    },
    mapStyle: {
        width: '100%',
        height: verticalScale(550)
    },
    viewMapBtn: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10
    }
});
 
export default AddPlaceForm;