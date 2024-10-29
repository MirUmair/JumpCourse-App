import 'react-native-reanimated';
import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { Setting, Notification, Profile } from '../screens';
import CourseStack from './courseStack';
import ProfileStack from './profileStack';


import { KeyboardAvoidingView, Platform, Keyboard, View } from 'react-native';
import { heightPercentageToDP } from 'react-native-responsive-screen';
import { Screens } from '../utils';
import { Colors } from '../theme';

const Tab = createBottomTabNavigator();

function CustomTabBarIcon({ name, color, size }) {
  return <Icon name={name} size={size} color={color} />;
}

function BottomTabs() {
  return (
    // Wrapping the Bottom Tab Navigation inside KeyboardAvoidingView
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === Screens.CourseStack) {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === Screens.ProfileStack) {
              iconName = focused ? 'person' : 'person-outline';
            } else if (route.name === Screens.Notification) {
              iconName = focused ? 'notifications' : 'notifications-outline';
            } else if (route.name === Screens.Setting) {
              iconName = focused ? 'settings' : 'settings-outline';
            }
            return (
              <CustomTabBarIcon
                name={iconName}
                color={color}
                size={heightPercentageToDP(4)}
              />
            );
          },
          tabBarShowLabel: false, // Hide the labels
          tabBarActiveTintColor: Colors.neutral1,
          tabBarInactiveTintColor: 'lightgray',
          keyboardHidesTabBar: true, // Ensure tab bar hides when keyboard is open
          tabBarStyle: {
            backgroundColor: Colors.secondary3,
            paddingBottom: 5,
            height: heightPercentageToDP(10),
          },
        })}>
        <Tab.Screen
          name={Screens.CourseStack}
          component={CourseStack}
          options={{
            headerShown: false,
          }}
        />
        <Tab.Screen
          name={Screens.ProfileStack}
          component={ProfileStack}
          options={{
            headerShown: false,
          }}
        />
        <Tab.Screen
          name={Screens.Notification}
          component={Notification}
          options={{
            headerShown: false,
          }}
        />
        <Tab.Screen
          name={Screens.Setting}
          component={Setting}
          options={{
            headerShown: false,
          }}
        />
      </Tab.Navigator>
    </KeyboardAvoidingView>
  );
}

export default BottomTabs;
