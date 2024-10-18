import React, { useState } from 'react';
import {
    StyleSheet,
    TextInput,
    TextInputProps,
    View,
    TouchableOpacity,
    ViewStyle,
} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Fonts } from '../utils';
import { Colors } from '../theme';
import Icon from 'react-native-vector-icons/Ionicons'; // Assuming you are using Ionicons

export interface InputProps extends TextInputProps {
    placeholderText?: string;
    multiLine?: boolean;
    focusDesign?: boolean;
    onChangeValue?: (text: string) => void;
    value?: string;
    style?: ViewStyle;
    isPassword?: boolean; // New prop to indicate if it's a password field
}

function Input(props: InputProps): React.JSX.Element {

    const [isFocused, setIsFocused] = useState(false); // State to track focus
    const [isPasswordVisible, setIsPasswordVisible] = useState(false); // State to toggle password visibility

    const {
        focusDesign = false,
        placeholderText,
        multiLine,
        onChangeValue,
        value,
        style,
        isPassword = false, // Defaults to false
        ...TextInputProps
    } = props;

    return (
        <View style={styles.inputWrapper}>
            <TextInput
                value={value}
                onChangeText={(text) => onChangeValue && onChangeValue(text)}
                multiline={multiLine ? true : false}
                numberOfLines={multiLine ? 4 : 1}
                placeholder={placeholderText}
                placeholderTextColor={'lightgrey'}
                onFocus={() => setIsFocused(true)}   // Set focus state to true
                onBlur={() => setIsFocused(false)}   // Set focus state to false
                style={[
                    styles.inputContainer,
                    style,
                    multiLine && { height: hp(13), borderRadius: hp(3.5) },
                    { backgroundColor: focusDesign ? isFocused ? Colors.primary4 : 'rgba(246, 246, 246, 0.5)' : Colors.primary4 } // Change color on focus
                ]}
                secureTextEntry={isPassword && !isPasswordVisible} // Hide/Show password based on visibility state
                {...TextInputProps}
            />
            {isPassword && (
                <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setIsPasswordVisible(!isPasswordVisible)} // Toggle password visibility
                >
                    <Icon
                        name={isPasswordVisible ? 'eye-off' : 'eye'} // Toggle between eye and eye-off icon
                        size={24}
                        color={'gray'}
                    />
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        width: wp('85%'),
        alignSelf: 'center',
        marginTop: hp('1%'),
    },
    inputContainer: {
        borderRadius: hp(7),
        paddingLeft: wp('5%'),
        color: '#000',
        width: wp('85%'), // Adjust width to allow space for the eye icon
        height: hp('7%'),
        fontFamily: Fonts.regular,
    },
    eyeIcon: {
        position: 'absolute',
        right: wp('5%'), // Position the eye icon inside the TextInput field
    },
});

export default Input;
