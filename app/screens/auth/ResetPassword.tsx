import React, { useState } from 'react';
import {
  ImageBackground,
  Linking,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View
} from 'react-native';
import { heightPercentageToDP as hp ,widthPercentageToDP as wp } from 'react-native-responsive-screen';

import { useDispatch } from 'react-redux';
import { bg2, bg3 } from '../../../assets';
import { Button, Input, Loader } from '../../components';
import { ResetPassword } from '../../redux/features/userSlice';
import { Fonts, Screens } from '../../utils';
import { Colors } from '../../theme';

function Login({ navigation, route }): React.JSX.Element {
  const { email } = route.params;
  const dispatch = useDispatch();
  const [newPassword, setPassword] = useState('');
  const [resetKey, setResetKey] = useState('');
  const [loader, setLoader] = useState(false);
  const isDarkMode = useColorScheme() === 'dark';

  const handlePasswordResetRequest = async () => {
    setLoader(true);
    dispatch(ResetPassword({ email, resetKey, newPassword }))
      .unwrap()
      .then(async (response) => {
        try {
          navigation.navigate(Screens.Login);
          setLoader(false);
        } catch (error) {
          setLoader(false);
          console.error('Failed to handle reset response', error);
        }
      })
  };

  
  return (
    <SafeAreaView >
      <Loader loading={loader} />
      <ImageBackground source={bg3} resizeMode="cover" style={styles.image}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
         />
        <View style={{ marginTop: hp('60%') }}>
        </View>
        <Input onChangeValue={setResetKey} value={resetKey} focusDesign={true} placeholderText={'Enter ^ digit code'} />
        <Input onChangeValue={setPassword} isPassword={true} value={newPassword} focusDesign={true} placeholderText={'New Password'} />
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
            style={{ flexDirection: 'row', alignSelf: 'center',  marginTop: hp(1) }}
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
          <Text style={[{marginBottom: hp(5),
            fontFamily: Fonts.regular, fontSize: wp(3),   
            color: Colors.neutral1,  textAlign:'center'
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
    marginTop: hp(2),
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
