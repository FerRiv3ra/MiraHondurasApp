import React, { useState, useEffect } from 'react';
import { Text } from 'react-native';
import * as firebase from 'firebase';
import UserGuest from './UserGuest';
import UserLogged from './UserLogged';
import Loading from '../components/Loading';

const Acoount = () => { 
    const [login, setLogin] = useState(null);
    useEffect(() => {
        firebase.auth().onAuthStateChanged(user => {
            !user ? setLogin(false) : setLogin(true);
        });
    }, []);

    if(login === null) return <Loading isVisible={true} text='Cargando...'/>;
    
    return login ? <UserLogged /> : <UserGuest />;
}
 
export default Acoount;