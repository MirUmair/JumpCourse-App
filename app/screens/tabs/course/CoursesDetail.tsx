import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, ScrollView, Alert, Dimensions } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { map } from '../../../../assets';
import { Image, ObstaclesHorizantal } from '../../../components';
import Header from '../../../components/Header';
import { BaseUrlImage, Fonts } from '../../../utils';
import { Colors } from '../../../theme';

type RootStackParamList = {
  Home: undefined;
  ForgotPassword: undefined;
};

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

function CourseDetail({ navigation, route }: Props): React.JSX.Element {
  const { course } = route.params || {};
  console.log(JSON.stringify(course))
  const [imageHeight, setImageHeight] = useState(200); // Default image height

  const [rotation, setRotation] = useState('0deg'); // Default rotation
  const screenWidth = Dimensions.get('window').width; // Get screen width

  const handleImageLoad = (event) => {
    const { width, height } = event.nativeEvent.source;
    console.log(width, height)
    const aspectRatio = height / width;
    const calculatedHeight = screenWidth * aspectRatio;

    // Update image height based on calculated value
    setImageHeight(calculatedHeight);
    // Rotate image based on its dimensions
    if (width > height) {
      setRotation('0deg'); // Rotate 90 degrees for landscape images
    } else {
      setRotation('90deg'); // No rotation for portrait images
    }
  };
  return (
    <SafeAreaView style={styles.Container}>
      <Header Title='Course Details' navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Image image={course.courseImage} />
        <View style={styles.MainContainer}>
          <View style={styles.CourseDetail}>
            <Text style={styles.textStyle}>Course Name:</Text>
            <Text style={styles.textStyle}>{course.name}</Text>
          </View>
          <View style={styles.CourseDetail}>
            <Text style={styles.textStyle}>Date:</Text>
            <Text style={styles.textStyle}>{course.date}</Text>
          </View>
          {/* <View style={styles.CourseDetail}>
            <Text style={styles.textStyle}>Designed By:</Text>
            <Text style={styles.textStyle}>{course.courseDesigner}</Text>
          </View> */}
          <View style={styles.CourseDetail}>
            <Text style={styles.textStyle}>Venue:</Text>
            <Text style={styles.textStyle}>{course.venue}</Text>
          </View>
          <View style={styles.CourseDetail}>
            <Text style={styles.textStyle}>Max. Time Allowed:</Text>
            <Text style={styles.textStyle}>{course.timeAllowed}</Text>
          </View>
          <ObstaclesHorizantal obstacles={course.obstacles} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: Colors.neutral1
  },
  MainContainer: {
    backgroundColor: Colors.neutral1,
    marginBottom: hp(9),
    paddingHorizontal: wp(6),
    paddingTop: hp(2),
  },
  textStyle: {
    fontFamily: Fonts.bold,
    fontSize: wp(3),
    color: '#000',
  },
  image: {
    height: hp(40),
    width: wp(95),
    marginVertical: hp(3),
    alignSelf: 'center',
  },
  topImage: {
    resizeMode: 'contain',
    maxHeight: hp(45),
    // backgroundColor: Colors.primary4
  },
  CourseDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(0.4),
  },
});

export default CourseDetail;
