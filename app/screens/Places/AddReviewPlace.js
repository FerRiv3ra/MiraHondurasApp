import React, { useState, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AirbnbRating, Button, Input } from 'react-native-elements';
import { verticalScale, scale } from '../../../config/react-native-size';
import Toast from 'react-native-easy-toast';
import Loading from '../components/Loading';

import {firebaseApp} from '../../utils/firebase';
import firebase from 'firebase/app';
import 'firebase/firestore';

const db = firebase.firestore(firebaseApp);

const AddReviewPlace = ({navigation, route}) => {
    const { idPlace } = route.params;
    const [rating, setRating] = useState(0);
    const [title, setTitle] = useState('');
    const [review, setReview] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const toastRef = useRef();

    const addReview = () => {
        if(!rating){
            toastRef.current.show('La puntuación no puede estar vacía', 1500);
            return;
        }

        if(!title){
           toastRef.current.show('El título es obligatorio', 1500);
            return; 
        }

        if(!review){
           toastRef.current.show('El comentario es obligatorio', 1500);
            return; 
        }

        setIsLoading(true);
        const user = firebase.auth().currentUser;
        const payload = {
            idUser: user.uid,
            avatarUser: user.photoURL,
            idPlace: idPlace,
            title: title,
            review: review,
            rating: rating,
            created: new Date()
        }

        db.collection('reviews')
            .add(payload)
            .then(() => {
                updatePlace();
            })
            .catch(() => {
                toastRef.current.show('Error al agregar tu reseña, vuelve a intentar más tarde', 2000);
                setIsLoading(false);
            })
    }

    const updatePlace = () => {
        const placeRef = db.collection('places').doc(idPlace);

        placeRef.get().then((response) => {
            const placeData = response.data();
            const ratingTotal = placeData.ratingTotal + rating;
            const conteoVotos = placeData.votos + 1;
            const ratingResult = ratingTotal / conteoVotos;

            placeRef.update({
                rating: ratingResult,
                ratingTotal,
                votos: conteoVotos
            }).then(() => {
                setIsLoading(false);
                navigation.goBack();
            })
        })
    }
    
    return (
        <View style={styles.viewBody}>
            <View style={styles.viewRating}>
                <AirbnbRating 
                    count={5}
                    reviews={['Malo', 'Regular', 'Bueno', 'Muy bueno', 'Excelente']}
                    size={scale(35)}
                    defaultRating={rating}
                    onFinishRating={(value) => setRating(value)}
                />
                <View style={styles.formReview}>
                    <Input 
                        placeholder='Título'
                        containerStyle={styles.input}
                        onChange={(e) => setTitle(e.nativeEvent.text)}
                    />
                    <Input 
                        placeholder='Comentario'
                        multiline={true}
                        inputContainerStyle={styles.textArea}
                        onChange={(e) => setReview(e.nativeEvent.text)}
                    />
                </View>
            </View>
            <Button 
                title='Enviar reseña'
                containerStyle={styles.btnContainer}
                buttonStyle={styles.btn}
                onPress={addReview}
            />
            <Toast 
                ref={toastRef}
                position='center'
                opacity={0.9}
            />
            <Loading 
                isVisible={isLoading}
                text='Agregando reseña'
            />
        </View>
    )
}

const styles = StyleSheet.create({
    viewBody: {
        flex: 1,
    },
    viewRating: {
        height: verticalScale(110),
        backgroundColor: '#F2F2F2'
    },
    formReview: {
        alignItems: 'center',
        margin: scale(10),
        marginTop: scale(40)
    },
    input: {
        marginBottom: verticalScale(10)
    },
    textArea: {
        height: verticalScale(150),
        width: '100%',
        padding: 0,
        margin: 0
    },
    btnContainer: {
        position: 'absolute',
        bottom: 10,
        alignSelf: 'center',
        marginVertical: 10,
        width: '95%'
    },
    btn: {
        backgroundColor: '#00A680'
    }
});

export default AddReviewPlace

