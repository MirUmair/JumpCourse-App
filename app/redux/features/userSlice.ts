import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { BaseUrl, Screens } from '../../utils'; // Assuming you use this for the base URL
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage'; // For storing tokens

// Types
interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  token?: string;
}

interface UserState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// API base URL
const API_URL = BaseUrl + 'users';

const saveTokenToStorage = async (data: { token: string, user: User }) => {
  try {
    console.log('Saving token to AsyncStorage:', data.token);  // Debugging log
    await AsyncStorage.setItem('userToken', data.token);
    await AsyncStorage.setItem('user', JSON.stringify(data.user));
  } catch (error) {
    console.error('Error saving token:', error);
  }
};

const getTokenFromStorage = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    console.log('Retrieved token from AsyncStorage:', token);  // Debugging log
    return token;
  } catch (error) {
    console.error('Error retrieving token:', error);
    return null;
  }
};

const removeTokenFromStorage = async () => {
  try {
    console.log('Removing token from AsyncStorage');  // Debugging log
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('user');
  } catch (error) {
    console.error('Error removing token:', error);
  }
};
// SignUp Thunk
interface User {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  token?: string;
}

interface userData extends Omit<User, 'id'> {
  navigation: any; // Add navigation here as part of the argument
  setLoader: (value: boolean) => void; // Function to control loader in component
}

interface LoginData extends Omit<User, 'username' | 'id'> {
  navigation: any; // Add navigation as part of the login arguments
  setLoader: (value: boolean) => void; // Function to control loader in the component
}
export const signUp = createAsyncThunk<void, userData>(
  'user/signUp',
  async (userData, { rejectWithValue }) => {
    const { navigation, setLoader, setShowMessage,
      setMessage, ...userDetails } = userData; // Destructure to extract navigation and loader
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${BaseUrl}users/register`,
      headers: {
        'Content-Type': 'application/json',
      },
      data: userDetails,
    };
    try {
      setLoader(true);
      const response = await axios(config);
      console.log(response)
      if (!response.data || !response.data.token) {
        throw new Error('Invalid response from server');
      }
      setShowMessage(true)
      setMessage('1:User Registered Successfully!')
      // Alert.alert('User Registered Successfully!');
      if (userDetails?.type === 'social') {
        await saveTokenToStorage(response.data);
        navigation.navigate(Screens.Video, { targetScreen: Screens.Home });
      }
      else {
        setTimeout(() => {
          navigation.navigate(Screens.Login);

        }, 1500);
      }
      setLoader(false);
      return response.data; // Return user data
    } catch (error: any) {
      setLoader(false);
      setShowMessage(true)

      const errorMessage = error.response?.data?.message || 'Sign Up Failed. Please try again.';
      setMessage('3:' + errorMessage + '!')

      // Alert.alert('SignUp Failed', errorMessage);
      console.log(errorMessage)
      return rejectWithValue(errorMessage);
    }
  }
);



export const login = createAsyncThunk<void, LoginData>(
  'user/login',
  async (loginData, { rejectWithValue }) => {
    const { navigation, setLoader, ...userDetails } = loginData;
    try {
      setLoader(true);
      const response = await axios.post(`${API_URL}/login`, userDetails);
      await saveTokenToStorage(response.data);
      navigation.navigate(Screens.Video, { targetScreen: Screens.Home });
      setLoader(false);
      return response.data;
    } catch (error: any) {
      setLoader(false);
      if (error.response) {
        const errorMessage = error.response.data.message || 'Login failed';
        Alert.alert('Login Failed', errorMessage);
        return rejectWithValue(error.response.data);
      } else {
        const genericError = 'Login failed. Please try again.';
        Alert.alert('Login Failed', genericError);
        return rejectWithValue(genericError);
      }
    }
  }
);
// export const signUp = createAsyncThunk<User, Omit<User, 'id'>>(
//   'user/signUp',
//   async (userData, { rejectWithValue }) => {
//     let config = {
//       method: 'post',
//       maxBodyLength: Infinity,
//       url: `${BaseUrl}users/register`,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       data: userData,
//     };

//     try {
//       const response = await axios(config);
//       console.log(JSON.stringify(response.data));

//       if (!response.data || !response.data.token) {
//         throw new Error('Invalid response from server');
//       }

//       await saveTokenToStorage(response.data); // Save the token to AsyncStorage

//       Alert.alert('User Registered Successfully!');
//       return response.data; // Return the API response
//     } catch (error: any) {
//       console.log('Error during sign-up:', error);
//       const errorMessage = error.response?.data?.message || 'Sign Up Failed. Please try again.';
//       Alert.alert('SignUp Failed', errorMessage);
//       return rejectWithValue(errorMessage);
//     }
//   }
// );
// Login Thunk
// export const login = createAsyncThunk<User, Omit<User, 'username'>>(
//   'user/login',
//   async (userData, { rejectWithValue }) => {
//     try {
//       console.log('userData', userData);

//       const response = await axios.post(`${API_URL}/login`, userData);

//       console.log('Login successful:', response);

//       await saveTokenToStorage(response.data); // Save the token to AsyncStorage

//       return response.data;
//     } catch (error: any) {
//       console.log('Login error:', error);

//       if (error.response) {
//         return rejectWithValue(error.response.data); // Return the error response data
//       } else {
//         return rejectWithValue('Login failed');
//       }
//     }
//   }
// );
// Load Token from Storage (to restore authentication state on app start)
export const loadTokenFromStorage = createAsyncThunk(
  'user/loadToken',
  async (_, { dispatch, rejectWithValue }) => {

    try {
      console.log('Loading token from AsyncStorage');  // Debugging log
      const token = await getTokenFromStorage();
      if (token) {
        console.log('Token found:', token);  // Debugging log
        dispatch(setToken(token));
        return token;
      } else {
        console.log('No token found');  // Debugging log
        return rejectWithValue('No token found');
      }
    } catch (error) {
      console.error('Error loading token from AsyncStorage:', error);
      return rejectWithValue('Failed to load token');
    }
  }
);
export const requestPasswordReset = createAsyncThunk<void, string>(
  'user/requestPasswordReset',
  async (email, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/requestReset`, { email });
      console.log('Password reset request successful:', response);
      Alert.alert('Password Reset', 'A reset key has been sent to your email.');
    } catch (error: any) {
      console.log('Error during password reset request:', error);
      const errorMessage = error.response?.data?.message || 'Password reset request failed.';
      Alert.alert('Password Reset Failed', errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);
export const ResetPassword = createAsyncThunk<void, { email: string, resetKey: string, newPassword: string }>(
  'user/resetPassword',
  async ({ email, resetKey, newPassword }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/reset`, { email, resetKey, newPassword });
      console.log('Password reset successful:', response);
      Alert.alert('Password Reset', 'Your password has been successfully reset.');
    } catch (error: any) {
      console.log('Error during password reset:', error);
      const errorMessage = error.response?.data?.message || 'Password reset failed.';
      Alert.alert('Password Reset Failed', errorMessage);
      return rejectWithValue(errorMessage);
    }
  }
);

// Initial state
const initialState: UserState = {
  user: null,
  token: null,
  isAuthenticated: false,
  status: 'idle',
  error: null,
  loading: true,  // Add loading state to handle token check
};

// Update the extraReducers to set loading state
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      console.log('Logging out, removing token');  // Debugging log
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      removeTokenFromStorage();
    },
    resetStatus: (state) => {
      state.status = 'idle';
      state.error = null;
    },
    setToken: (state, action: PayloadAction<string>) => {
      console.log('Setting token:', action.payload);  // Debugging log
      state.token = action.payload;
      state.isAuthenticated = true;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Token Load Cases
      .addCase(loadTokenFromStorage.pending, (state) => {
        console.log('Loading token...');  // Debugging log
        state.loading = true;
      })
      .addCase(loadTokenFromStorage.fulfilled, (state, action) => {
        console.log('Token loaded:', action.payload);  // Debugging log
        state.token = action.payload;
        state.isAuthenticated = true;
        state.loading = false;
      })
      .addCase(loadTokenFromStorage.rejected, (state, action) => {
        console.log('Failed to load token');  // Debugging log
        state.token = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;
        state.loading = false;
      })
      // Handle Password Reset Request
      .addCase(requestPasswordReset.pending, (state) => {
        console.log('Requesting password reset...');  // Debugging log
        state.status = 'loading';
      })
      .addCase(requestPasswordReset.fulfilled, (state) => {
        console.log('Password reset request successful');  // Debugging log
        state.status = 'succeeded';
      })
      .addCase(requestPasswordReset.rejected, (state, action) => {
        console.log('Password reset request failed');  // Debugging log
        state.status = 'failed';
        state.error = action.payload as string;
      })
      // Handle Reset Password
      .addCase(ResetPassword.pending, (state) => {
        console.log('Resetting password...');  // Debugging log
        state.status = 'loading';
      })
      .addCase(ResetPassword.fulfilled, (state) => {
        console.log('Password reset successful');  // Debugging log
        state.status = 'succeeded';
      })
      .addCase(ResetPassword.rejected, (state, action) => {
        console.log('Password reset failed');  // Debugging log
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },

});



// Export actions and reducer
export const { logout, resetStatus, setToken } = userSlice.actions;
export default userSlice.reducer;
