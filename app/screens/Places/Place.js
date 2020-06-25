import React, { useState, useCallback } from 'react';
import { StyleSheet, Dimensions, View, Text } from 'react-native';
import { Rating, ListItem } from 'react-native-elements';
import Loading from '../components/Loading';
import Map from '../components/Map';
import { useFocusEffect } from '@react-navigation/native';

import { firebaseApp } from '../../utils/firebase';
import firebase from 'firebase/app';
import 'firebase/firestore';
import CarouselImage from '../components/Carousel';
import { ScrollView } from 'react-native-gesture-handler';
import { verticalScale, moderateScale, scale } from '../../../config/react-native-size';
import ListReviews from './ListReviews';

const db = firebase.firestore(firebaseApp);
const screenWidth = Dimensions.get('window').width;

const Place = ({navigation, route}) => {
    const {id, name} = route.params;
    
    const [place, setPlace] = useState(null);
    const [rating, setRating] = useState(0);
    
    navigation.setOptions({ title: name });

    useFocusEffect(
        useCallback(() => {
            db.collection('places')
                .doc(id)
                .get()
                .then((response) => {
                    const data = response.data();
                    data.id = response.id;
                    setPlace(data);
                    setRating(data.rating);
                })
        }, [])
    );

    if(!place) return <Loading isVisible={true} text='Cargando...' />

    return (
        <ScrollView vertical style={styles.viewBody}>
            <CarouselImage 
                arrayImages={place.images}
                height={verticalScale(250)}
                width={screenWidth}
            />
            <TitlePlace 
                name={place.name}
                description={place.description} 
                rating={rating}
            />
            <PlaceInfo 
                location={place.location} 
                name={place.name} 
                direccion={place.direccion} 
                categoria={place.categoria}
            />
            <ListReviews 
                navigation={navigation} 
                idPlace={place.id}
                setRating={setRating}
            />
        </ScrollView>
    )
}

function TitlePlace({name, description, rating}){
    return(
        <View style={styles.viewPlaceTitle}>
            <View style={{flexDirection: 'row'}}>
                <Text style={styles.namePlace}>{name}</Text>
                <Rating 
                    style={styles.rating}
                    imageSize={scale(20)}
                    readonly
                    startingValue={parseFloat(rating)}
                />
            </View>
            <Text style={styles.descriptionPlace}>{description}</Text>
        </View>
    )
}

function PlaceInfo({location, name, direccion, categoria}){
    const obtenerCategoria = (categoria) => {
        let cat;
        if(categoria === 'turist'){
            cat = 'Lugar turístico';
        }else if(categoria === 'rest'){
            cat = 'Restaurante';
        }else{
            cat = 'Hotel'
        }
        return cat;
    }

    const obtenerIcon = categoria => {
        let icon;
        if(categoria === 'turist'){
            icon = 'camera';
        }else if(categoria === 'rest'){
            icon = 'silverware-fork-knife';
        }else{
            icon = 'bed'
        }
        return icon;
    }

    const listInfo = [
        {
            text: direccion,
            iconName: 'map-marker',
            iconType: 'material-community',
            action: null
        },
        {
            text: obtenerCategoria(categoria),
            iconName: obtenerIcon(categoria),
            iconType: 'material-community',
            action: null
        }
    ]

    return(
        <View style={styles.viewPlaceInfo}>
            <Text style={styles.placeTitleInfo}>Información sobre el lugar</Text>
            <Map location={location} name={name} height={verticalScale(100)} />
            {listInfo.map((item, index) => (
                <ListItem 
                    key={index}
                    title={item.text}
                    leftIcon={{
                        name: item.iconName,
                        type: item.iconType,
                        color: '#00A680'
                    }}
                    containerStyle={styles.containerListItem}
                />
            ))}
        </View>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
        backgroundColor: 'white'
    },
    viewPlaceTitle: {
        padding: moderateScale(15)
    },
    namePlace: {
        fontSize: verticalScale(20),
        fontWeight: 'bold'
    },
    descriptionPlace: {
        marginTop: verticalScale(5),
        color: 'grey',
        fontSize: verticalScale(13)
    },
    rating: {
        position: 'absolute',
        right: 0
    },
    viewPlaceInfo: {
        margin: scale(15)
    },
    placeTitleInfo: {
        fontSize: verticalScale(20),
        fontWeight: 'bold',
        marginBottom: verticalScale(10)
    },
    containerListItem: {
        borderBottomColor: '#D8D8D8',
        borderBottomWidth: 1
    }
});

export default Place

