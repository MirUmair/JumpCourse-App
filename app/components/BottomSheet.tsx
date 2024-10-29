/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import BottomSheet from '@gorhom/bottom-sheet';
import React, { useEffect, useMemo, useState } from 'react';
import {
    Alert,
    PermissionsAndroid,
    Platform,
    StyleSheet,
    Text, Image,
    TouchableOpacity,
    View
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import LinearGradient from 'react-native-linear-gradient';

import { heightPercentageToDP, heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors } from '../theme';
import { Fonts, Screens } from '../utils';
import { HourseIcon, media } from '../../assets';
import { Button, Modal } from '.';

export interface Props {
    navigation: any
    bottomSheetRef: any
    isSkip?: boolean
    setImage?: any
    setLoader?: any
}
function Cards(props: Props): React.JSX.Element {
    const [hasGalleryPermission, setHasGalleryPermission] = useState(false);
    const { bottomSheetRef, isSkip = false, setImage, navigation, setLoader } = props
    const snapPoints = useMemo(() => ['60%', '60%'], []);
    const snapPoints1 = useMemo(() => ['70%', '70%'], []);

    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState('4:Select Media Type , Would you like to take a photo or record a video?');

    useEffect(() => {
        const requestGalleryPermission = async () => {
            try {
                const galleryGranted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
                );
                setHasGalleryPermission(galleryGranted === PermissionsAndroid.RESULTS.GRANTED);
            } catch (error) {
                console.error('Failed to request gallery permission', error);
            }
        };

        requestGalleryPermission();
    }, []);
    const requestPermissions = async (forCamera = false) => {
        if (Platform.OS === 'android') {
            const isAndroid13OrHigher = Platform.Version >= 33;
            if (!isAndroid13OrHigher) {
                const galleryGranted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
                );
                setHasGalleryPermission(galleryGranted === 'granted');
            } else {
                const galleryGranted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
                );
                setHasGalleryPermission(galleryGranted === 'granted');
            }
            if (forCamera) {
                const cameraGranted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
                if (cameraGranted !== 'granted') {
                    setShowMessage(true)
                    setMessage('2:Camera permission is required to take photos.')
                    return false;
                }
            }
            return true;
        } else {
            const galleryResult = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
            if (galleryResult !== RESULTS.GRANTED) {
                const galleryResponse = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
                setHasGalleryPermission(galleryResponse === RESULTS.GRANTED);
            } else {
                setHasGalleryPermission(true);
            }

            if (forCamera) {
                const cameraResult = await check(PERMISSIONS.IOS.CAMERA);
                if (cameraResult !== RESULTS.GRANTED) {
                    const cameraResponse = await request(PERMISSIONS.IOS.CAMERA);
                    if (cameraResponse !== RESULTS.GRANTED) {
                        setShowMessage(true)
                        setMessage('3:Camera permission is required to take photos.')
                        return false;
                    }
                }
            }
            return true;
        }
    };
    const handleImagePicker = async () => {
        const permissionGranted = await requestPermissions(true);
        if (!permissionGranted) {
            return;
        }
        if (!hasGalleryPermission) {
            setShowMessage(true)
            setMessage('3:Gallery permission is required to upload images.')
            return;
        }
        bottomSheetRef.current.close()

        setLoader(true)
        const result = await launchImageLibrary({ mediaType: 'mixed', quality: 1 });
        if (result.assets && result.assets.length > 0) {
            setShowMessage && setShowMessage(false)
            setLoader && setLoader(false)
            setImage ? setImage(result.assets[0]) :
                navigation.navigate(Screens.AddCourse, { image: result.assets[0] });
            bottomSheetRef.current?.close();
        }
        else
        {
            setLoader && setLoader(false);
        }
    };
    const handleCameraLaunch = async () => {
        const permissionGranted = await requestPermissions(true);
        if (!permissionGranted) {
            return;
        }
        setShowMessage(true)
        setMessage('4:Would you like to take a photo or record a video?')

    };

    // Helper function to launch the camera with the selected media type
    const launchCameraWithType = (mediaType) => {
        bottomSheetRef.current.close()
        // setShowMessage(true)
        const options = {
            mediaType, // This will be either 'photo' or 'video'
            quality: 1, // You can adjust the quality
        };
        setLoader && setLoader(true)
        setTimeout(() => {
            launchCamera(options, (response) => {
                if (response.assets && response.assets.length > 0) {
                    setShowMessage && setShowMessage(false)

                    setLoader && setLoader(false);

                    // Navigate to the AddCourse screen or set the image
                    setImage ? setImage(response.assets[0]) :
                        navigation.navigate(Screens.AddCourse, { image: response.assets[0] });

                    bottomSheetRef.current?.close(); // Close the bottom sheet after selecting media
                }
                else
                {
                    setLoader && setLoader(false);
                }
            });
        }, 100);

    };


    const BottomSheetOption = ({ icon, text, onPress }) => (
        <View style={{ marginVertical: hp(3), marginTop: hp(11), alignItems: 'center', width: wp(40) }}>
            <TouchableOpacity style={styles.icon} onPress={onPress}>
                {text === 'Media' ? <Image
                    source={media}
                    style={styles?.ImageStyle}
                /> : <Icon name={icon} size={hp(4.4)} color={Colors.primary4} />}
            </TouchableOpacity>
            <Text style={{ fontFamily: Fonts.regular, fontSize: hp(2), color: Colors.secondary3, marginTop: hp(1) }}>{text}</Text>

        </View>
    );

    return (
        <BottomSheet style={styles.bottomSheet}
            handleIndicatorStyle={{ display: 'none' }} // Hide the line
            backgroundStyle={styles.transparentBackground} // Set transparent background
            ref={bottomSheetRef} index={-1}
            snapPoints={isSkip ? snapPoints : snapPoints1}
            enablePanDownToClose={true}
            enableHandlePanningGesture={false}>
            <Modal type={'4'} visible={showMessage} setShowMessage={setShowMessage} message={message} launchCameraWithType={launchCameraWithType} />

            <Image
                source={HourseIcon}
                style={styles?.ImageStyle}
            />
            <LinearGradient colors={['#a6a6a6', Colors.neutral1]} style={[styles.contentContainer, { paddingBottom: hp(isSkip ? 8 : 20) }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <BottomSheetOption icon="play" text="Media" onPress={handleCameraLaunch} />
                    <BottomSheetOption icon="images-sharp" text="Gallery" onPress={handleImagePicker} />
                </View>
                {isSkip && <Button Title='Skip' onPress={() => { navigation.navigate(Screens.AddCourse, { image: '' }), bottomSheetRef?.current?.close() }} style={styles.skipbtn} textStyle={styles.btnText} />}
                <Button Title='Close' onPress={() => bottomSheetRef?.current?.close()} style={styles.skipbtn} textStyle={styles.btnText} />
            </LinearGradient>

        </BottomSheet>
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
        fontWeight: 'bold',
        color: Colors.secondary3,
        marginBottom: hp(2),
    },
    skipbtn: { width: wp(70), height: hp(5), marginTop: hp(2), backgroundColor: Colors.secondary3 },
    btnText: { color: Colors.neutral1 },
    nameText: {
        fontSize: hp(2),
        color: Colors.secondary3,
        marginTop: hp(1),
        fontFamily: Fonts.medium,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    modalButton: {
        padding: hp(1.5),
        width: '45%',
        backgroundColor: Colors.secondary3,
        alignItems: 'center',
        borderRadius: hp(1),
    },
    modalButtonText: {
        color: Colors.neutral1,
        fontSize: hp(2),
    },
    ImageStyle: {
        width: hp(10),
        height: hp(10), alignSelf: 'center',
        borderRadius: hp(5), position: 'absolute', zIndex: 2,
    },
    bottomSheet: {
    },
    contentContainer: {
        backgroundColor: Colors.neutral1,
        alignItems: 'center',
        justifyContent: 'center',
        borderTopLeftRadius: hp(2),
        marginTop: hp(4),
        paddingBottom: hp(9),
        borderTopRightRadius: hp(2), height: '100%'
    },

    icon: {
        width: wp(17),
        height: wp(17),
        borderRadius: wp(10),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.secondary3,
    },
    transparentBackground: {
        backgroundColor: 'transparent',
    },

});

export default Cards;
