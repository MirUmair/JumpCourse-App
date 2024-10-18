import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';
import { Fonts } from '../utils';
import { Colors } from '../theme';

type Obstacle = {
  fenceType: string;
  strides: string;
  line: string;
  riderNotes: string;
};

export interface buttonProps {
  Title?: string;
  onEdit?: () => void;
  index?: number | any;
  item?: Obstacle;
}
function DropDown(props: buttonProps): React.JSX.Element {
  const { item, index, onEdit } = props;
  const [isShowing, setIsShowing] = useState(true);
  return (
    <View style={[styles.container, { minHeight: hp(!isShowing ? 20 : 8) }]}>
      <View style={styles.topView}>
        <Text style={styles.title}>Obstacle {index + 1}</Text>
        <TouchableOpacity onPress={() => setIsShowing(!isShowing)}>
          <Icon name={isShowing ? 'chevron-down' : 'chevron-up'} size={hp(3)} color='#fff' />
        </TouchableOpacity>
      </View>
      {!isShowing && (
        <View style={styles.obstacleItem}>
          <View style={{ flexDirection: 'row' }}><Text style={styles.text}>Fence Type: </Text><Text style={styles.textLight}>{item?.fenceType}</Text></View>
          <View style={{ flexDirection: 'row' }}><Text style={styles.text}>No of Strides: </Text><Text style={styles.textLight}>{item?.strides}</Text></View>
          <View style={{ flexDirection: 'row' }}><Text style={styles.text}>Line: </Text><Text style={styles.textLight}>{item?.line}</Text></View>
          <View style={{ flexDirection: 'row' }}><Text style={styles.text}>Rider Notes: </Text><Text style={styles.textLight}>{item?.riderNotes}</Text></View>
          <TouchableOpacity onPress={onEdit} style={styles.editButton}>
            <Text style={styles.textButton}>Edit</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: wp(85),
    marginTop: hp(2),
    borderRadius: hp(2),
    backgroundColor: Colors.secondary3,
    padding: hp(2),
    paddingBottom: hp(1)
  },
  topView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    alignItems: 'center'
  },
  title: {
    color: '#fff',
    fontSize: hp(2.3),
    width: wp(65), textAlign: 'center',
    fontFamily: Fonts.bold,
  },
  text: {
    color: Colors.neutral1,
    fontSize: hp(1.8),
    fontFamily: Fonts.bold,
  },
  textLight: {
    color: Colors.primary4,
    fontSize: hp(1.8),
    fontFamily: Fonts.regular,
    width: wp(50)
  },
  textButton: {
    color: Colors.secondary3,
    fontSize: hp(1.8),
    fontFamily: Fonts.bold,
  },
  obstacleItem: {
    padding: hp(1),
  },
  editButton: {
    marginTop: hp(1),
    backgroundColor: Colors.primary4,
    paddingVertical: hp(1),
    borderRadius: hp(2),
    width: wp(30),
    alignSelf: 'center',
    alignItems: 'center',
  },
});

export default DropDown;
