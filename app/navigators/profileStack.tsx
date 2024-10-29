import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as React from 'react';
import 'react-native-reanimated';
import {Profile,EditProfile} from '../screens';
import {Screens} from '../utils';
const CourseStackNav = createNativeStackNavigator();

interface AppProps {
  hideSplashScreen: boolean;
}

/**
 * This is the root component of our app.
 * @param {AppProps} props - The props for the `App` component.
 * @returns {JSX.Element} The rendered `App` component.
 */
function CourseStack(props: AppProps) {
  return (
    <CourseStackNav.Navigator>
      <CourseStackNav.Screen
        name={Screens.Profile}
        component={Profile}
        options={{
          headerShown: false,
        }}
      />
      <CourseStackNav.Screen
        options={{headerShown: false}}
        name={Screens.EditProfile}
        component={EditProfile}
      />
      
     
    </CourseStackNav.Navigator>
  );
}

export default CourseStack;
