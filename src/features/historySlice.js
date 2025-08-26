
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for fetching completed tasks
export const fetchCompletedTasks = createAsyncThunk(
  'tasks/fetchCompletedTasks',
  async () => {
    const response = await fetch('http://localhost:5000/api/users/history', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch completed tasks');
    }

    const data = await response.json();
    return data;
  }
);


const historySlice = createSlice({
  name: 'tasks',
  initialState: {
    completedTasks: [],
    status: 'idle', // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {
    // You can add sync reducers here if needed
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompletedTasks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCompletedTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.completedTasks = action.payload;
      })
      .addCase(fetchCompletedTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default historySlice.reducer;
