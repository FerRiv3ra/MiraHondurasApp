import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import TopPlaces from '../screens/TopPlaces';

const Stack = createStackNavigator();

const TopStack = () => {
    return ( 
        <Stack.Navigator>
            <Stack.Screen
                name='topplaces'
                component={TopPlaces}
                options={{
                    title: 'Mejores Valorados'
                }}
            />
        </Stack.Navigator>
     );
}
 
export default TopStack;