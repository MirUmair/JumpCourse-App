/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {
    Alert,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { HourseIcon } from '../../assets';
import { Fonts } from '../utils';
import { Colors } from '../theme';
export interface Object {
    name?: string,
    status?: string,
    venue?: string


}
export interface CourseObstacle {
    FenceType?: string,
    id?: Number,
    stride?: Number,
    RiderNotes: string
}

export interface inputProps {
    obstacles: any;
}

function ObstaclesHorizantal(props: inputProps): React.JSX.Element {
    const {
        obstacles,
        ...otherProps
    } = props
      return (
        <>
            <View style={styles?.Container}>
                <Text style={[styles?.TextStyle, { width: wp(17), borderLeftWidth: 1 ,borderBottomWidth:1}]}>Obstacles</Text>
                <Text style={[styles?.TextStyle, { width: wp(21) ,borderBottomWidth:1}]}>Fence Type</Text>
                <Text style={[styles?.TextStyle, { width: wp(14.5) ,borderBottomWidth:1 }]}>Strides</Text>
                <Text style={[styles?.TextStyle, { width: wp(37.5) ,borderBottomWidth:1 }]}>Rider Notes</Text>

            </View>
            {
                obstacles && obstacles?.map((item: any, index: any) => {
                    return (
                        <View style={styles?.SubContainer}>
                            <Text style={[styles?.SubTextStyle, { textAlign: 'center', width: wp(17), fontFamily: Fonts.bold }]}>{index+1}</Text>
                            <Text numberOfLines={1} style={[styles?.SubTextStyle, { width: wp(21) }]}>{item?.fenceType}</Text>
                            <Text numberOfLines={1} style={[styles?.SubTextStyle, { textAlign: 'center', width: wp(14.5) }]}>{item?.strides}</Text>
                            <Text numberOfLines={1} style={[styles?.SubTextStyle, { width: wp(37.5) }]}>{item?.riderNotes}</Text>
                        </View>

                    )

                })
            }



        </>

    );
}

const styles = StyleSheet.create({
    Container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: hp(3)
    },
    SubContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    TextStyle: {
        fontFamily: Fonts.bold,
        textAlign: 'center',
        color: Colors.secondary3,
        fontSize: hp(1.5),
        paddingVertical: hp(0.5),
        borderTopWidth: 1,
        borderRightWidth: 1
    },
    SubTextStyle: {
        color: 'black',
        fontSize: hp(1.4),
        fontFamily: Fonts.bold,

        borderWidth: 1, padding: wp(1)
    },


});

export default ObstaclesHorizantal;
