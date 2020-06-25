import React, { useState, useRef } from 'react';
import { View } from 'react-native';
import { Input } from 'react-native-elements';
import Toast from 'react-native-easy-toast';
import Loading from '../components/Loading';
import AddPlaceForm from '../components/Places/AddPlaceForm';

const AddPlaces = ({navigation}) => {
    const [isLoading, setIsLoading] = useState(false);
    const toastRef = useRef();
    
    return ( 
        <View>
            <AddPlaceForm 
                toastRef={toastRef}
                setIsLoading={setIsLoading}
                navigation={navigation}
            />
            <Toast 
                ref={toastRef} 
                position='center'
                opacity={0.9}
            />
            <Loading isVisible={isLoading} text='Creando nuevo lugar' />
        </View>
     );
}
 
export default AddPlaces;