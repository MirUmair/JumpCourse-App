import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { Dimensions, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Image, ObstaclesHorizantal } from '../../../components';
import Header from '../../../components/Header';
import { Colors } from '../../../theme';
import { Fonts } from '../../../utils';

type RootStackParamList = {
  Home: undefined;
  ForgotPassword: undefined;
};

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
  route: any
};

function CourseDetail({ navigation, route }: Props): React.JSX.Element {
  const { course } = route.params || {};
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
  },
  CourseDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: hp(0.4),
  },
});

export default CourseDetail;
