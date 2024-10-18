import React from 'react';
import { SafeAreaView, StatusBar, StyleSheet, Text, View, ImageBackground } from 'react-native';
import Button from '../../components/Button';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { bg } from '../../../assets'
import { Fonts } from '../../utils';
import Header from '../../components/Header';
import { Empty } from '../../components';
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
        Title={'Profile'}
        navigation={navigation}
        onPressBack={() => navigation.navigate('Courses')} />
        <Empty/>
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
