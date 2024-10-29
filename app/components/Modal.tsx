/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from 'react-native';
import { heightPercentageToDP, heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Colors } from '../theme';
import { Fonts } from '../utils';
import { HourseIcon } from '../../assets';
import LinearGradient from 'react-native-linear-gradient';
import Icon1 from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Ionicons';
import { handleImagePicker, launchCameraImage } from './mediaUtils';

import { Button } from '.';


export interface Props {
    message: string,
    visible: boolean,
    type?: 1 | 2 | 3,
    setShowMessage: any,
    launchCameraWithType?: any;
    setImage?:any;
    navigation: any;
    onDelete?: any, onEdit?: any,
}
function Cards(props: Props): React.JSX.Element {
    const {
        type,
        message,setImage,
        setShowMessage,
        launchCameraWithType, onDelete, onEdit,
        visible,
        ...otherProps
    } = props
    const [message1, setMessage] = useState('')
    const [type1, setType] = useState('')

    useEffect(() => {
        let me = message?.split(':');
        setMessage(me && me[1] ? me[1] : '')
        setType(me && me[0] ? me[0] : '')
    }, [message, visible])
    const BottomSheetOption = ({ icon, text, onPress }) => (
        <View style={{ marginVertical: hp(3), marginTop: hp(2), alignItems: 'center', width: '50%' }}>
            <TouchableOpacity style={styles.icon} onPress={onPress}>
                {type1 === '6' ? <Icon name={icon} size={hp(4)} color={Colors.neutral1} /> : <Icon1 name={icon} size={hp(4)} color={Colors.neutral1} />}
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { fontFamily: Fonts.regular, marginTop: hp(1) }]}>{text}</Text>
        </View>
    );
    const option1 = () => {
        if (type1 === '6') {
            setShowMessage(false)
            launchCameraImage(setImage)
        }
        else {
            setShowMessage(false), launchCameraWithType('photo')

        }

    }
    const option2 = () => {
        if (type1 === '6') {
            setShowMessage(false)
            handleImagePicker(setImage)
        }
        else {
            setShowMessage(false), launchCameraWithType('video')

        }

    }

    return (
        <Modal animationType='slide' transparent={true} visible={visible} onRequestClose={() => { setShowMessage(false) }}>
            <TouchableWithoutFeedback onPress={() => { setShowMessage(false) }}>
                <View style={styles.modalContainer}>
                    <View >
                        <View style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.neutral1, borderRadius: hp(5), position: 'absolute', top: hp(-3.2), alignSelf: 'center', zIndex: 12 }}>
                            {type1 === '4' || type1 === '5' || type1 === '6' ? <Image source={HourseIcon} style={{ height: hp(8), width: hp(8), borderRadius: hp(8), resizeMode: 'contain' }} /> : <Icon name={type1 === '1' ? 'checkmark-done-circle' : type1 === '2' ? 'close-circle' : 'close-circle'}
                                color={type1 === '1' ? '#23a26d' : type1 === '2' ? '#cf3b2e' : '#cf3b2e'} size={heightPercentageToDP(6)} />}
                        </View>
                        <LinearGradient colors={['#a6a6a6', Colors.neutral1]} style={styles.modalContent}>
                            <Text style={[styles.modalTitle, { marginTop: hp(4) }]}>{type1 === '1' ? 'Success!' : type1 === '2' ? 'Error!' : type1 === '4' ? 'Select Media Type' : type1 === '5' || type1 === '6' ? message1 : 'Error!'}</Text>
                            {(type1 != '5' && type1 != '6') && <Text style={[styles.modalTitle, { fontFamily: Fonts.regular }]}>{message1}</Text>}
                            {(type1 === '4' || type1 === '6') && <View style={styles.modalButtons}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <BottomSheetOption icon='camera' text={type1 === '6' ? 'Capture' : 'Photo'} onPress={option1} />
                                    <BottomSheetOption icon={type1 === '6' ? 'images-sharp' : 'video-camera'} text={type1 === '6' ? 'Upload' : 'Video'} onPress={option2} />
                                </View>
                            </View>}
                            {type1 === '5' && <View style={[styles.modalButtons, { flexDirection: 'colomn', height: hp(13) }]}>
                                <Button Title='Edit' textStyle={{ color: Colors.neutral1 }} style={styles.btn} onPress={onEdit} />
                                <Button Title='Delete' textStyle={{ color: Colors.neutral1 }} style={styles.btn} onPress={onDelete} />

                            </View>}
                        </LinearGradient>
                    </View>

                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0)',

    },
    modalContent: {
        width: wp(80),
        padding: hp(2),
        backgroundColor: Colors.primary2,
        borderRadius: hp(2),
        alignItems: 'center',
        borderWidth: 2
    },
    icon: {
        width: wp(17),
        height: wp(17),
        borderRadius: wp(10),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.secondary3,
    },
    modalTitle: {
        fontSize: hp(2),
        textAlign: 'center',
        marginBottom: hp(1.5),
        fontFamily: Fonts.bold,
        color: Colors.secondary3,
        width: '100%'
    },
    btn: {
        width: wp(60), height: hp(4), alignSelf: 'center', backgroundColor: Colors.secondary3
    },
    modalButtons: {
        flexDirection: 'row',
        width: '100%', height: hp(16)
    },
    modalButton: {
        padding: hp(1),
        width: '45%', marginTop: hp(4),
        backgroundColor: Colors.secondary3,
        alignItems: 'center',
        borderRadius: hp(1),
    },
    modalButtonText: {
        color: Colors.neutral1,
        fontSize: hp(2),
    },
});

export default Cards;
