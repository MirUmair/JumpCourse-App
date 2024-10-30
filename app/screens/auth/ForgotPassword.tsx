import React, { useState } from 'react';
import {
  ImageBackground,
  Keyboard,
  Linking,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { bg2 } from '../../../assets';
import { Button, Input, Loader, Modal } from '../../components';
import { Colors } from '../../theme';
import { BaseUrl, Fonts, Screens } from '../../utils';

function Login({ navigation }): React.JSX.Element {
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
        console.log(result)
        if (result.error) {
          setMessage('2:' + result.message)
          setShowMessage(true)
          setLoader(false)
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

  const validateEmail = (email: string) => {
    const emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegEx.test(email);
  };

  return (
    <SafeAreaView>
      <StatusBar
        barStyle={'light-content'}
        backgroundColor={Colors.secondary3}
      />
      <Modal
        visible={showMessage}
        setShowMessage={setShowMessage}
        message={message} />
      <Loader
        loading={loader} />
      <ImageBackground
        source={bg2}
        resizeMode="cover"
        style={styles.image}>
        <View style={styles.topView}>
        </View>
        <Input
          onChangeValue={setEmail}
          value={email}
          focusDesign={true}
          placeholderText={'Email'} />
        {emailError ?
          <Text style={styles.errorText}>{emailError}</Text> : null}
        <Button
          Title='Submit'
          onPress={handlePasswordResetRequest} />
        <Text style={[styles.bottomText, styles.right]}>
        </Text>
        <TouchableOpacity
          style={styles.dontText}
          onPress={() => {
            navigation.navigate('SignUp');
          }}
        >
          <Text style={[styles.topText, styles.font]}>
            Don't have an account?
          </Text>
          <Text style={styles.topText}>
            SignUp
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.link}
          onPress={() => {
            Linking.openURL('https://www.spowartholm.ca/')
          }}
        >
          <Text style={[styles.topText, styles.mediaText]}>
            Media by{' '}
          </Text>
          <Text style={[styles.topText, styles.spowart]}>
            SpowartHolm
          </Text>
        </TouchableOpacity>
        <Text style={[styles.version]}>
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
  mediaText: {
    fontFamily: Fonts.regular,
    fontSize: wp(3),
  },
  spowart: {
    textDecorationLine: 'underline',
    fontSize: wp(3)
  },
  link: {
    flexDirection: 'row',
    alignSelf: 'center',
    marginTop: hp(6)
  },
  bottomView:
  {
    flexDirection: 'row',
    width: '60%',
    alignSelf: 'center',
    marginTop: '5%'
  },
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
  right: {

    marginRight: '2%'
  },
  font: {
    fontFamily: Fonts.regular
  },
  dontText: {
    flexDirection: 'row',
    alignSelf: 'center'
  },
  image: {
    height: '100%', width: '100%',
    justifyContent: 'center',
  },
  topView: {
    marginTop: hp('68%')
  },
  version: {
    marginBottom: hp(8),
    fontFamily: Fonts.regular,
    fontSize: wp(3),
    color: Colors.neutral1,
    textAlign: 'center'
  }

});

export default Login;
