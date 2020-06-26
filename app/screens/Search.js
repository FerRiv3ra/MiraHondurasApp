import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, Picker } from 'react-native';
import { SearchBar, ListItem, Icon, Divider } from 'react-native-elements';
import { FireSQL } from 'firesql';
import firebase from 'firebase/app';
import { scale, verticalScale } from '../../config/react-native-size';

const fireSql = new FireSQL(firebase.firestore(), { includeId: 'id'});

const Search = ({navigation}) => {
    const [search, setSearch] = useState('');
    const [departamento, setDepartamento] = useState('');
    const [places, setPlaces] = useState([]);

    useEffect(() => {
        if(search){
            fireSql.query(`SELECT * FROM places WHERE name LIKE '${search}%'`)
            .then((response) => {
                console.log(response);
                setPlaces(response);
            });
        }
    }, [search]);

    return ( 
        <View>
           {/*  <Picker
                onValueChange={ departamento => setDepartamento(departamento) }
                selectedValue={departamento}
                itemStyle={{height: 90}}
            >
                <Picker.Item label='-Selecciona departamento-' value='' />
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
            <Divider style={{ backgroundColor: '#00A680', height: 2, marginVertical: 10 }} /> */}
            <SearchBar 
                placeholder='Buscar lugar lugar turístico, hotel o restaurante'
                onChangeText={(e) => setSearch(e)}
                value={search}
                containerStyle={StyleSheet. searchBar}
            />
            {places.length === 0 ? (
                <NoFoundPlace />
            ) : (
                <FlatList 
                    data={places}
                    renderItem={(place) => <Place place={place} navigation={navigation} />}
                    keyExtractor={(item, index) => index.toString()}
                />
            )}
        </View>
     );
}

function NoFoundPlace() {
    return(
        <View style={{flex: 1, alignItems: 'center'}}>
            <Image 
                source={require('../../assets/img/no-results.png')}
                resizeMode='cover'
                style={{width: scale(200), height: verticalScale(200)}}
            />
        </View>
    )
}

function Place({place, navigation}){
    const { name, id, images } = place.item;
    return(
        <ListItem 
            title={name}
            leftAvatar={{
                source: images[0] ? {uri: images[0]} : require('../../assets/img/no-results.png')
            }}
            rightIcon={<Icon type='material-community' name='chevron-right' />}
            onPress={() => navigation.navigate('places', {screen: 'place', params: {id, name}})}
            

        />
    )
}

const styles = StyleSheet.create({
    searchBar: {
        marginBottom: 20
    }
});
 
export default Search;