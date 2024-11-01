import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { FlatList, Keyboard, KeyboardAvoidingView, Modal as Modal1, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SelectList } from 'react-native-dropdown-select-list';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';
import { useDispatch } from 'react-redux';
import { Image, Loader, Modal } from '../../../components';
import Button from '../../../components/Button';
import DropDown from '../../../components/DropDown';
import Header from '../../../components/Header';
import Input from '../../../components/Input';
import { createCourse } from '../../../redux/features/courseSlice'; // import the actions
import { AppDispatch } from '../../../redux/store';
import { Colors } from '../../../theme';
import { fenceTypes, Fonts, getUser, obstacleList } from '../../../utils';

type Obstacle = {
  fenceType: string;
  strides: string;
  line: string;
  riderNotes: string;
};

function Home({ navigation, route }: any): React.JSX.Element {
  const dispatch = useDispatch<AppDispatch>();
  const { image } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [name, setName] = useState('');
  const [date, setDate] = useState(new Date()); // Initialize date properly
  const [courseDesigner, setCourseDesigner] = useState('');
  const [venue, setVenue] = useState('');
  const [timeAllowed, setTimeAllowed] = useState('');
  const [fenceType, setFenceType] = useState('Vertical');
  const [strides, setStrides] = useState('');
  const [line, setLine] = useState('Straight');
  const [riderNotes, setRiderNotes] = useState('');
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [show, setShow] = useState(false);
  const [loader, setLoader] = useState(false);
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [selected, setSelected] = React.useState([]);
  ['straight', 'broken', 'bend']

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === 'ios'); // Keep the picker visible for iOS
    setDate(currentDate);
  };

  const openModalForEdit = (index: number) => {
    const obstacle = obstacles[index];
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
      setMessage('2:Please fill in all obstacle details')
      setShowMessage(true)
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

  const validateForm = () => {
    if (!name) {
      setMessage('2:Please enter the course name.')
      setShowMessage(true)
      return false;
    }
    if (!date) {
      setMessage('2:Please select a valid date.')
      setShowMessage(true)
      return false;
    }
    if (!venue) {
      setMessage('2:Please enter the venue.')
      setShowMessage(true)
      return false;
    }
    if (!timeAllowed) {
      setMessage('2:Please enter the maximum time allowed.')
      setShowMessage(true)
      return false;
    }
    return true;
  };

  const handleSaveChanges = async () => {
    Keyboard.dismiss()
    setLoader(true);
    setTimeout(async () => {
      if (validateForm()) {
        const user = await getUser();
        const formdata = new FormData();
        formdata.append("courseDesigner", courseDesigner);
        formdata.append("userId", user?._id);
        formdata.append("date", date.toDateString());
        formdata.append("name", name);
        formdata.append("timeAllowed", timeAllowed);
        formdata.append("venue", venue);
        formdata.append("obstacles", JSON.stringify(obstacles));
        formdata.append('courseImage', {
          uri: image.uri,
          name: image.fileName,
          type: image.type,
        });
        await dispatch(createCourse(formdata));
        setLoader(false);
        setMessage('1:Course details saved successfully.')
        setShowMessage(true)
        setTimeout(() => {
          navigation.navigate('Courses');
        }, 2000);
      } else {
        setLoader(false)
      }
    }, 100);
  };

  return (
    <SafeAreaView style={styles.mainContainer} >
      <Loader
        loading={loader} />
      <Modal
        visible={showMessage}
        setShowMessage={setShowMessage}
        message={message} />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={hp(12)}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps={'handled'}
          showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            <Header
              Title={'Enter Course Details'}
              navigation={navigation}
              onPressBack={() => navigation.navigate('Courses')}
            />
            <Image image={image.uri} />
            <Input onChangeValue={setName} value={name} placeholderText='Name' />
            <View style={styles.inputContainer}>
              <Text style={styles.text}>{date ? date.toLocaleDateString() : 'Select Date'}</Text>
              <TouchableOpacity onPress={() => setShow(true)}>
                <Icon name={'calendar-number-sharp'} size={hp(3)} color={Colors.secondary3} />
              </TouchableOpacity>
            </View>
            <Input onChangeValue={setVenue} value={venue} placeholderText='Venue' />
            <Input onChangeValue={setTimeAllowed} value={timeAllowed} placeholderText='Maximum Time Allowed' />
            <TouchableOpacity style={styles.inputContainer} onPress={() => { setIsEditing(false), setModalVisible(true) }}>
              <Text style={styles.text}>Add obstacle</Text>
              <Icon name={'add-circle-sharp'} size={hp(3)} color={Colors.secondary3} />
            </TouchableOpacity>
            <FlatList
              data={obstacles}
              renderItem={({ item, index }) => <DropDown item={item} index={index} onEdit={() => openModalForEdit(index)} />}
              keyExtractor={(item, index) => index.toString()}
              contentContainerStyle={styles.flatlistContainer}
            />

            <Button
              onPress={handleSaveChanges}
              Title='SAVE' textStyle={{ color: Colors.neutral1 }}
              style={styles.btn} />
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
                    setSelected={(val) => setSelected(val)}
                    data={fenceTypes}
                    boxStyles={styles.inputContainer}
                    save="value"
                    inputStyles={{ color: fenceType ? Colors.neutral2 : Colors.neutral3, fontFamily: Fonts.regular }}
                    dropdownTextStyles={styles.ddtext}
                    dropdownStyles={styles.ddStyles}
                    onSelect={() => setFenceType(selected === '1' ? 'Vertical' : selected)}
                    searchPlaceholder={'Fence Type'}
                    placeholder={'Fence Type'}
                    defaultOption={{ key: 'Vertical', value: 'Vertical' }}
                  />
                  <SelectList
                    setSelected={(val) => setSelected(val)}
                    data={obstacleList}
                    boxStyles={styles.inputContainer}
                    save="value"
                    inputStyles={{ color: strides ? Colors.neutral2 : Colors.neutral3, fontFamily: Fonts.regular }}
                    dropdownTextStyles={styles.ddtext}
                    dropdownStyles={styles.ddStyles}
                    onSelect={() => setStrides(selected)}
                    searchPlaceholder={'No of Strides'}
                    placeholder={'No of Strides'}
                    defaultOption={{ key: '1', value: '1' }}
                  />

                  <Input placeholderText='Rider Notes'
                    multiLine={true}
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
                value={date}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={onChange}
                minimumDate={new Date(2000, 0, 1)}
                maximumDate={new Date(2100, 11, 31)}
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.neutral1
  },
  container: {
    flex: 1,
    backgroundColor: Colors.neutral1,
    alignItems: 'center',
    minHeight: hp(80)
  },
  inputContainer: {
    backgroundColor: Colors.primary4,
    borderRadius: hp(7),
    borderColor: Colors.neutral1,
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
    fontFamily: Fonts.bold
  },
  ddStyles: {
    backgroundColor: Colors.primary4,
    height: hp(15),
    borderColor: Colors.secondary3
  },
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
    marginBottom: hp(2)
  },
  btn: {
    backgroundColor: Colors.secondary3,
    marginBottom: hp(2),
    color: Colors.neutral1
  },
  imageTitle: {
    fontFamily: Fonts.bold,
    fontSize: hp(2),
    marginTop: hp(2),
    color: '#53382b'
  },
  topImage: {
    resizeMode: 'center',
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontFamily: Fonts.regular,
    color: Colors.neutral2
  },
  pickerText: {
    fontFamily: Fonts.regular,
    color: Colors.neutral2,
    width: wp(75),
    fontSize: wp(3.5)
  },
  dropdownText: {
    fontFamily: Fonts.regular,
    color: Colors.neutral2,
    fontSize: wp(4)
  },
  dropdown: {
    width: wp(75),
    borderRadius: 5,
    color: Colors.primary4
  },
});

export default Home;
