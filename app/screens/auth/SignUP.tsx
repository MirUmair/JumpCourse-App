
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { Alert, ImageBackground, Keyboard, Linking, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useDispatch } from 'react-redux';
import { bg5 } from '../../../assets';
import { Loader, Button, Input, Modal } from '../../components';
import { login, signUp } from '../../redux/features/userSlice';
import { AppDispatch } from '../../redux/store';
import { BaseUrl, Fonts, Screens } from '../../utils';
import { Colors } from '../../theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
};
type SignUpScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignUp'>;
type Props = {
  navigation: SignUpScreenNavigationProp;
};
function SignUp({ navigation }: Props): React.JSX.Element {

  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState('');
  const [firstname, setfirstname] = useState('');
  const [lastname, setlastname] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [firstnameError, setfirstnameError] = useState('');
  const [lastnameError, setlastnameError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [loader, setLoader] = useState(false);
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);


  const validateEmail = (email: string) => {
    const emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegEx.test(email);
  };
  const validatePassword = (password: string) => {
    return password.length >= 6;
  };
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '150267601582-1ukkjos3mortbdpe8o5bude67cu278e5.apps.googleusercontent.com', //'231913951546-cgs1o3mdmn5uv6jcpeusgqarh7quajvi.apps.googleusercontent.com', // From the Google Cloud Console
      offlineAccess: true,
      // forceCodeForRefreshToken: true,
    });
  }, []);

  const googleSignUp = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log('User Info: ', userInfo.data?.user);
      let user = userInfo.data?.user
      if (user) {
        setLoader(true)
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const raw = JSON.stringify({
          email: user.email,
          password: user.id,
          firstname: user.givenName || 'null',
          lastname: user.familyName || 'null',
        });

        const requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow"
        };

        fetch(BaseUrl + "users/register", requestOptions)
          .then((response) => response.json())
          .then(async (result) => {
             if (result?.message == 'User already exists') {
              const loginData = {
                email: user.email,
                password: user.id,
                navigation, // Pass the navigation object to the thunk
                setLoader,  // Pass the loader control function to the thunk
              };
              dispatch(login(loginData));
            }
            else {
              // Alert.alert('User Registered Successfully!');
              setMessage('1:User Registered Successfully!')
              setShowMessage(true)
              await AsyncStorage.setItem('userToken', result.token);
              navigation.navigate(Screens.Video, { targetScreen: Screens.Home });
            }
          })
          .catch((error) => console.error(error));

      }
      return
    } catch (error: any) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('User cancelled the login');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Sign in is in progress');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play services not available');
      } else {
        console.error(error);
      }
    }
  };
  const handleSignUp = () => {
    Keyboard.dismiss()
    setLoader(true)
    setEmailError('');
    setfirstnameError('');
    setlastnameError('');
    setPasswordError('');
    let isValid = true;
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
    }
    if (firstname === '') {
      setfirstnameError('Enter First name');
      isValid = false;
    }
    if (lastname === '') {
      setlastnameError('Enter Last name');
      isValid = false;
    }
    if (!validatePassword(password)) {
      setPasswordError('Password must be at least 6 characters.');
      isValid = false;
    }
    if (!isValid) return;
    const userData = {
      email,
      password,
      firstname,
      lastname,
      navigation,  
      setLoader, 
      setShowMessage,
      setMessage
     };
    dispatch(signUp(userData))
  };

  return (
    <SafeAreaView keyboardShouldPersistTaps={'handled'} >
       <StatusBar
                barStyle={'light-content'}
                backgroundColor={Colors.secondary3}
            />
      <Loader loading={loader} />
      <Modal visible={showMessage} setShowMessage={setShowMessage} message={message}/>

      <ImageBackground source={bg5} resizeMode="cover" style={styles.image}>
        <View style={{ marginTop: hp('25%') }}>
          <Input focusDesign={true} placeholderText={'Email'} onChangeValue={setEmail} value={email} keyboardType="email-address" />
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

          <Input focusDesign={true} placeholderText={'First Name'} onChangeValue={setfirstname} value={firstname} />
          {firstnameError ? <Text style={styles.errorText}>{firstnameError}</Text> : null}

          <Input focusDesign={true} placeholderText={'Last Name'} onChangeValue={setlastname} value={lastname} />
          {lastnameError ? <Text style={styles.errorText}>{lastnameError}</Text> : null}

          <Input focusDesign={true} placeholderText={'Password'} onChangeValue={setPassword} value={password} isPassword={true} />
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
          <Button onPress={handleSignUp} Title="Sign Up" />
          <View style={{ flexDirection: 'row', marginTop: hp(3), alignSelf: 'center', width: wp(90), alignItems: 'center', justifyContent: 'center' }}>
            <View style={styles.line} />
             
            <Text style={styles.bottomText}>OR</Text>
             
            <View style={styles.line} />

          </View>
          <Button leftIcon={true} onPress={googleSignUp} Title="Sign up with Google" />
          <View style={styles.bottomView}>
            <Text style={[styles.bottomText, { marginRight: '2%' }]}>Have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.bottomText}>Login</Text>
            </TouchableOpacity>
          </View>

        </View>
        <TouchableOpacity
          style={{ flexDirection: 'row', alignSelf: 'center', marginTop: hp(1) }}
          onPress={() => {
            Linking.openURL('https://www.spowartholm.ca/')
          }}
        >
          <Text style={[styles.topText, { fontFamily: Fonts.regular, fontSize: wp(3), }]}>
            Media by{' '}
          </Text>
          <Text style={[styles.topText, { textDecorationLine: 'underline', fontSize: wp(3) }]}>
            SpowartHolm
          </Text>

        </TouchableOpacity>
        <Text style={[{
          fontFamily: Fonts.regular, fontSize: wp(3),
          color: Colors.neutral1, textAlign: 'center'
        }]}>
          © 2024, used with permission.
        </Text>
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
  line: {
    flex: 1,              // This makes the line take up all available space
    height: 1,
    // The height of the line
    backgroundColor: '#fff', // Line color (you can change to any color you prefer)
    marginHorizontal: 10,  // Margin between the text and the line
  },
  orText: {
    fontSize: 16,         // Size of the OR text
    fontWeight: 'bold',   // Styling for the text
    color: '#000',        // Text color
  },
  topText: {
    alignSelf: 'center',
    color: '#fff',
    fontFamily: Fonts.bold,
    marginTop: '10%',
  },
  bottomView: { flexDirection: 'row', width: '60%', alignSelf: 'center', marginTop: '5%' },
  bottomText: {
    fontSize: wp(4.5),
    fontFamily: Fonts.bold,
    color: '#fff',
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
    marginBottom: hp(0.5),
    fontSize: 14,
  },
});

export default SignUp;
