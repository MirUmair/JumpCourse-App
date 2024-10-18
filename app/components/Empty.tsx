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
    View
} from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { empty } from '../../assets';
import { Colors } from '../theme';
import { Fonts } from '../utils';

function Cards(): React.JSX.Element {
    return (
        <View style={styles.Container}>
            <Image style={styles.ImageStyle} source={empty} />
            <Text style={styles.TextStyle}>
                Coming Soon...
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    Container: { height: '100%', alignItems: 'center', backgroundColor: '#fafafc', justifyContent: 'center' },
    ImageStyle: { width: wp(35), resizeMode: 'contain' },
    TextStyle: { marginBottom: hp(19), marginLeft: wp(5), fontFamily: Fonts.bold, fontSize: wp(4), color: Colors.neutral2 },
});

export default Cards;
