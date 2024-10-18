import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import { ForgotPassword, ResetPassword, Login, SignUp, Video } from '../screens';
import { Screens } from '../utils';

const Stack = createNativeStackNavigator();
function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{ headerShown: false }}
        name={Screens.Video}
        component={Video}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name={Screens.Login}
        component={Login}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name={Screens.SignUp}
        component={SignUp}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name={Screens.ForgotPassword}
        component={ForgotPassword}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name={Screens.ResetPassword}
        component={ResetPassword}
      />

    </Stack.Navigator>
  );
}

export default AuthStack;
