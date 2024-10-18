import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert } from 'react-native';
import Video from 'react-native-video';
import { useNavigation } from '@react-navigation/native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { video, video1 } from '../../../assets';
import { Colors } from '../../theme';
import { Fonts, Screens } from '../../utils';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../redux/store';
import Icon from 'react-native-vector-icons/Ionicons';
import { loadTokenFromStorage } from '../../redux/features/userSlice';

const VideoScreen = ({ navigation, route }: any) => {
  const targetScreen = route?.params?.targetScreen || '';

  const dispatch = useDispatch<AppDispatch>();
  const handleSkip = () => {
    if (targetScreen == Screens.Home) {
      dispatch(loadTokenFromStorage());
    }
    else {
      navigation.navigate(Screens.Login)
    }
  };
  return (
    <View style={styles.container}>
      <Video
        source={targetScreen == Screens.Home ? video : video1} // Replace with your video URL
        style={[styles.video,{height:targetScreen != Screens.Home?'81%':'100%'}]}
        controls={false}
        resizeMode="cover"
        onEnd={handleSkip}
      />
       <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
            <Icon name={'arrow-forward'} size={hp(3)} color={Colors.neutral1} />
          </TouchableOpacity>
      {targetScreen != Screens.Home && <>
        <View style={styles.overlay}>
          <Text style={styles.title}>JUMPING COURSE APPLICATION</Text>
        </View>
        <View style={styles.textBox}>
          <Text style={styles.description}>
            The application is designed for horse riders, course designers, and event organizers. This mobile app allows riders to manage jumping courses, including adding course details, uploading images, and viewing course information.
          </Text>
        </View>
      </>}
    </View>
  );
};

// Define styles using wp and hp for responsive design
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: wp('100%'), // Full screen width
    height: hp('100%'), // Full screen height
    position:'absolute',
     top: 0,
    left: 0,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: hp(20),
    justifyContent: 'flex-end',
    padding: wp('5%'),
  },
  textBox: {
    position: 'absolute', bottom: 0,
    zIndex: 2,
    backgroundColor: Colors.neutral1,
    height:'21%',
    borderTopLeftRadius: wp(2),
    borderTopRightRadius: wp(2),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.46,
    shadowRadius: 11.14,
    elevation: 17,
    padding: wp('5%'), // Responsive padding
  },
  title: {
    fontSize: wp('6%'), // Responsive font size
    color: Colors.neutral1, // Dark text color
    width: wp('50%'),
    fontFamily: Fonts.bold,

  },
  description: {
    fontSize: wp('4%'), // Responsive font size
    color: '#333',
    fontFamily: Fonts.regular,
    textAlign: 'center',
  },
  skipButton: {
    position: 'absolute',
    flexDirection: 'row',
    top: hp(2),
    right: hp(2)
  },
  skipText: {
    color: Colors.neutral1,
    fontSize: wp('4.5%'), // Responsive font size
    fontWeight: 'bold',
  },
});

export default VideoScreen;
