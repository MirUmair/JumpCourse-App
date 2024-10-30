import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, Image, Keyboard, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useFocusEffect } from '@react-navigation/native';
import RNRestart from 'react-native-restart';
import { useDispatch, useSelector } from 'react-redux';
import { arrow, emptyIconRider } from '../../../../assets';
import { BottomSheet, Cards, Header, Loader, Modal } from '../../../components'; // Assuming you have these components
import { deleteCourse, getCoursesByUser } from '../../../redux/features/courseSlice';
import { AppDispatch, RootState } from '../../../redux/store';
import { Colors } from '../../../theme';
import { Fonts, Screens } from '../../../utils';

const Home = ({ navigation }) => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [refreshing, setRefreshing] = useState(true);
  const bottomSheetRef = useRef(null);
  const dispatch = useDispatch<AppDispatch>();
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState(':');
  const { courses, status } = useSelector((state: RootState) => state.course);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilteredCourses] = useState([]);
  useEffect(() => {
    setRefreshing(true)
  }, []);
  useEffect(() => {
    setFilteredCourses(courses);
  }, [courses]);

  const filterCourses = () => {
    Keyboard.dismiss()
    setRefreshing(true);
    const newCourse = courses.filter((course) =>
      course.name.includes(searchTerm)
    );
    setFilteredCourses(newCourse);
    setTimeout(() => {
      setRefreshing(false)
    }, 500);
  };
  const handleLogout = () => {
    setRefreshing(true);
    AsyncStorage.removeItem('userToken')
    AsyncStorage.removeItem('user')
    handleLogoutGmail()
    setTimeout(() => {
      RNRestart.Restart();
    }, 1000);

  };


  const handleLogoutGmail = async () => {
    try {

      await GoogleSignin.revokeAccess(); // optional
      await GoogleSignin.signOut();
      console.log('User logged out successfully');

    } catch (error) {
      console.error('Error logging out: ', error);
    }
  };
  useFocusEffect(
    useCallback(() => {
      setRefreshing(true)
      dispatch(getCoursesByUser());
      setRefreshing(false)
      return () => {
        bottomSheetRef?.current?.close()
      };
    }, [dispatch])
  );
  const handleRefresh = async () => {
    setRefreshing(true);
    await dispatch(getCoursesByUser());
    setRefreshing(false);
  };
  const handleToggleBottomSheet = useCallback(() => {
    bottomSheetRef.current?.snapToIndex(1);
  }, []);

  const handleDeleteCourse = () => {
    setShowMessage(false)
    setRefreshing(true)
    dispatch(deleteCourse(selectedCourse._id));
    setTimeout(() => {
      setMessage('1:Course deleted Successfully!')
      setRefreshing(false)
      setShowMessage(true)
    }, 1000);
  };
  const openCourseOptions = (course) => {
    setSelectedCourse(course);
    setShowMessage(true);
    setMessage('5:Do you want to Edit or delete ' + course.name)
  };

  const handleEditCourse = () => {
    setShowMessage(false)
    navigation.navigate(Screens.EditCourse, { course: selectedCourse });
  };

  const renderCourseItem = ({ item, index }) => (
    <TouchableOpacity onPress={() => {
      navigation.navigate(Screens.CourseDetails, { course: item })
    }
    }
      onLongPress={() => openCourseOptions(item)}>
      <Cards navigation={navigation} item={item} />
    </TouchableOpacity>
  );
  const EmptyListComponent = () => (
    <View style={styles.emptyContainer}>
      <Image
        source={emptyIconRider}
        style={styles?.ImageStyle}
      />
      <Text style={styles.emptyText}>It looks like you haven’t added any courses yet. Start by adding your first course to keep track of your progress.</Text>
      <Image
        source={arrow}
        style={styles?.arrowStyle}
      />
    </View>
  );
  return (
    <SafeAreaView style={styles.container}>
      <Modal visible={showMessage} setShowMessage={setShowMessage} message={message} onEdit={handleEditCourse}
        onDelete={handleDeleteCourse} />
      <Header icon='log-out' Title="Courses" backIcon={true} onPressBack={() => handleLogout()} />
      <View style={styles.inputContainer}>
        <Icon name="search" size={hp(2)} color={Colors.secondary3} style={{ padding: wp(1) }} />
        <TextInput
          style={styles.input}
          placeholder="Search"
          onChangeText={(i) => setSearchTerm(i)}
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity onPress={filterCourses}>
          <FontAwesome name="send" size={hp(2)} color={Colors.secondary3} style={{ padding: wp(1) }} />
        </TouchableOpacity>
      </View>
      {refreshing ? (
        <Loader loading={true} />
      ) : (
        <FlatList
          style={styles.courseList}
          showsVerticalScrollIndicator={false}
          data={filterCourse}
          renderItem={renderCourseItem}
          keyExtractor={(item) => item._id.toString()}
          refreshing={false}
          onRefresh={handleRefresh}
          ListEmptyComponent={EmptyListComponent}
        />
      )}
      <TouchableOpacity style={styles.iconStyle} onPress={handleToggleBottomSheet}>
        <Icon name={'add-circle'} size={hp(8.5)} color={Colors.secondary3} />
      </TouchableOpacity>
      <BottomSheet
        isSkip={true}
        setLoader={setRefreshing}
        bottomSheetRef={bottomSheetRef}
        navigation={navigation} />
    </SafeAreaView>
  );
};




const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    width: wp(90), alignSelf: 'center',
    borderColor: '#ccc',
    backgroundColor: 'rgba(0,0,0,0)',
    margin: hp(1), marginTop: hp(1.9), justifyContent: 'center',
    borderRadius: hp(3), // Rounded edges
    paddingHorizontal: hp(1),
    height: hp(4), // Adjust as needed
  },
  searchIcon: {
    padding: 5,
  },
  input: {
    flex: 1,
    fontSize: wp(3.3),
    color: '#000',
    padding: hp(0.5)

  },
  container: {
    flex: 1,
    backgroundColor: Colors.neutral1,
  },
  courseList: {
    paddingTop: hp(1),
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconStyle: {
    position: 'absolute',
    top: hp('77%'),
    right: wp('3%'),
    borderRadius: hp(5),
    backgroundColor: Colors.neutral1
  },
  bottomSheet: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.58,
    shadowRadius: 16.00,
    elevation: 24,
    borderTopColor: Colors.primary4,
    borderTopWidth: wp(1),
  },
  contentContainer: {
    backgroundColor: Colors.neutral1,
    alignItems: 'center',
    height: '45%',
    justifyContent: 'center',
  },
  icon: {
    width: wp(20),
    height: wp(20),
    borderRadius: wp(10),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.secondary3,
  },
  emptyContainer: { alignItems: 'center', justifyContent: 'center' },
  ImageStyle: {
    height: hp(20),
    resizeMode: 'contain', marginTop: hp(12)
  },
  arrowStyle: {
    height: hp(18), width: wp(37), marginTop: hp(2.5), alignSelf: 'flex-end',
    resizeMode: 'contain',
  },
  emptyText:
  {
    fontSize: hp(1.6), lineHeight: hp(2.5),
    color: Colors.secondary3,

    width: wp(85), textAlign: 'center',
    fontFamily: Fonts.medium,
  },
  nameText: {
    fontSize: hp(2),
    color: Colors.secondary3,
    marginTop: hp(1),
    fontFamily: Fonts.medium,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: wp(80),
    padding: hp(3),
    backgroundColor: Colors.primary2,
    borderRadius: hp(2),
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: hp(2.5),
    fontWeight: 'bold',
    color: Colors.secondary3,
    marginBottom: hp(2),
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    padding: hp(1.5),
    width: '45%',
    backgroundColor: Colors.secondary3,
    alignItems: 'center',
    borderRadius: hp(1),
  },
  modalButtonText: {
    color: Colors.neutral1,
    fontSize: hp(2),
  },
});

export default Home;
