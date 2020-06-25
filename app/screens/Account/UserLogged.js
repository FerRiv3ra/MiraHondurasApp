import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as firebase from 'firebase';
import { scale, moderateScale } from '../../../config/react-native-size';
import { Button } from 'react-native-elements';
import Toast from 'react-native-easy-toast';
import Loading from '../../screens/components/Loading';
import InfoUser from '../components/Account/InfoUser';
import AccountOptions from '../components/Account/AccountOptions';

const UserLogged = () => {
    const [userInfo, setUserInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingText, setLoadingText] = useState('');
    const [reloadUser, setReloadUser] = useState(false);
    const toastRef = useRef();

    useEffect(() => {
        (async () => {
            const user = await firebase.auth().currentUser;
            setUserInfo(user);
        })()
        setReloadUser(false);
    }, [reloadUser]);

    return ( 
        <View style={styles.viewUserInfo}>
            {userInfo && <InfoUser 
                userInfo={userInfo} 
                toastRef={toastRef} 
                setLoadingText={setLoadingText}
                setLoading={setLoading}
            />}
            <AccountOptions 
                userInfo={userInfo} 
                toastRef={toastRef}
                setLoadingText={setLoadingText}
                setLoading={setLoading}
                setReloadUser={setReloadUser}
            />
            <Button
                title='Cerrar sesión'
                buttonStyle={styles.btnCloseSesion}
                titleStyle={styles.btnCloseSesionText}
                onPress={() => firebase.auth().signOut()}
            />
            <Toast ref={toastRef} position='center' opacity={0.9} />
            <Loading text={loadingText} isVisible={loading} />
        </View>
     );
}

const styles = StyleSheet.create({
    viewUserInfo: {
        minHeight: '100%',
        backgroundColor: '#F2F2F2'
    },
    btnCloseSesion: {
        marginTop: scale(30),
        borderRadius: 0,
        backgroundColor: '#FFF',
        borderWidth: 1,
        borderTopColor: '#E3E3E3',
        borderBottomWidth: 1,
        borderBottomColor: '#E3E3E3',
        paddingVertical: moderateScale(10)
    },
    btnCloseSesionText: {
        color: '#00A680'
    }
})
 
export default UserLogged;