/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import LottieView from 'lottie-react-native';
import React, { useEffect, useState } from 'react';
import {
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/FontAwesome';
import Video from 'react-native-video';
import { Loader } from '.';
import { Colors } from '../theme';
import { Fonts } from '../utils';

export interface CustomImage {
    image?: any
    handleToggleBottomSheet?: any
    editable?: boolean
    loader?: boolean
}

function ImageCustom(props: CustomImage): React.JSX.Element {
    const {
        image, handleToggleBottomSheet, editable = false, loader = false
    } = props
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [loading, setLoading] = useState(true); // Loader state

    const [rotation, setRotation] = useState('0deg'); // Handle rotation if necessary
    const isVideo = (url) => {
        console.log(url)
        return url?.match(/\.(mp4|mov|avi|mkv|webm|flv|wmv|m4v)$/i) ? true : false;
    };
    useEffect(() => {


        if (isVideo(image)) { setRotation('0deg'); return }
        Image.getSize(image, (width, height) => {
            const screen = Dimensions.get('window');
            const screenWidth = screen.width;
            const screenHeight = screen.height;

            // Define padding to keep some space from the edges of the screen
            const padding = 20; // Adjust as necessary

            // Calculate the aspect ratio
            const aspectRatio = width / height;

            let newWidth, newHeight;

            if (width > height) {
                // Landscape image, fit the width and adjust height
                newWidth = screenWidth - padding;
                newHeight = (screenWidth - padding) / aspectRatio;
            } else {
                // Portrait image, fit the height and adjust width
                newHeight = screenHeight - padding;
                newWidth = (screenHeight - padding) * aspectRatio;
            }

            // Ensure the image dimensions are within the screen size
            if (newWidth > screenWidth) {
                newWidth = screenWidth - padding;
                newHeight = newWidth / aspectRatio;
            }

            if (newHeight > screenHeight) {
                newHeight = screenHeight - padding;
                newWidth = newHeight * aspectRatio;
            }

            // Set the new dimensions
            setDimensions({ width: newWidth, height: newHeight });
        });


    }, [image, rotation]);
    return (
        loader ? (
            <View style={[styles.addView, styles.top]}>
                <Loader loading={loader || loading} />
            </View>) : (
            <>{(editable && image) && (
                <TouchableOpacity style={styles.edit} onPress={handleToggleBottomSheet}>
                    <Icon name={'edit'} size={hp(3)} color={Colors.neutral1} />
                </TouchableOpacity>)}
                <Text style={[styles.imageTitle, {
                    marginBottom: hp(rotation == '90deg' ? '-10%' : 3)
                }]}>{isVideo(image) ? 'Course Video' : image ? 'Course Image' : 'Course Image/Video'}</Text>
                {isVideo(image) ?
                    <Video
                        source={image?.includes('http') ? { uri: image } : { uri: 'file://' + image }}
                        style={[styles.video]}
                        controls={true}
                        paused={true}
                        resizeMode="contain"
                    /> : image ? (
                        <View style={styles.image}>
                            <Image
                                source={{ uri: image.includes('http') ? image : 'file://' + image }}
                                onLoadStart={() => setLoading(true)}
                                onLoad={() => setLoading(false)}
                                onError={() => setLoading(false)}
                                style={{
                                    alignSelf: "center",
                                    width: dimensions.width,
                                    height: dimensions.height,
                                    resizeMode: 'contain',
                                }}
                            />
                            <LottieView style={styles.loader} source={require('../utils/imageLoading.json')} autoPlay />
                        </View>
                    ) : (
                        editable ?
                            <TouchableOpacity style={styles.addView}
                                onPress={handleToggleBottomSheet}>
                                <Text style={styles.text}>
                                    Add Content
                                </Text>
                            </TouchableOpacity> :
                            <View style={styles.addView} />
                    )
                }
            </>
        )

    );
}

const styles = StyleSheet.create({
    imageTitle: {
        fontFamily: Fonts.bold,
        textAlign: 'center',
        fontSize: hp(2),
        marginTop: hp(2),
        color: '#53382b'
    },
    video: {
        width: wp('100%'), // Full screen width
        height: hp(28),
    },
    image: {
        minHeight: hp(30),
        alignItems: 'center',
        justifyContent: 'center'
    },
    text: {
        fontFamily: Fonts.bold,
        fontSize: wp(4),
        color: Colors.neutral2,
    },
    loader: {
        position: 'absolute',
        zIndex: -1,
        width: wp(24),
        height: wp(24)
    },
    top: {
        marginTop: hp(5)
    },
    addView: {
        backgroundColor: Colors.primary4,
        borderRadius: hp(2),
        height: hp(25),
        width: wp(85),
        marginBottom: hp(3),
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center'
    }
    ,
    edit: {
        position: 'absolute',
        zIndex: 2,
        padding: wp(2),
        borderRadius: wp(1),
        top: hp(10),
        right: wp(5),
        backgroundColor: 'rgba(0,0,0,0.4)'
    }
});

export default ImageCustom;
