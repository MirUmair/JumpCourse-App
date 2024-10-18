/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Fonts } from '../utils';
import { Colors } from '../theme';

export interface buttonProps {

    Title?: string
    backIcon?: boolean
    navigation?: any
    onPressBack?: any
    icon?: string
}

function Header(props: buttonProps): React.JSX.Element {
    const {
        Title,
        icon = 'chevron-back-circle',
        navigation,
        backIcon = true,
        onPressBack = () => navigation.goBack()
    } = props
    return (
        <View style={styles.container}>
            <StatusBar
                barStyle={'light-content'}
                backgroundColor={Colors.secondary3}
            />
            {backIcon ? <TouchableOpacity onPress={onPressBack} style={styles.backView}>
                <Icon name={icon} size={hp(3.5)} color={'#fff'} />
            </TouchableOpacity> :
                <View style={styles.backView} />
            }
            <Text style={styles.text}>{Title}
            </Text>
        </View>

    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.secondary3,
        height: hp(8),
        width: wp(100),

        alignItems: 'center',
        flexDirection: 'row'
    },
    backView: {
        width: wp(10),
        alignItems: 'flex-end'
    },
    text: {
        fontSize: hp(2.5),
        fontFamily: Fonts.bold,
        width: wp(80),
        textAlign: 'center',
        color: Colors.neutral1,

    }

});

export default Header;
