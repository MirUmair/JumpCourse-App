/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    View
} from 'react-native';
import LottieView from 'lottie-react-native';

import { Colors } from '../theme';
import { widthPercentageToDP } from 'react-native-responsive-screen';

export interface buttonProps {
    loading?: boolean
}

function Header(props: buttonProps): React.JSX.Element {
    const {
        loading
    } = props
    return (
        loading ? <View style={styles.container}>
            <LottieView style={{width:widthPercentageToDP(35),height:widthPercentageToDP(35)}} source={require('../utils/animation.json')} autoPlay loop />

            {/* <ActivityIndicator size="large" color={Colors.neutral1} /> */}
        </View> : <></>

    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        backgroundColor: 'rgba(0,0,0,0)',
        zIndex: 2, width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    }


});

export default Header;
