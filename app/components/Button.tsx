/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Fonts } from '../utils';
import { google } from '../../assets';

export interface buttonProps {

    Title?: string
    onPress?: Function
    textStyle?: Function
    leftIcon?: boolean
    style?: any
}

function Input(props: buttonProps): React.JSX.Element {
    const {
        Title,
        onPress,
        style,
        leftIcon = false,
        textStyle
    } = props
    return (
        <TouchableOpacity onPress={onPress} style={[styles.inputContainer, style]}>
            {leftIcon && <Image style={{ width: wp(6), marginRight: wp(6),   resizeMode: 'contain' }} source={google} />}

            <Text style={[styles.text, textStyle]}>
                {Title}
            </Text>
        </TouchableOpacity>

    );
}

const styles = StyleSheet.create({
    inputContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.7)',
        marginTop: '5%',
        flexDirection: 'row',

        borderRadius: 100,
        color: '#000',
        alignItems: 'center',
        justifyContent: 'center',
        width: wp('85%'),
        height: hp('5%'),
        alignSelf: 'center',
    },
    text: {
        fontSize: 15,
        fontFamily: Fonts.bold,
        color: '#000',
    }

});

export default Input;
