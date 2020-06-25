import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ListItem } from 'react-native-elements';
import Modal from '../Modal';
import CambiarDisplayName from './CambiarDisplayName';
import ChangePassword from './ChagePassword';

const AccountOptions = ({userInfo, toastRef, setReloadUser}) => {
    const [showModal, setShowModal] = useState(false);
    const [renderComponent, setRenderComponent] = useState(null);

    const selectedComponent = (key) => {
        switch(key){
            case 'displayName':
                setRenderComponent(
                    <CambiarDisplayName 
                        displayName={userInfo.displayName}
                        setShowModal={setShowModal}
                        setReloadUser={setReloadUser}
                    />
                );
                setShowModal(true);
                break;
            case 'password':
                setRenderComponent(
                    <ChangePassword 
                        setShowModal={setShowModal}
                    />
                );
                setShowModal(true);
                break;
            default:
                setShowModal(false);
                setRenderComponent(null);
        }
    }

    const menuOptions = generateOptions(selectedComponent);

    return ( 
        <View>
            {menuOptions.map((menu, index) => (
                <ListItem 
                    key={index} 
                    title={menu.title} 
                    leftIcon={{
                        type: menu.iconType,
                        name: menu.iconNameLeft,
                        color: menu.iconColorLeft
                    }}
                    rightIcon={{
                        type: menu.iconType,
                        name: menu.iconNameRight,
                        color: menu.iconColorRight
                    }}
                    containerStyle={styles.menuItem}
                    onPress={menu.onPress}
                />
            ))}
            {renderComponent && 
                <Modal isVisible={showModal} setIsVisible={setShowModal}>
                    {renderComponent}
                </Modal>
            }
            
        </View>
     );
}

const styles = StyleSheet.create({
    menuItem: {
        borderBottomWidth: 1,
        borderBottomColor: '#E3E3E3'
    }
});

function generateOptions(selectedComponent) {
    return [
        {
            title: 'Cambiar nombre',
            iconType: 'material-community',
            iconNameLeft: 'account-circle',
            iconColorLeft: '#CCC',
            iconNameRight: 'chevron-right',
            iconColorRight: '#CCC',
            onPress: () => selectedComponent('displayName'),
        },
        {
            title: 'Cambiar contraseña',
            iconType: 'material-community',
            iconNameLeft: 'lock-reset',
            iconColorLeft: '#CCC',
            iconNameRight: 'chevron-right',
            iconColorRight: '#CCC',
            onPress: () => selectedComponent('password'),
        }
    ]
}
 
export default AccountOptions;