import React from 'react'
import { 
    StyleSheet, 
    Text, 
    View, 
    FlatList, 
    ActivityIndicator, 
    TouchableOpacity 
} from 'react-native';
import { Image } from 'react-native-elements';
import { scale, verticalScale, moderateScale } from '../../../../config/react-native-size';
import { useNavigation } from '@react-navigation/native';

const ListPlaces = ({places, handledLoadMore, isLoading}) => {
    const navigation = useNavigation();

    return (
        <View>
            {places.length > 0 ? (
                <FlatList 
                    data={places}
                    renderItem={(place) => <Place place={place} navigation={navigation} />}
                    keyExtractor={(item, index) => index.toString()}
                    onEndReachedThreshold={0.5}
                    onEndReached={handledLoadMore}
                    ListFooterComponent={<FooterList isLoading={isLoading} />}
                />
            ): (
                <View style={styles.loadingPlaces}>
                    <ActivityIndicator size='large' />
                    <Text>Cargando lugares</Text>
                </View>
            )}
        </View>
    )
}

function Place({place, navigation}){
    const { images, name, description, direccion, id } = place.item;
    const imagePlace = images[0];

    const goPlace = () => {
        navigation.navigate('place', {
            id,
            name
        });
    }

    return(
        <TouchableOpacity onPress={goPlace}>
            <View style={styles.viewPlace}>
                <View style={styles.viewPlaceImg}>
                    <Image 
                        resizeMode='cover'
                        PlaceholderContent={<ActivityIndicator color='#FFF' />}
                        source={
                            imagePlace ? {uri: imagePlace} 
                            : require('../../../../assets/img/no-image.png')
                        }
                        style={styles.imgPlace}
                    />
                </View>
                <View>
                    <Text style={styles.placeName}>{name}</Text>
                    <Text style={styles.direccion}>{direccion}</Text>
                    <Text style={styles.description}>{description.length < 60 ? description : `${description.substr(0, 60)}...`}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

function FooterList({isLoading}){
    if(isLoading){
        return(
            <View style={styles.loadingPlaces}>
                <ActivityIndicator 
                    size='large'
                />
            </View>
        )
    }else{
       return(
        <View style={styles.notFoundPlace}>
            <Text>No hay más lugares para mostrar</Text>
        </View>
       )
    }
}

const styles = StyleSheet.create({
    loadingPlaces: {
        marginVertical: 10,
        alignItems: 'center'
    },
    viewPlace: {
        flexDirection: 'row',
        margin: scale(10)
    },
    viewPlaceImg: {
        marginRight: verticalScale(15)
    },
    imgPlace: {
        width: scale(80),
        height: verticalScale(80)
    },
    placeName: {
        fontWeight: 'bold',
        fontSize: verticalScale(13)
    },
    direccion: {
        paddingTop: moderateScale(2), 
        color: 'grey',
        fontSize: verticalScale(13)
    },
    description: {
        paddingTop: moderateScale(2),
        color: 'grey',
        width: scale(245),
        fontSize: verticalScale(12)
    },
    notFoundPlace: {
        marginTop: scale(10),
        marginBottom: scale(20),
        alignItems: 'center'
    }
});

export default ListPlaces

