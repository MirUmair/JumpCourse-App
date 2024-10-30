import React, { useEffect, useState } from 'react';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import {
  BackHandler, ImageBackground, Keyboard, Linking, SafeAreaView, StatusBar, StyleSheet,
  Text, TouchableOpacity, useColorScheme, View
} from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useDispatch } from 'react-redux';
import { bg1 } from '../../../assets';
import { Button, Input, Loader, Modal } from '../../components';
import { login, signUp } from '../../redux/features/userSlice';
import { AppDispatch } from '../../redux/store';
import { BaseUrl, Fonts, GoogleKey, Screens } from '../../utils';
import { Colors } from '../../theme';

type RootStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
  Home: undefined;
  SignUp: undefined;
};

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;
type LoginScreenRouteProp = RouteProp<RootStackParamList, 'Login'>;

type Props = {
  navigation: LoginScreenNavigationProp;
  route: LoginScreenRouteProp;
};

function Login({ navigation }: Props): React.JSX.Element {
  const [loader, setLoader] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: GoogleKey,
      offlineAccess: true,
    });
    const backAction = () => {
      if (navigation.isFocused()) {
        BackHandler.exitApp();
        return true;
      }
      return false;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [navigation]);

  const googleSignUp = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      let user = userInfo.data?.user
      const userData = {
        email: user?.email,
        password: user?.id,
        navigation,
        setLoader,
      };
      if (user) {
        setLoader(true)
      }
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");
      const raw = JSON.stringify({
        email: user?.email,
        password: user?.id,
      });
      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
      };
      fetch(BaseUrl + "users/login", requestOptions)
        .then((response) => response.json())
        .then((result) => {
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
              dispatch(signUp(userData))
            }
          }
          else {
            dispatch(login(userData))
          }
        })
        .catch((error) => { setLoader(false), console.error(error) });
    } catch (error: any) {
      setLoader(false)
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

  const validateEmail = (email: string) => {
    const emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegEx.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const handleLogin = async () => {
    Keyboard.dismiss()
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
      navigation,
      setLoader,
      setShowMessage,
      setMessage
    };
    dispatch(login(loginData));
  };

  return (
    <SafeAreaView  >
      <StatusBar
        barStyle={'light-content'}
        backgroundColor={Colors.secondary3}
      />
      <Loader loading={loader} />
      <Modal
        visible={showMessage}
        setShowMessage={setShowMessage}
        message={message} />

      <ImageBackground
        source={bg1}
        resizeMode="cover"
        style={styles.image}>

        <View style={styles.inputView}>
          <Input
            focusDesign={true}
            onChangeValue={setEmail}
            placeholderText={'Email'}
            value={email}
            keyboardType="email-address"
          />
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
          <Input
            focusDesign={true}
            onChangeValue={setPassword}
            placeholderText={'Password'}
            value={password}
            isPassword={true}
          />
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
          <Button onPress={handleLogin} Title="Sign in" />
          <Button leftIcon={true} onPress={googleSignUp} Title="Sign in with Google" />
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('ForgotPassword');
            }}
          >
            <Text style={[styles.bottomText, styles.right]}>
              Forgot Password?
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.dontText}
            onPress={() => {
              navigation.navigate(Screens.SignUp)
            }}
          >
            <Text style={[styles.topText, styles.dontHav]}>
              Don't have an account?{' '}
            </Text>
            <Text style={styles.topText}>
              SignUp
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linking}
            onPress={() => {
              Linking.openURL('https://www.spowartholm.ca/')
            }}
          >
            <Text style={[styles.topText, styles.media]}>
              Media by{' '}
            </Text>
            <Text style={[styles.topText, styles.spowart]}>
              SpowartHolm
            </Text>
          </TouchableOpacity>
          <Text style={styles.version}>
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
  dontText: {
    flexDirection: 'row',
    alignSelf: 'center'
  },
  dontHav: {
    fontFamily: Fonts.regular
  },
  topText: {
    alignSelf: 'center',
    color: '#fff',
    fontSize: 17,
    fontFamily: Fonts.bold,
    marginTop: hp(2),
  },
  version: {
    marginBottom: hp(7),
    fontFamily: Fonts.regular,
    fontSize: wp(3),
    color: Colors.neutral1,
    textAlign: 'center'
  },
  media: {
    fontFamily: Fonts.regular,
    fontSize: wp(3),
  },
  spowart: {
    textDecorationLine: 'underline',
    fontSize: wp(3)
  },
  linking: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: hp(1)
  },
  bottomText: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: '#fff',
    marginTop: '5%',
    alignSelf: 'center',
    textAlign: 'center',
  },
  inputView: {
    marginTop: hp(50)
  },
  right: {
    marginRight: '2%'
  },
  image: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
  },
  imageView: {
    marginTop: hp(50)
  },
  errorText: {
    color: 'red',
    alignSelf: 'center',
    fontSize: 14,
  },
});

export default Login;
