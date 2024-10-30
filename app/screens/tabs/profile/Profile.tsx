import LottieView from 'lottie-react-native';
import React, { useCallback, useState } from 'react';
import { Image, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Header from '../../../components/Header';
import { Colors } from '../../../theme';
import { Fonts, getUser } from '../../../utils';
import { useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScrollView } from 'react-native-gesture-handler';
const Icon = require('react-native-vector-icons/FontAwesome').default;

type RootStackParamList = {
  Home: undefined;
  ForgotPassword: undefined;
};
type User = {
  email: string;
  firstname: string;
  lastname: string;
  phone: string;
  about: string;
  achievement: string;
  skill: string;
  goal: string;
  image?: string;
};
type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;
type Props = {
  navigation: HomeScreenNavigationProp;
};

function Home({ navigation }: Props): React.JSX.Element {
  const [user, setUser] = useState<User | null>(null);
  useFocusEffect(
    useCallback(() => {
      const fetchUser = async () => {
        try {
          let user = await getUser() as User | null
          setUser(user);
          console.log(user);
        } catch (error) {
          console.error('Failed to fetch user:', error);
        }
      };
      fetchUser();
    }, [])
  );
  return (
    <SafeAreaView style={styles.container}>
      <Header
        icon='edit'
        rightIcon={true}
        backIcon={false}
        Title={'Profile'}
        navigation={navigation}
      />
      <ScrollView showsVerticalScrollIndicator={false}  >
        <View style={{ alignItems: 'center' }}>
          <>
            {user?.image ? <><LottieView style={styles.loader} source={require('../../../utils/imageLoading.json')} autoPlay />
              <Image source={{ uri: user?.image }}
                style={{ width: wp(35), marginVertical: hp(2), height: wp(35), borderRadius: wp(35) }} />
            </> :
              <View
                style={styles.ImageStyle}
              >
                <Icon name="user-o" size={hp(7)} color={Colors.neutral1} />
              </View>}
          </>
          <Text style={styles.name}>
            {user?.firstname + " " + user?.lastname}
          </Text>
          <Text style={styles.desc}>
            {user?.about ? '"' : ''}
            {user?.about.trim()}
            {user?.about ? '"' : ''}
          </Text>
          <View style={styles.card}>
            <Text style={styles.heading}>
              Achievement:
            </Text>
            <Text style={styles.text}>
              {user?.achievement
                ? user.achievement.trim()
                  .split('\n')
                  .map((line, index) => (
                    <Text key={index}>{'\u2B24 '}{line}{'\n'}</Text>
                  ))
                : 'N/A'}
            </Text>
            {/* <Text style={styles.text}>
              {'\u2B24 '}{user?.achievement ? user?.achievement : 'N/A'}
            </Text> */}
          </View>
          <View style={styles.card}>
            <Text style={styles.heading}>
              Skills and Strengths:
            </Text>
            <Text style={styles.text}>

              {user?.skill
                ? user.skill.trim()
                  .split('\n')
                  .map((line, index) => (
                    <Text key={index}>{'\u2B24 '}{line}{'\n'}</Text>
                  ))
                : 'N/A'}
            </Text>
            {/* <Text style={styles.text}>
              {'\u2B24 '}{user?.skill ? user?.skill : 'N/A'}

            </Text> */}
          </View>
          <View style={styles.card}>
            <Text style={styles.heading}>
              Goals and Aspirations:
            </Text>
            <Text style={styles.text}>
              {user?.goal
                ? user.goal.trim()
                  .split('\n')
                  .map((line, index) => (
                    <Text key={index}>{'\u2B24 '}{line}{'\n'}</Text>
                  ))
                : 'N/A'}
            </Text>
            {/* <Text style={styles.text}>
              {'\u2B24 '}{user?.goal ? user?.goal : 'N/A'}

            </Text> */}
          </View>
          <View style={styles.card}>
            <Text style={styles.heading}>
              Contact Information:
            </Text>
            <View style={{ flexDirection: 'row' }}>
              <Text style={styles.textHeading}>
                Email:
              </Text>
              <Text style={[styles.text, { width: wp(77), }]}>
                {user?.email}
              </Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              {user?.phone && <>
                <Text style={[styles.textHeading,]}>
                  Phone#:
                </Text>
                <Text style={[styles.text, { width: wp(77) }]}>
                  {user?.phone}
                </Text>
              </>}

            </View>
          </View>
          <Text style={styles.heading}>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.neutral1
  },
  loader: {
    position: 'absolute',
    zIndex: -1,
    width: wp(24),
    height: wp(24),
    marginTop: hp(5)
  },
  ImageStyle: {
    width: wp(35),
    height: wp(35),
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: hp(2),
    backgroundColor: Colors.secondary3,
    borderRadius: wp(35),
    resizeMode: 'contain'
  },
  name: {
    color: Colors.secondary3,
    fontFamily: Fonts.bold,
    fontSize: hp(2.4)
  },
  desc: {
    color: Colors.secondary3,
    fontFamily: Fonts.regular,
    marginTop: hp(2),
    fontSize: hp(1.5),
    width: wp(90),
    textAlign: 'center'
  },
  card: {
    width: wp(90),
    marginTop: hp(3),
    borderRadius: wp(2),
    backgroundColor: Colors.primary4,
    padding: wp(3)
  },
  heading: { color: Colors.secondary3, fontFamily: Fonts.bold, fontSize: hp(1.5) },
  textHeading: { color: Colors.secondary3, fontFamily: Fonts.bold, fontSize: hp(1.3), marginRight: wp(1), marginTop: hp(1) },

  text: { color: Colors.secondary3, fontFamily: Fonts.regular, fontSize: hp(1.3), width: wp(85), marginTop: hp(1) }
});

export default Home;
