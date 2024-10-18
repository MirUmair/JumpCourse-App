import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as React from 'react';
import BottomTabs from './tab'; // Assuming this is your tab navigator
import AuthStack from './authStack'; // Your auth stack
import { useDispatch, useSelector } from 'react-redux';
 import { loadTokenFromStorage } from '../redux/features/userSlice';
import { AppDispatch, RootState } from '../redux/store';

const Stack = createNativeStackNavigator();

function StackNavigator() {
  const dispatch = useDispatch<AppDispatch>();

  const { isAuthenticated } = useSelector((state: RootState) => state.user);  // Get authentication and loading state from Redux
React.useEffect(()=>{
  setTimeout(() => {
    dispatch(loadTokenFromStorage());

  }, 2000);
},[])

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isAuthenticated ? (
          <Stack.Screen
            options={{ headerShown: false }}
            name="Home"
            component={BottomTabs}
          />
        ) : (
          <Stack.Screen
            options={{ headerShown: false }}
            name="Auth"
            component={AuthStack}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default StackNavigator;
