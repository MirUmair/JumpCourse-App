import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { RootState } from '../store';
import { BaseUrl, getToken } from '../../utils';
import { Alert } from 'react-native';

// Types
interface Course {
  _id: string;
  name: string;
  courseDesigner: string;
  date: string;
  venue: string;
  obstacles: { fenceType: string; line: string; riderNotes: string; strides: string }[];
  courseImage: string;
  timeAllowed: string;
}

interface CourseState {
  courses: Course[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// API base URL
const API_URL = BaseUrl + 'courses';

// Helper function to set authorization headers with token
// Combined function to create Authorization and Content-Type headers
const createAuthHeaders = async (isFormData = false) => {
  // Get token
  const token = await getToken();

  // Create headers object
  const headers = {
    Authorization: `Bearer ${token}`, // Include the Authorization header
  };

  // Conditionally add 'Content-Type' for FormData
  if (isFormData) {
    headers['Content-Type'] = 'multipart/form-data';
  }

  return headers;
};


// Async thunk to get all courses
export const getAllCourses = createAsyncThunk<Course[], void, { state: RootState }>(
  'course/getAllCourses',
  async (_, { rejectWithValue }) => {
    try {
      const headers = await createAuthHeaders();

      const response = await axios.get(API_URL, { headers });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : 'Network Error');
    }
  }
);

// Async thunk to get courses by user
export const getCoursesByUser = createAsyncThunk<Course[], void, { state: RootState }>(
  'course/getCoursesByUser',
  async (_, { rejectWithValue }) => {
    try {
      const headers = await createAuthHeaders();

      const response = await axios.get(`${API_URL}/user/token`, { headers });

      console.log(response)
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : 'Network Error');
    }
  }
);

// Async thunk to create a new course
export const createCourse = createAsyncThunk<Course, FormData, { state: RootState }>(
  'course/createCourse',
  async (formData, { rejectWithValue }) => {
    try {
      const headers = await createAuthHeaders();
      const response = await axios.post(`${API_URL}/create`, formData, {
        headers: {
          ...headers,
          'Content-Type': 'multipart/form-data', // Important for sending files
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : 'Network Error');
    }
  }
);
 

// Async thunk to update a course
export const updateCourse = createAsyncThunk<
  Course, // Replace with the actual response type
  { courseId: string; courseData: FormData; navigation: any, setLoader: any },
  { state: RootState }
>(
  'course/updateCourse',
  async ({ courseId, courseData, navigation, setLoader }, { rejectWithValue, dispatch }) => {
    try {
      // Show loader
      setLoader(true);

      // Create headers
      const headers = await createAuthHeaders(true);

      // Log the full URL and courseId to debug 404 error
      console.log(`API URL: ${API_URL}/update/${courseId}`);
      console.log(`Course ID: ${courseId}`);

      // Make the PUT request using Axios
      const response = await axios.put(`${API_URL}/update/${courseId}`, courseData, { headers });

      // Success alert
      Alert.alert('Course details updated successfully.');

      // Navigate to the Courses screen after successful update
      navigation.navigate('Courses'); // Replace 'Courses' with the actual route

      // Return the successful response data
      return response.data;
    } catch (error: any) {
      console.error('Axios Error:', error);  // Log the error details
      Alert.alert('Failed to update course.');
      return rejectWithValue(error.response ? error.response.data : 'Network Error');
    } finally {
      setLoader(false);
    }
  }
);

// Async thunk to delete a course
export const deleteCourse = createAsyncThunk<string, string, { state: RootState }>(
  'course/deleteCourse',
  async (courseId, { rejectWithValue }) => {
    try {
      const headers = await createAuthHeaders();
      await axios.delete(`${API_URL}/${courseId}`, { headers });
      return courseId;
    } catch (error) {
      return rejectWithValue(error.response ? error.response.data : 'Network Error');
    }
  }
);

// Initial State
const initialState: CourseState = {
  courses: [],
  status: 'idle',
  error: null,
};

// Course Slice
const courseSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handling getAllCourses
      .addCase(getAllCourses.fulfilled, (state, action: PayloadAction<Course[]>) => {
        state.courses = action.payload;
        state.status = 'succeeded';
      })
      .addCase(getAllCourses.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getAllCourses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // Handling getCoursesByUser
      .addCase(getCoursesByUser.fulfilled, (state, action: PayloadAction<Course[]>) => {
        state.courses = action.payload;
        state.status = 'succeeded';
      })
      .addCase(getCoursesByUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getCoursesByUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // Handling createCourse
      .addCase(createCourse.fulfilled, (state, action: PayloadAction<Course>) => {
        state.courses.push(action.payload);
      })
      .addCase(createCourse.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // Handling updateCourse
      .addCase(updateCourse.fulfilled, (state, action: PayloadAction<Course>) => {
        const index = state.courses.findIndex(course => course._id === action.payload._id);
        state.courses[index] = action.payload;
      })
      .addCase(updateCourse.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // Handling deleteCourse
      .addCase(deleteCourse.fulfilled, (state, action: PayloadAction<string>) => {
        state.courses = state.courses.filter(course => course._id !== action.payload);
      })
      .addCase(deleteCourse.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default courseSlice.reducer;
