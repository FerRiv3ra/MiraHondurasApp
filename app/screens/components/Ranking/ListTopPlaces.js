import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native'
import { Card, Image, Icon, Rating } from 'react-native-elements';
import { verticalScale } from '../../../../config/react-native-size';

const ListTopPlaces = ({places, navigation}) => {
    

    return (
        <FlatList 
            data={places}
            renderItem={(place) => <Place place={place} navigation={navigation} />}
            keyExtractor={(item, index) => index.toString()}
        />
    )
}

function Place({place, navigation}){
    const {name, images, rating, description, id} = place.item;
    const [color, setColor] = useState('#000');

    useEffect(() => {
        if(place.index === 0){
            setColor('#EFB819');
        }else if(place.index === 1){
            setColor('#E3E4E5');
        }else{
            setColor('#00A680');
        }
    }, []);

    return(
        <TouchableOpacity
            onPress={() => navigation.navigate('places', {screen: 'place', params: {id, name}})}
        >
            <Card containerStyle={styles.containercard}>
                <Icon 
                    type='material-community'
                    name='chess-queen'
                    color={color}
                    size={verticalScale(40)}
                    containerStyle={styles.containerIcon}
                />
                <Image 
                    style={styles. placeImg}
                    resizeMode='cover'
                    source={images[0] ? {uri: images[0]} : require('../../../../assets/img/no-image.png')}
                />
                <View style={styles.titleRating}>
                    <Text style={styles.title}>{name}</Text>
                    <Rating 
                        imageSize={verticalScale(20)}
                        startingValue={rating}
                        readonly
                    />
                </View>
                <Text style={styles.description}>{description}</Text>
            </Card>
        </TouchableOpacity>
    )
}

export default ListTopPlaces

const styles = StyleSheet.create({
    containerStyle: {
        marginBottom: verticalScale(30),
        borderWidth: 0
    },
    containerIcon: {
        position: 'absolute',
        top: -30,
        left: -30,
        zIndex: 1
    },
    placeImg: {
        width: '100%',
        height: verticalScale(200)
    },
    titleRating: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: verticalScale(10)
    },
    title: {
        fontSize: verticalScale(20),
        fontWeight: 'bold'
    },
    description: {
        color: 'grey',
        marginTop: 0,
        textAlign: 'justify'
    }
});
