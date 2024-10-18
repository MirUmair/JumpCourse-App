
import AsyncStorage from '@react-native-async-storage/async-storage';
 
export const BaseUrlLocal = 'http://192.168.100.74:5000/api/'
export const BaseUrlLive = "https://coursejump-backend.onrender.com/api/"
export const BaseUrl = BaseUrlLive
export const Screens = {
  SignUp: "SignUp",
  Login: "Login",
  Courses: "Courses",
  CourseStack: "CourseStack",
  AddCourse: "AddCourse",
  ForgotPassword: "ForgotPassword",
  ResetPassword: "ResetPassword",
  Video: "Video",

  Home: "Home",
  Notification: "Notification",
  Profile: "Profile",
  Setting: "Setting",
  CourseDetails: "CourseDetails",
  Camera: "Camera",
  EditCourse: "EditCourse"
}
export const Fonts = {
  plus: "add-circle",
  regular: "Now-Regular",
  medium: "Now-Medium",
  thin: "Now-Thin",
  bold: "Now-Bold",
  black: "Now-Black",
}
export const fenceTypes = [
  { key: 'Vertical', value: 'Vertical' },
  { key: 'Oxer', value: 'Oxer' },
  { key: 'Wall', value: 'Wall' },
  { key: 'Triple bar', value: 'Triple bar' },
  { key: 'Double Combination', value: 'Double Combination' },
  { key: 'Triple Combination', value: 'Triple Combination' },
  { key: 'Water', value: 'Water' },
]
export const lines = [
  { key: 'Straight', value: 'Straight' },
  { key: 'Broken', value: 'Broken' },
  { key: 'Bend', value: 'Bend' },
]
export const obstacleList = [
  { key: '1', value: '1' },
  { key: '2', value: '2' },
  { key: '3', value: '3' },
  { key: '4', value: '4' },
  { key: '5', value: '5' },
  { key: '6', value: '6' },
  { key: '7', value: '7' },
  { key: '8', value: '8' },
  { key: '9', value: '9' },
  { key: '10', value: '10' },
  { key: 'N/A', value: 'N/A' }

]

// Helper functions
export const getToken = async (): Promise<string | null> => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    return token;
  } catch (error) {
    console.error('Failed to retrieve token from storage', error);
    return null;
  }
};
export const getUser = async (): Promise<string | null> => {
  try {
    const user = await AsyncStorage.getItem('user');
    return JSON.parse(user || '');
  } catch (error) {
    console.error('Failed to retrieve token from storage', error);
    return null;
  }
};