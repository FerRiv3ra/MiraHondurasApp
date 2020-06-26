import React, { useState, useEffect, useRef } from 'react';
import { View } from 'react-native';
import { firebaseApp } from '../utils/firebase';
import firebase from 'firebase/app';
import 'firebase/firestore';
import Toast from 'react-native-easy-toast';
import ListTopPlaces from './components/Ranking/ListTopPlaces';

const db = firebase.firestore(firebaseApp);

const TopPlaces = ({navigation}) => {
    const [places, setPlaces] = useState([]);
    const toastRef = useRef();

    useEffect(() => {
        const placesArray = [];
        db.collection('places')
            .orderBy('rating', 'desc')
            .limit(5)
            .get()
            .then((response) => {
                response.forEach((doc) => {
                    const data = doc.data();
                    data.id = doc.id;
                    placesArray.push(data);
                })
                setPlaces(placesArray);
            })
    })

    return ( 
        <View>
            <ListTopPlaces places={places} navigation={navigation} />
            <Toast ref={toastRef} position='center' opacity={0.9} />
        </View>
     );
}
 
export default TopPlaces;