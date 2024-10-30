import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Empty } from '../../components';
import Header from '../../components/Header';
import { Colors } from '../../theme';
import { Fonts } from '../../utils';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
type RootStackParamList = {
  Home: undefined;
  ForgotPassword: undefined;
};

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Home'>;

type Props = {
  navigation: HomeScreenNavigationProp;
};

function Home({ navigation }: Props): React.JSX.Element {
  const isDarkMode = 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };


  return (
    <SafeAreaView style={backgroundStyle}>
      <Header
        backIcon={false}
        Title={'Notifications'}
        navigation={navigation}
        onPressBack={() => navigation.navigate('Courses')} />
      <Empty />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  welcomeText: {
    fontSize: hp(4),

    color: '#fff',
    textAlign: 'center',
    fontFamily: Fonts.bold,
  },
  nameText: {
    fontSize: 15,
    color: '#fff',
    marginLeft: wp(6),
    fontFamily: Fonts.medium,

  },
  buttonContainer: {
    marginTop: hp(40),
    marginBottom: hp(20),
  },
  image: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
  },
});

export default Home;
