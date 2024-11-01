import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, FlatList, KeyboardAvoidingView, Modal as Modal1, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch } from 'react-redux';
import { BottomSheet, Image, Loader, Modal } from '../../../components';
import Button from '../../../components/Button';
import DropDown from '../../../components/DropDown';
import Header from '../../../components/Header';
import Input from '../../../components/Input';
import { AppDispatch } from '../../../redux/store';
import { Colors } from '../../../theme';
import { BaseUrl, fenceTypes, Fonts, lines, obstacleList, Screens } from '../../../utils';

type Obstacle = {
  fenceType: string;
  strides: string;
  line: string;
  riderNotes: string;
};

function EditCourse({ navigation, route }: any): React.JSX.Element {
  const { course } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [courseId, setCourseId] = useState(course._id);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [name, setName] = useState(course.name);
  const [date, setDate] = useState(course.date); // Initialize with existing date
  const [venue, setVenue] = useState(course.venue);
  const [timeAllowed, setTimeAllowed] = useState(course.timeAllowed);
  const [image, setImage] = useState({});
  const [fenceType, setFenceType] = useState('');
  const [stridesObj, setStridesObj] = useState({});
  const [fenceTypeObj, setfenceTypeObj] = useState({});
  const [strides, setStrides] = useState('');
  const [line, setLine] = useState('');
  const [riderNotes, setRiderNotes] = useState('');
  const [obstacles, setObstacles] = useState<Obstacle[]>(course.obstacles);
  const [show, setShow] = useState(false);
  const [loader, setLoader] = useState(false);
  const [loader2, setLoader2] = useState(false);
  const [selected1, setSelected1] = React.useState([]);
  const [selected2, setSelected2] = React.useState([]);
  const bottomSheetRef = useRef(null);
  const [message, setMessage] = useState('');

  const [showMessage, setShowMessage] = useState(false);
  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios');
    setDate(currentDate.toDateString());
  };
  useEffect(() => {
    setTimeout(() => {
      setLoader2(false)
    }, 500);
  }, [image])
  const openModalForEdit = (index: number) => {
    const obstacle = obstacles[index];
    let stridesObj = obstacleList.find(item => item.value === obstacle.strides)
    let fenceTypeObj = fenceTypes.find(item => item.value === obstacle.fenceType)
    setfenceTypeObj(fenceTypeObj)
    setStridesObj(stridesObj)
    setIsEditing(true);
    setModalVisible(true);
    setFenceType(obstacle.fenceType);
    setStrides(obstacle.strides);
    setLine(obstacle.line);
    setRiderNotes(obstacle.riderNotes);
    setCurrentIndex(index);
  };

  const addOrUpdateObstacle = () => {
    if (!fenceType || !strides) {
      setShowMessage(true)
      setMessage('2:Please fill in all obstacle details')
      // Alert.alert("Error", "Please fill in all obstacle details");
      return;
    }
    if (isEditing && currentIndex !== null) {
      const updatedObstacles = obstacles.map((item, index) =>
        index === currentIndex ? { fenceType, strides, line, riderNotes } : item
      );
      setObstacles(updatedObstacles);
      setIsEditing(false);
      setCurrentIndex(null);
    } else {
      const newObstacle = { fenceType, strides, line, riderNotes };
      setObstacles([...obstacles, newObstacle]);
    }
    setModalVisible(false);
    setFenceType('');
    setStrides('');
    setLine('');
    setRiderNotes('');
  };

  const renderObstacle = ({ item, index }: { item: Obstacle; index: number }) => (
    <DropDown item={item} index={index} onEdit={() => openModalForEdit(index)} />
  );

  const validateForm = () => {
    if (!name) {
      Alert.alert("Error", "Please enter the course name.");
      return false;
    }
    if (!date) {
      Alert.alert("Error", "Please select a valid date.");
      return false;
    }

    if (!venue) {
      Alert.alert("Error", "Please enter the venue.");
      return false;
    }
    if (!timeAllowed) {
      Alert.alert("Error", "Please enter the maximum time allowed.");
      return false;
    }
    if (obstacles.length === 0) {
      Alert.alert("Error", "Please add at least one obstacle.");
      return false;
    }
    return true;
  };
  const handleSaveChanges = async () => {
    setLoader(true)
    const formdata = new FormData();
    image?.uri && formdata.append('courseImage', {
      uri: image?.uri, // Correct file URI for React Native
      name: image?.fileName, // File name
      type: image?.type, // MIME type
    });
    // formdata.append("courseDesigner", courseDesigner);
    formdata.append("date", date);
    formdata.append("venue", venue);
    formdata.append("obstacles", JSON.stringify(obstacles));
    formdata.append("name", name);
    formdata.append("timeAllowed", timeAllowed);

    const requestOptions = {
      method: "PUT",
      body: formdata,
      redirect: "follow"
    };

    fetch(BaseUrl + "courses/update/" + courseId, requestOptions)
      .then((response) => {
        setLoader(false);
        setShowMessage(true)
        setMessage('1:Course details updated successfully.')
        setTimeout(() => {
          navigation.navigate(Screens.Courses);
        }, 1000);
      })
      .catch((error) => {
        setLoader(false);
        console.error(error);
      });
  };


  const handleToggleBottomSheet = useCallback(() => {
    bottomSheetRef.current?.snapToIndex(1);
  }, []);

  return (
    <SafeAreaView>
      <Header
        Title={'Edit Course Details'}
        navigation={navigation}
        onPressBack={() => navigation.navigate('Courses')} />
      <Modal
        visible={showMessage}
        setShowMessage={setShowMessage}
        message={message} />

      <Loader loading={loader} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={hp(5)}>
        <ScrollView>
          <View style={styles.container}>
            <Image
              handleToggleBottomSheet={handleToggleBottomSheet}
              image={image?.uri || course.courseImage}
              editable={true}
              loader={loader2} />
            <Input onChangeValue={setName}
              value={name}
              style={{ marginTop: hp(3) }}
              placeholderText='Name' />
            <View style={styles.inputContainer}>
              <Text style={styles.text}>{date ? date : 'Select Date'}</Text>
              <TouchableOpacity onPress={() => setShow(true)}>
                <Icon
                  name={'calendar-number-sharp'}
                  size={hp(3)}
                  color={Colors.secondary3} />
              </TouchableOpacity>
            </View>
            <Input
              onChangeValue={setVenue}
              value={venue}
              placeholderText='Venue' />
            <Input
              onChangeValue={setTimeAllowed}
              value={timeAllowed}
              placeholderText='Maximum Time Allowed' />
            <TouchableOpacity style={styles.inputContainer}
              onPress={() => { setIsEditing(false), setModalVisible(true) }}>
              <Text style={styles.text}>Add obstacle</Text>
              <Icon name={'add-circle-sharp'} size={hp(3)} color={Colors.secondary3} />
            </TouchableOpacity>
            <FlatList
              data={obstacles}
              renderItem={renderObstacle}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={styles.flatlistContainer}
            />
            <View style={styles.btn} >
              <Button onPress={handleSaveChanges} Title='SAVE CHANGES' textStyle={{ color: Colors.neutral1 }}
                style={{ backgroundColor: Colors.secondary3, color: Colors.neutral1 }} />
            </View>
            <Modal1
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => setModalVisible(false)}
            >
              <View style={styles.modalView}>
                <View style={styles.modalContent}>
                  <View style={{ flexDirection: 'row', width: wp(70) }}>
                    <Text style={styles.modalTitle}>{isEditing ? 'Edit Obstacle Details' : 'Add Obstacle Details'}</Text>
                    <TouchableOpacity onPress={() => setModalVisible(false)}>
                      <Icon name={'close-circle-sharp'} size={hp(3)} color={Colors.secondary3} />
                    </TouchableOpacity>
                  </View>
                  <SelectList
                    setSelected={(val) => setSelected1(val)}
                    data={fenceTypes}
                    boxStyles={styles.inputContainer}
                    save="value"
                    inputStyles={{ color: fenceType ? Colors.neutral2 : Colors.neutral3, fontFamily: Fonts.regular }}
                    dropdownTextStyles={styles.ddtext}
                    dropdownStyles={styles.ddStyles}
                    onSelect={() => setFenceType(selected1)}
                    searchPlaceholder={'Fence Type'}
                    placeholder={'Fence Type'}
                    defaultOption={fenceTypeObj}
                  />
                  <SelectList
                    setSelected={(val) => setSelected2(val)}
                    data={obstacleList}
                    boxStyles={styles.inputContainer}
                    save="value"
                    inputStyles={{ color: strides ? Colors.neutral2 : Colors.neutral3, fontFamily: Fonts.regular }}
                    dropdownTextStyles={styles.ddtext}
                    dropdownStyles={styles.ddStyles}
                    onSelect={() => { console.log(selected2), setStrides(selected2) }}
                    searchPlaceholder={'No of Strides'}
                    placeholder={'No of Strides'}
                    defaultOption={stridesObj}
                  />

                  <Input
                    placeholderText='Rider Notes' multiLine={true}
                    onChangeValue={setRiderNotes}
                    value={riderNotes}
                    style={{ textAlignVertical: 'top' }} />
                  <TouchableOpacity style={styles.saveButton} onPress={addOrUpdateObstacle}>
                    <Text style={styles.saveButtonText}>{isEditing ? 'Update' : 'Save'}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal1>
            {show && (
              <DateTimePicker
                value={new Date(date)}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onChange}
                minimumDate={new Date(2000, 0, 1)}
                maximumDate={new Date(2100, 11, 31)}
              />
            )}
          </View>
        </ScrollView>
        <BottomSheet setImage={setImage}
          bottomSheetRef={bottomSheetRef}
          navigation={navigation}
          setLoader={setLoader2} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.neutral1,
    alignItems: 'center',
    minHeight: hp(80),
  },
  inputContainer: {
    backgroundColor: Colors.primary4,
    borderColor: Colors.primary4,

    borderRadius: hp(7),
    paddingLeft: wp('5%'),
    width: wp('85%'),
    height: hp('7%'),
    alignSelf: 'center',
    marginTop: hp('1%'),
    fontFamily: Fonts.regular,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: wp('5%'),
  },
  ddtext: {
    color: Colors.neutral2,
    fontFamily: Fonts.bold,
  },
  ddStyles: { backgroundColor: Colors.primary4, height: hp(15), borderColor: Colors.primary4 },

  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  modalContent: {
    width: wp('90%'),
    backgroundColor: Colors.neutral1,
    borderRadius: hp(2),
    padding: hp(2),
    alignItems: 'center',
  },
  modalTitle: {
    fontFamily: Fonts.bold,
    fontSize: hp(2.2),
    marginBottom: hp(2),
    width: wp(70),
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: Colors.secondary3,
    borderRadius: hp(2),
    padding: hp(1.5),
    width: wp('40%'),
    alignItems: 'center',
    marginTop: hp(3),
  },
  saveButtonText: {
    color: '#fff',
    fontSize: hp(2.2),
    fontFamily: Fonts.regular,
  },
  flatlistContainer: {
    marginTop: hp(2),
    paddingHorizontal: wp('5%'),
    marginBottom: hp(2),
  },
  imageTitle: {
    fontFamily: Fonts.bold,
    fontSize: hp(2),
    marginTop: hp(3),
    color: '#53382b',
  },
  topImage: {
    resizeMode: 'contain',
    maxHeight: hp(45), width: wp(90),
    minHeight: hp(25), alignItems: 'center', justifyContent: 'center',
  },
  text: {
    fontFamily: Fonts.regular,
    color: Colors.neutral2,
  },
  btn: {
    height: hp(20),
    marginBottom: hp(5)
  },
  pickerText: {
    fontFamily: Fonts.regular,
    color: Colors.neutral2,
    width: wp(75),
    fontSize: wp(3.5),
  },
  dropdownText: {
    fontFamily: Fonts.regular,
    color: Colors.neutral2,
    fontSize: wp(4),
  },
  dropdown: {
    width: wp(75),
    borderRadius: 5,
    color: Colors.primary4,
  },
});

export default EditCourse;
