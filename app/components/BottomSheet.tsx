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
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors } from '../theme';
import { Fonts, Screens } from '../utils';

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
    const snapPoints = useMemo(() => ['25%', '50%', '100%'], []);
    const snapPoints1 = useMemo(() => ['25%', '65%', '100%'], []);

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
            // Check for Android 13 or higher
            const isAndroid13OrHigher = Platform.Version >= 33;
            // Request Gallery Permissions (before Android 13)
            if (!isAndroid13OrHigher) {
                const galleryGranted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
                );
                setHasGalleryPermission(galleryGranted === 'granted');
            } else {
                // Request Permissions for Android 13 or higher
                const galleryGranted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES
                );
                setHasGalleryPermission(galleryGranted === 'granted');
            }

            // Request Camera Permissions (if needed)
            if (forCamera) {
                const cameraGranted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
                if (cameraGranted !== 'granted') {
                    Alert.alert('Permission Denied', 'Camera permission is required to take photos.');
                    return false;
                }
            }
            return true;
        } else {
            // Handle iOS Permissions
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
                        Alert.alert('Permission Denied', 'Camera permission is required to take photos.');
                        return false;
                    }
                }
            }
            return true;
        }
    };
    const handleImagePicker = async () => {
        const permissionGranted = await requestPermissions(true); // Pass true to indicate camera permission is needed
        if (!permissionGranted) {
            return; // If permission is denied, return early
        }

        if (!hasGalleryPermission) {
            Alert.alert('Permission Denied', 'Gallery permission is required to upload images.');
            return;
        }

        const result = await launchImageLibrary({ mediaType: 'mixed', quality: 1 });
        if (result.assets && result.assets.length > 0) {
            const { uri } = result.assets[0];
            setLoader && setLoader(true)
            setImage ? setImage(result.assets[0]) :
                navigation.navigate(Screens.AddCourse, { image: result.assets[0] });
            bottomSheetRef.current?.close();
        }
    };
    const handleCameraLaunch = async () => {
        const permissionGranted = await requestPermissions(true); // Pass true to indicate camera permission is needed
        if (!permissionGranted) {
            return; // If permission is denied, return early
        }

        // Show confirmation dialog to select media type
        Alert.alert(
            'Select Media Type',
            'Would you like to take a photo or record a video?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Photo',
                    onPress: () => launchCameraWithType('photo'), // Launch camera for photo
                }, 
                {
                    text: 'Video',
                    onPress: () => launchCameraWithType('video'), // Launch camera for video
                },

            ],
            { cancelable: true }
        );
    };

    // Helper function to launch the camera with the selected media type
    const launchCameraWithType = (mediaType) => {
        const options = {
            mediaType, // This will be either 'photo' or 'video'
            quality: 1, // You can adjust the quality
        };

        launchCamera(options, (response) => {
            if (response.assets && response.assets.length > 0) {
                setLoader && setLoader(true);

                // Navigate to the AddCourse screen or set the image
                setImage ? setImage(response.assets[0]) :
                    navigation.navigate(Screens.AddCourse, { image: response.assets[0] });

                bottomSheetRef.current?.close(); // Close the bottom sheet after selecting media
            }
        });
    };
    // const handleCameraLaunch = async () => {
    //     const permissionGranted = await requestPermissions(true); // Pass true to indicate camera permission is needed
    //     if (!permissionGranted) {
    //         return; // If permission is denied, return early
    //     }

    //     bottomSheetRef.current?.close();
    //     const options = { mediaType: 'mixed', quality: 1 };
    //     launchCamera(options, (response) => {
    //         if (response.assets && response.assets.length > 0) {
    //             setLoader && setLoader(true)

    //             setImage ? setImage(response.assets[0]) :

    //                 navigation.navigate(Screens.AddCourse, { image: response.assets[0] });
    //             bottomSheetRef.current?.close();
    //         }
    //     });
    // };

    const BottomSheetOption = ({ icon, text, onPress }) => (
        <View style={{ marginVertical: hp(3), alignItems: 'center', width: wp(60) }}>
            <TouchableOpacity style={styles.icon} onPress={onPress}>
                <Icon name={icon} size={hp(5)} color={Colors.neutral1} />
            </TouchableOpacity>
            <Text style={styles.nameText}>{text}</Text>
        </View>
    );

    return (
        <BottomSheet style={styles.bottomSheet}
            ref={bottomSheetRef} index={-1} snapPoints={isSkip ? snapPoints : snapPoints1}
            enablePanDownToClose={true} enableHandlePanningGesture={false}>
            <View style={styles.contentContainer}>
                <View style={{ flexDirection: 'row', width: wp(90), justifyContent: 'space-between' }}>
                    {isSkip ? <TouchableOpacity onPress={() => {navigation.navigate(Screens.AddCourse, { image: '' }) , bottomSheetRef.current?.close() }}
                        style={styles.skipbtn}>
                        <Text style={[styles.nameText, { marginTop: wp(-1) }]}>
                            Skip
                        </Text>
                        <Icon name={'arrow-forward'} size={hp(3)} color={Colors.secondary3}  />
                    </TouchableOpacity> : <View style={styles.skipbtn} />}
                    <BottomSheetOption icon="camera" text="Use Camera" onPress={handleCameraLaunch} />
                    <View>
                        <Icon name={'close'} size={hp(3)} color={Colors.secondary3} onPress={() => bottomSheetRef?.current?.close()} />
                    </View>
                </View>
                <BottomSheetOption icon="image" text="Upload from gallery" onPress={handleImagePicker} />
            </View>
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
    skipbtn: { flexDirection: 'row', width: wp(9), alignItems: 'center', height: hp(5), justifyContent: 'center' },
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
    bottomSheet: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 12,
        },
        shadowOpacity: 0.58,
        shadowRadius: 16.00,
        elevation: 24,
        borderTopColor: Colors.primary4,
        borderTopWidth: wp(1),
    },
    contentContainer: {
        backgroundColor: Colors.neutral1,
        alignItems: 'center',
        height: '45%',
        marginTop: hp(2),
        justifyContent: 'center',
    },
    icon: {
        width: wp(20),
        height: wp(20),
        borderRadius: wp(10),
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.secondary3,
    },

});

export default Cards;
