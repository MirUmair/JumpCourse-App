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
import { Colors } from '../theme';
import { Fonts } from '../utils';
import { HourseIcon } from '../../assets';

export interface obstacleSchema {
    fenceType: String,
    line: String,
    riderNotes: String,
    strides: String
}
export interface itemProps {
    courseDesigner: String,
    userId: String,
    courseImage: String,
    date: String,
    name: String,
    obstacles: [obstacleSchema],
    timeAllowed: String,
    venue: String,
}
export interface Props {
    item: itemProps,
    navigation: any
}
function Cards(props: Props): React.JSX.Element {
    const {
        item,
        navigation,
        ...otherProps
    } = props



    return (
        <View style={styles?.Container}>
            <View style={styles?.MainContainer}>
                <Image
                    source={HourseIcon}
                    style={styles?.ImageStyle}
                />
                <View style={styles?.TextViewContainer}>
                    <Text numberOfLines={1} style={styles?.TextStyle}>
                        {item?.name}
                    </Text>
                    <Text numberOfLines={1} style={[styles?.TextStyle, styles?.VenueStye]}>
                        {item?.venue}
                    </Text>
                </View>
                <Text numberOfLines={1} style={styles?.StatusStyle}>
                    {item?.obstacles.length}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    Container: {
        backgroundColor: Colors.primary3,
        marginHorizontal: ('2%'),
        color: 'grey',
        width: wp('94%'),
        borderRadius: hp(2),
        alignItems: 'center',
        justifyContent: 'center',
        margin: hp('0.7%'),
        alignSelf: 'center',
    },
    MainContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: wp('4%')

    },
    ImageStyle: {
        width: hp(8),
        height: hp(8),
        borderRadius: hp(8)
    },

    TextViewContainer: {
        flexDirection: 'column',
        flex: 1,
        padding: hp('2%'),
    },
    TextStyle: {
        color: Colors.secondary3,
        fontFamily: Fonts.bold,
        fontSize: hp('2.2%')
    },
    VenueStye: {
        fontFamily: Fonts.regular,


        fontSize: hp('2%')
    },
    StatusStyle: {
        color: Colors.secondary3,
        fontFamily: Fonts.bold,
        marginRight: wp(2),
        fontSize: hp('2%')
    }

});

export default Cards;
