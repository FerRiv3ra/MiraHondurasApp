import React from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { Overlay } from 'react-native-elements';
import { scale, verticalScale } from '../../../config/react-native-size';

const Loading = (props) => {
    const { isVisible, text } = props;

    return ( 
        <Overlay 
            isVisible={isVisible}
            windowbackgroundColor='rgba(0, 0, 0, 0,5)'
            overlaybackgroundColor='transparent'
            overlayStyle={styles.overlay}
        >
            <View style={styles.view}>
                <ActivityIndicator size='large' color='#00A680' />
                {text && <Text style={styles.text}>{text}</Text>}
            </View>
        </Overlay>
     );
}

const styles = StyleSheet.create({
    overlay: {
        height: scale(100),
        width: verticalScale(200),
        backgroundColor: '#FFF',
        borderColor: '#00A680',
        borderWidth: scale(2),
        borderRadius: scale(10),
    },
    view: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: '#00A680',
        textTransform: 'uppercase',
        marginTop: 10,
    }
});
 
export default Loading;