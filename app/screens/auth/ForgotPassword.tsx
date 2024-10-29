import React, { useState } from 'react';
import {
  Alert,
  ImageBackground,
  Keyboard,
  Linking,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { bg2 } from '../../../assets';
import { BaseUrl, Fonts, Screens } from '../../utils';
import { useDispatch } from 'react-redux';
import { requestPasswordReset } from '../../redux/features/userSlice';
import { Loader, Input, Button, Modal } from '../../components';
import axios from 'axios';
import { Colors } from '../../theme';

function Login({ navigation }): React.JSX.Element {
  // Move dispatch inside the function component
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loader, setLoader] = useState(false);

  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);

  const handlePasswordResetRequest = async () => {
    Keyboard.dismiss()
    setLoader(true);

    // Validate email
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      setLoader(false);
      return;
    }

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const raw = JSON.stringify({
      "email": email
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow"
    };
    fetch(BaseUrl + "users/requestReset", requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.error) {
          setMessage('2:' + result.message)
          setShowMessage(true)
          setLoader(false),
            //  Alert.alert('Failed', result.message),
            console.log(result.message)
        }
        else {
          setLoader(false),

            setMessage('1:Six digit code sent to your email')
          setShowMessage(true)
          setTimeout(() => {
            navigation.navigate(Screens.ResetPassword, { email }), console.log(result.message)
          }, 2000);
        }

      })
      .catch((error) => { setLoader(false), console.error(error) });

  };

  // Email Validation RegEx (basic validation)
  const validateEmail = (email: string) => {
    const emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegEx.test(email);
  };

  return (
    <SafeAreaView  >
      <StatusBar
        barStyle={'light-content'}
        backgroundColor={Colors.secondary3}
      />
      <Modal visible={showMessage} setShowMessage={setShowMessage} message={message} />

      <Loader loading={loader} />
      <ImageBackground source={bg2} resizeMode="cover" style={styles.image}>

        <View style={{ marginTop: hp('68%') }}>
        </View>
        <Input onChangeValue={setEmail} value={email} focusDesign={true} placeholderText={'Email'} />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

        <Button Title='Submit' onPress={handlePasswordResetRequest} />
        <Text style={[styles.bottomText, { marginRight: '2%' }]}>
        </Text>
        <TouchableOpacity
          style={{ flexDirection: 'row', alignSelf: 'center' }}
          onPress={() => {
            navigation.navigate('SignUp');
          }}
        >
          <Text style={[styles.topText, { fontFamily: Fonts.regular }]}>
            Don't have an account?
          </Text>
          <Text style={styles.topText}>
            SignUp
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flexDirection: 'row', alignSelf: 'center', marginTop: hp(6) }}
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
          marginBottom: hp(8),
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
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  text: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: '#fff',
    width: '90%',
    alignSelf: 'center',
    textAlign: 'center'
  },
  topText: {
    alignSelf: 'center',
    color: '#fff',
    fontSize: 17,
    fontFamily: Fonts.bold,
    textAlign: 'center',
  },
  bottomView: { flexDirection: 'row', width: '60%', alignSelf: 'center', marginTop: '5%' },
  errorText: {
    color: 'red',
    alignSelf: 'center',
    marginBottom: hp(2),
    fontSize: 14,
  },
  bottomText: {
    fontSize: 20,
    fontFamily: Fonts.bold,
    color: '#fff',
    alignSelf: 'center',
    textAlign: 'center'
  },
  image: {
    height: '100%', width: '100%',
    justifyContent: 'center',
  },
});

export default Login;
