
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useEffect, useState } from 'react';
import { Alert, Image, ImageBackground, Keyboard, Linking, SafeAreaView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useDispatch } from 'react-redux';
import { bg5 } from '../../../../assets';
import { Loader, Button, Input, Modal, Header } from '../../../components';
import { login, signUp } from '../../../redux/features/userSlice';
import { AppDispatch } from '../../../redux/store';
import { BaseUrl, Fonts, getUser, Screens } from '../../../utils';
import { Colors } from '../../../theme';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';
import { ScrollView } from 'react-native-gesture-handler';

type RootStackParamList = {
  Login: undefined;
  SignUp: undefined;
};
type SignUpScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SignUp'>;
type Props = {
  navigation: SignUpScreenNavigationProp;
};
function SignUp({ navigation }: Props): React.JSX.Element {
  const [userImage, setUserImage] = useState(null);


  useEffect(() => {
    setLoader(true)
    const fetchUser = async () => {
      try {
        let user = await getUser(); // Assuming getUser is an async function
        setfirstname(user?.firstname)
        setlastname(user?.lastname)
        setEmail(user?.email)
        setUserImage(user?.image)
        setAchievement(user?.achievement)
        setGoals(user?.goal)
        setSkills(user?.skill)
        setPhone(user?.phone)
        setAbout(user?.about)
        setLoader(false)
      } catch (error) {
        setLoader(false)
        console.error('Failed to fetch user:', error);
      }
    };

    fetchUser(); // Call the async function
  }, []);
  const dispatch = useDispatch<AppDispatch>();
  const [image, setImage] = useState({});

  const [email, setEmail] = useState('');
  const [firstname, setfirstname] = useState('');
  const [lastname, setlastname] = useState('');
   const [emailError, setEmailError] = useState('');
  const [firstnameError, setfirstnameError] = useState('');
  const [lastnameError, setlastnameError] = useState('');
  const [achievement, setAchievement] = useState('');
  const [skills, setSkills] = useState('');
  const [goals, setGoals] = useState('');

  const [about, setAbout] = useState('');
  const [phone, setPhone] = useState('');
  const [loader, setLoader] = useState(false);
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);


  const validateEmail = (email: string) => {
    const emailRegEx = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegEx.test(email);
  };


  useEffect(() => { console.log(image) }, [image])
  const imagePicker = () => {

    setShowMessage(true)
    setMessage('6:Would you like to take a photo or upload?')
  }
  const handleSignUp = async () => {
    Keyboard.dismiss()
    setLoader(true)

    setEmailError('');
    setfirstnameError('');
    setlastnameError('');
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

    if (!isValid) return;
    let user = await getUser()
    const formdata = new FormData();
    formdata.append("email", email);
    formdata.append("firstname", firstname);
    formdata.append("lastname", lastname);
    formdata.append("achievement", achievement);
    formdata.append("goal", goals);
    formdata.append("skill", skills);
    formdata.append("about", about);
    formdata.append("phone", phone);
    if (image.uri) {
      formdata.append('image', {
        uri: image.uri, // Correct file URI for React Native
        name: image.fileName, // File name
        type: image.type, // MIME type
      });
    }

    const requestOptions = {
      method: "PUT",
      body: formdata,
      redirect: "follow"
    };
    fetch(BaseUrl + "users/" + user._id, requestOptions)
      .then((response) => response.json())
      .then(async (result) => {
        setMessage('1:User Updated Successfully!')
        setLoader(false), await AsyncStorage.setItem('user', JSON.stringify(result));
        setShowMessage(true)
        setTimeout(() => {
          setShowMessage(false)
          setTimeout(() => {
            navigation.goBack()

          }, 500);
        }, 1500);
        console.log(result)
      })
      .catch((error) => { setLoader(false), console.error(error) });





  };

  return (
    <SafeAreaView keyboardShouldPersistTaps={'handled'} >
      <Modal visible={showMessage} setImage={setImage} setShowMessage={setShowMessage} message={message} />

      <StatusBar
        barStyle={'light-content'}
        backgroundColor={Colors.secondary3}
      />
      <Loader loading={loader} />
      <Header
        Title={'Edit Profile'}
        navigation={navigation}
      />
      <ScrollView keyboardShouldPersistTaps={'handled'} showsVerticalScrollIndicator={false}>
        <View style={{ alignItems: 'center', height: '100%', backgroundColor: Colors.neutral1 }} >
          <TouchableOpacity onPress={imagePicker} style={styles.ImageStyle}>
            {(userImage || image?.uri) ? <Image
              source={{ uri: image?.uri ? image?.uri : userImage }}

              style={{ width: wp(35), height: wp(35), borderRadius: wp(35) }}></Image> : <Icon name="user-o" size={hp(7)} color={Colors.neutral1}></Icon>}
          </TouchableOpacity>

          <Input placeholderText={'Email'} style={{ backgroundColor: Colors.primary4 }} onChangeValue={setEmail} value={email} keyboardType="email-address" />
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

          <Input placeholderText={'First Name'} onChangeValue={setfirstname} value={firstname} />
          {firstnameError ? <Text style={styles.errorText}>{firstnameError}</Text> : null}

          <Input placeholderText={'Last Name'} onChangeValue={setlastname} value={lastname} />
          {lastnameError ? <Text style={styles.errorText}>{lastnameError}</Text> : null}
          <Input onChangeValue={setPhone} value={phone} placeholderText={'Phone #'} />
          <Input multiLine={true} onChangeValue={setAbout} value={about} style={styles.multi} placeholderText={'About me'} />

          <Input multiLine={true} onChangeValue={setAchievement} value={achievement} style={styles.multi} placeholderText={'Achievement'} keyboardType="email-address" />
          <Input multiLine={true} onChangeValue={setSkills} value={skills} style={styles.multi} placeholderText={'Skills and Strengths'} />
          <Input multiLine={true} onChangeValue={setGoals} value={goals} style={styles.multi} placeholderText={'Goals and Aspirations'} />
          <Button style={{ backgroundColor: Colors.secondary3 }} textStyle={{ color: Colors.neutral1 }} onPress={handleSignUp} Title="Update changes" />
          <View style={{ height: hp(15) }}></View>
        </View>
      </ScrollView>
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
  ImageStyle: { width: wp(35), height: wp(35), alignItems: 'center', justifyContent: 'center', marginVertical: hp(2), backgroundColor: Colors.secondary3, borderRadius: wp(35), resizeMode: 'contain' },

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
  multi: { textAlignVertical: 'top' },
  errorText: {
    color: 'red',
    alignSelf: 'center',
    marginBottom: hp(0.5),
    fontSize: 14,
  },
});

export default SignUp;
