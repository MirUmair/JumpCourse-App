/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import {
    Image,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { heightPercentageToDP, heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Colors } from '../theme';
import { Fonts } from '../utils';
import { HourseIcon } from '../../assets';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';


export interface Props {
    message: string,
    visible: boolean,
    type: 1 | 2 | 3,
    setShowMessage:any,
    navigation: any
}
function Cards(props: Props): React.JSX.Element {
    const {
        type,
        message,setShowMessage,
        visible,
        ...otherProps
    } = props
    const [mVisible, setmVisible] = useState('');
    const [message1, setMessage] = useState('')
    const [type1, setType] = useState('')

    useEffect(() => {
        let me = message.split(':');
        console.log(me)
        setMessage(me[1])
        setType(me[0])
     }, [message,visible])

    return (
        <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={() => setShowMessage(false)}>
            <View style={styles.modalContainer}>
                <LinearGradient colors={['#a6a6a6', Colors.neutral1]} style={styles.modalContent}>
                    <View style={{ backgroundColor: 'rgba(231,245,238,0.5)', alignItems: 'center', justifyContent: 'center', width: hp(6), height: hp(6), borderRadius: hp(6) }}>
                        <Icon name={type1 === 1 ? 'checkmark-done-circle' : type1 === 2 ? 'close-circle-sharp' : 'alert-circle'} color={type1 === "1" ? '#23a26d' : type1 === "2" ? 'red' : 'brown'} size={heightPercentageToDP(4)} />
                    </View>
                    <Text style={[styles.modalTitle, { marginTop: hp(2) }]}>{type1 === "1" ? 'Success!' : type1 === "2" ? 'Fail!' : 'Error!'}</Text>
                    <Text style={[styles.modalTitle, { fontFamily: Fonts.regular }]}>{message1}</Text>
                    <View style={styles.modalButtons}>
                        <TouchableOpacity style={styles.modalButton} onPress={() => setShowMessage(false)}>
                            <Text style={styles.modalButtonText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: wp(80),
        padding: hp(3),
        backgroundColor: Colors.primary2,
        borderRadius: hp(2),
        alignItems: 'center',

    },
    modalTitle: {
        fontSize: hp(2.5),
        fontFamily: Fonts.bold,
        color: Colors.secondary3,
        width: '100%'
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        width: '100%',
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
