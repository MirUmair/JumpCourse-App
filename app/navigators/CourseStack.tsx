import {createNativeStackNavigator} from '@react-navigation/native-stack';
import * as React from 'react';
import 'react-native-reanimated';
import {CourseDetails, AddCourse, Courses, EditCourse} from '../screens';
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
        name={Screens.Courses}
        component={Courses}
        options={{
          headerShown: false,
        }}
      />
      <CourseStackNav.Screen
        options={{headerShown: false}}
        name={Screens.CourseDetails}
        component={CourseDetails}
      />
      <CourseStackNav.Screen
        name={Screens.AddCourse}
        component={AddCourse}
        options={{
          headerShown: false,
        }}
      />
      {/* <CourseStackNav.Screen
                name={Screens.Camera}
                component={Camera}
                options={{
                    headerShown: false,
                }}
            /> */}
      <CourseStackNav.Screen
        name={Screens.EditCourse}
        component={EditCourse}
        options={{
          headerShown: false,
        }}
      />
    </CourseStackNav.Navigator>
  );
}

export default CourseStack;
