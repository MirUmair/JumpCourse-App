import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/userSlice';
import courseReducer from './features/courseSlice';

const store = configureStore({
  reducer: {
    user: userReducer,
    course: courseReducer,
  },
});

// Define RootState and AppDispatch types for use in components
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
