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

import { Colors } from '../theme';

export interface buttonProps {
    loading?: boolean
}

function Header(props: buttonProps): React.JSX.Element {
    const {
        loading
    } = props
    return (
        loading ? <View style={styles.container}>
            <ActivityIndicator size="large" color={Colors.neutral1} />
        </View> : <></>

    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        backgroundColor: 'rgba(0,0,0,0.4)',
        zIndex: 2, width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    }


});

export default Header;
