import React, {useEffect, useState} from 'react';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import {RouteProp} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {
  BackHandler,
  ImageBackground,
  Linking,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native'; // Import BackHandler
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {useDispatch} from 'react-redux';
import {bg1} from '../../../assets';
import {Button, Input, Loader, Modal} from '../../components';
import {login, signUp} from '../../redux/features/userSlice'; // Import the login action
import {AppDispatch} from '../../redux/store'; // Import types for state and dispatch
import {BaseUrl, Fonts, Screens} from '../../utils'; // Fonts
import {Colors} from '../../theme';

type RootStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
  Home: undefined; // Assuming Home is part of navigation
  SignUp: undefined;
};

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'Login'
>;
type LoginScreenRouteProp = RouteProp<RootStackParamList, 'Login'>;

type Props = {
  navigation: LoginScreenNavigationProp;
  route: LoginScreenRouteProp;
};

function Login({navigation}: Props): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [loader, setLoader] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.neutral2 : Colors.neutral1,
  };
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    GoogleSignin.configure({
      iosClientId:
        '150267601582-6vs2t1d5j9331ihslkn3bmkbua8jepbg.apps.googleusercontent.com', // your iOS client ID
      webClientId:
        '150267601582-1ukkjos3mortbdpe8o5bude67cu278e5.apps.googleusercontent.com', //'231913951546-cgs1o3mdmn5uv6jcpeusgqarh7quajvi.apps.googleusercontent.com', // From the Google Cloud Console
      offlineAccess: true,
    });
    const backAction = () => {
      if (navigation.isFocused()) {
        BackHandler.exitApp();
        return true;
      }
      return false;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, [navigation]);

  const googleSignUp = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      let user = userInfo.data?.user;
      const userData = {
        email: user?.email,
        password: user?.id,
        navigation,
        setLoader,
      };
      //
      const myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');
      const raw = JSON.stringify({
        email: user?.email,
        password: user?.id,
      });
      const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
      };
      fetch(BaseUrl + 'users/login', requestOptions)
        .then(response => response.json())
        .then(result => {
          if (result?.message === 'User not found') {
            if (user) {
              const userData = {
                type: 'social',
                email: user.email,
                password: user.id,
                firstname: user.givenName || 'null',
                lastname: user.familyName || 'null',
                navigation,
                setLoader,
              };
              dispatch(signUp(userData));
            }
          } else {
            dispatch(login(userData));
          }
        })
        .catch(error => console.error(error));
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled the login');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Sign in is in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play services not available');
      } else {
        console.log('error', JSON.stringify(error));
      }
    }
  };

  // Email Validation RegEx (basic validation)
  const validateEmail = (email: string) => {
    const emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegEx.test(email);
  };

  // Password validation (minimum 6 characters)
  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleLogin = async () => {
    setEmailError('');
    setPasswordError('');
    let isValid = true;
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
    }
    if (!validatePassword(password)) {
      setPasswordError('Password must be at least 6 characters.');
      isValid = false;
    }
    if (!isValid) {
      return;
    }
    const loginData = {
      email,
      password,
      navigation, // Pass the navigation object to the thunk
      setLoader, // Pass the loader control function to the thunk
    };
    dispatch(login(loginData));
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <Loader loading={loader} />
      <ImageBackground source={bg1} resizeMode="cover" style={styles.image}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor={backgroundStyle.backgroundColor}
        />
        <View style={{marginTop: hp(50)}}>
          <Input
            focusDesign={true}
            onChangeValue={setEmail}
            placeholderText={'Email'}
            value={email}
            keyboardType="email-address"
          />
          {emailError ? (
            <Text style={styles.errorText}>{emailError}</Text>
          ) : null}
          <Input
            focusDesign={true}
            onChangeValue={setPassword}
            placeholderText={'Password'}
            value={password}
            isPassword={true}
          />
          {passwordError ? (
            <Text style={styles.errorText}>{passwordError}</Text>
          ) : null}
          <Button onPress={handleLogin} Title="Sign in" />
          <Button
            leftIcon={true}
            onPress={googleSignUp}
            Title="Sign in with Google"
          />

          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ForgotPassword');
            }}>
            <Text style={[styles.bottomText, {marginRight: '2%'}]}>
              Forgot Password?
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{flexDirection: 'row', alignSelf: 'center'}}
            onPress={() => {
              navigation.navigate(Screens.SignUp);
            }}>
            <Text style={[styles.topText, {fontFamily: Fonts.regular}]}>
              Don't have an account?{' '}
            </Text>
            <Text style={styles.topText}>SignUp</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignSelf: 'center',
              marginTop: hp(1),
            }}
            onPress={() => {
              Linking.openURL('https://www.spowartholm.ca/');
            }}>
            <Text
              style={[
                styles.topText,
                {fontFamily: Fonts.regular, fontSize: wp(3)},
              ]}>
              Media by{' '}
            </Text>
            <Text
              style={[
                styles.topText,
                {textDecorationLine: 'underline', fontSize: wp(3)},
              ]}>
              SpowartHolm
            </Text>
          </TouchableOpacity>
          <Text
            style={[
              {
                marginBottom: hp(5),
                fontFamily: Fonts.regular,
                fontSize: wp(3),
                color: Colors.neutral1,
                textAlign: 'center',
              },
            ]}>
            © 2024, used with permission.
          </Text>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: '#fff',
    width: '90%',
    alignSelf: 'center',
    textAlign: 'center',
  },
  topText: {
    alignSelf: 'center',
    color: '#fff',
    fontSize: 17,
    fontFamily: Fonts.bold,
    marginTop: hp(2),
  },
  bottomText: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: '#fff',
    marginTop: '5%',
    alignSelf: 'center',
    textAlign: 'center',
  },
  image: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
  },
  errorText: {
    color: 'red',
    alignSelf: 'center',
    marginBottom: hp(2),
    fontSize: 14,
  },
});

export default Login;
