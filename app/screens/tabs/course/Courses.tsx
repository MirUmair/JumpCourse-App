import React, { useCallback, useRef, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Modal, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { useFocusEffect } from '@react-navigation/native';
import RNRestart from 'react-native-restart';
import { useDispatch, useSelector } from 'react-redux';
import { BottomSheet, Cards, Header } from '../../../components'; // Assuming you have these components
import { deleteCourse, getCoursesByUser } from '../../../redux/features/courseSlice';
import { AppDispatch, RootState } from '../../../redux/store';
import { Colors } from '../../../theme';
import { Fonts, Screens } from '../../../utils';

const Home = ({ navigation }) => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false); // New state for refreshing
  const [loader, setLoader] = useState(false); // New state for refreshing
  const bottomSheetRef = useRef(null);
  const dispatch = useDispatch<AppDispatch>();

  const { courses, status } = useSelector((state: RootState) => state.course); // status will track the loading state
  const handleLogout = () => {
    // dispatch(logout());
    AsyncStorage.removeItem('userToken')
    AsyncStorage.removeItem('user')
    handleLogoutGmail()
    RNRestart.Restart();
  };
  const handleLogoutGmail = async () => {
    try {
      // Check if the user is signed in
      // const isSignedIn = await GoogleSignin.isSignedIn();
      // if (isSignedIn) {
        // If the user is signed in, proceed with logout
        await GoogleSignin.revokeAccess(); // optional
        await GoogleSignin.signOut();
        console.log('User logged out successfully');
      // } else {
      //   console.log('User is not logged in');
      // }
    } catch (error) {
      console.error('Error logging out: ', error);
    }
  };


  useFocusEffect(
    useCallback(() => {
      setLoader(true)
      dispatch(getCoursesByUser());
      setLoader(false)
    }, [dispatch])
  );




  const handleRefresh = async () => {
    setRefreshing(true);
    await dispatch(getCoursesByUser()); // Fetch courses again
    setRefreshing(false);
  };

  const handleToggleBottomSheet = useCallback(() => {
    bottomSheetRef.current?.snapToIndex(1);
  }, []);

  const handleDeleteCourse = () => {
    dispatch(deleteCourse(selectedCourse._id));
    Alert.alert('Delete', `Deleting course: ${selectedCourse.name}`);
    setModalVisible(false);
  };


  const openCourseOptions = (course) => {
    setSelectedCourse(course);
    setModalVisible(true);
  };

  const handleEditCourse = () => {
    navigation.navigate(Screens.EditCourse, { course: selectedCourse });
    setModalVisible(false);
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

  return (
    <SafeAreaView style={styles.container}>
      <Header icon='log-out' Title="Courses" backIcon={false} onPressBack={() => handleLogout()} backIcon={true} />

      {/* Show Loader when data is being fetched */}
      {loader ? (
        <ActivityIndicator size="large" color={Colors.secondary3} style={styles.loader} />
      ) : (
        <FlatList
          style={styles.courseList}
          data={courses}
          renderItem={renderCourseItem}
          keyExtractor={(item) => item._id.toString()}
          refreshing={refreshing} // Bind refreshing state
          onRefresh={handleRefresh} // Bind handleRefresh function
        />
      )}

      <TouchableOpacity style={styles.iconStyle} onPress={handleToggleBottomSheet}>
        <Icon name={'add-circle'} size={hp(8.5)} color={Colors.secondary3} />
      </TouchableOpacity>

      {/* Modal for course actions */}
      <CourseModal
        visible={modalVisible}
        course={selectedCourse}
        onClose={() => setModalVisible(false)}
        onEdit={handleEditCourse}
        onDelete={handleDeleteCourse}
      />
      <BottomSheet isSkip={true} bottomSheetRef={bottomSheetRef} navigation={navigation} />

    </SafeAreaView>
  );
};

const CourseModal = ({ visible, course, onClose, onEdit, onDelete }) => (
  <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
    <View style={styles.modalContainer}>
      <LinearGradient colors={['#a6a6a6', Colors.neutral1]} style={styles.modalContent}>
        <Text style={styles.modalTitle}>{course?.name}</Text>
        <View style={styles.modalButtons}>
          <TouchableOpacity style={styles.modalButton} onPress={onEdit}>
            <Text style={styles.modalButtonText}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.modalButton} onPress={() => onDelete()}>
            <Text style={styles.modalButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </View>
  </Modal>
);

 
const styles = StyleSheet.create({
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
    top: hp('73%'),
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
