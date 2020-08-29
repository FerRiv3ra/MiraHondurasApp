import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-elements'

import PlacesStack from './PlacesStack';
import FavoritesStack from './FavoritesStack';
import TopStack from './TopStack';
import SearchStack from './SearchStack';
import AccountStack from './AccountStack';

const Tab = createBottomTabNavigator();

const Navigation = () => {

    const screenOptions = (route, color) => {
        let iconName;

        switch(route.name){
            case 'places':
                iconName = 'compass-outline';
                break;
            case 'favorites':
                iconName= 'heart-outline'
                break;
            case 'topplaces':
                iconName= 'star-outline'
                break;
            case 'search':
                iconName= 'magnify'
                break;
            case 'account':
                iconName= 'account'
                break;      
            default: 
                break;
        }
        return (
            <Icon type='material-community' name={iconName} size={22} color={color} />
        )
    }

    return ( 
        <NavigationContainer>
            <Tab.Navigator
                initialRouteName='places'
                tabBarOptions={{
                    inactiveTintColor: '#646464',
                    activeTintColor: '#00A680'
                }}
                screenOptions={({route}) => ({
                    tabBarIcon: ({ color }) => screenOptions(route, color)
                })}
            >
                <Tab.Screen 
                    name='places'
                    component={PlacesStack}
                    options={{
                        title: 'Lugares'
                    }}
                />
                <Tab.Screen 
                    name='favorites'
                    component={FavoritesStack}
                    options={{
                        title: 'Favoritos'
                    }}
                />
                <Tab.Screen 
                    name='search'
                    component={SearchStack}
                    options={{
                        title: 'Buscar'
                    }}
                />
                <Tab.Screen 
                    name='account'
                    component={AccountStack}
                    options={{
                        title: 'Cuenta'
                    }}
                />
            </Tab.Navigator>
        </NavigationContainer>
     );
}
 
export default Navigation;