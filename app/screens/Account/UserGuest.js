import React from 'react';
import { StyleSheet, View, ScrollView, Text, Image, Dimensions } from 'react-native';
import { Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';
import { scale, verticalScale } from '../../../config/react-native-size';

const UserGuest = () => {

    const Navigation = useNavigation();

    return ( 
        <ScrollView centerContent={true} style={styles.viewBody}>
            <Image 
                source={require('../../../assets/img/user-guest.jpg')}
                resizeMode='contain'
                style={styles.image}
            />
            <Text style={styles.titulo}>Consulta tu perfil de Mira a Honduras</Text>
            <Text style={styles.descrip}>
                Busca y visualiza los mejores lugares turistícos de Honduras de una manera sencilla, además podrás votar, agregar a favoritos y comentar según haya sido tu experiencia.
            </Text>
            <View style={styles.viewBtn}>
                <Button 
                    buttonStyle={styles.btnPerfil}
                    containerStyle={styles.btnContainer}
                    title='Ver tu perfil'
                    onPress={() => Navigation.navigate('login')}
                />
            </View>
        </ScrollView>
     );
}

const styles = StyleSheet.create({
    viewBody: {
        marginHorizontal: 30
    },
    image: {
        height: verticalScale(300),
        width: '100%',
        marginBottom: 15
    },
    titulo: {
        fontWeight: 'bold',
        fontSize: scale(19),
        marginBottom: scale(10),
        textAlign: 'center'
    },
    descrip: {
        textAlign: 'center',
        marginBottom: scale(20),
        fontSize: scale(14),
    },
    btnPerfil: {
        backgroundColor: '#00A680'
    },
    btnContainer: {
        width: scale(70 * Dimensions.get('window').width / 100),
    },
    viewBtn: {
        flex: 1,
        alignItems: 'center'
    }
})
 
export default UserGuest;