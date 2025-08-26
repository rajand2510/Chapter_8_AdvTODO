import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk fetching nested task data with token auth header
export const fetchTasks = createAsyncThunk(
  'todo/fetchTasks',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token'); // read token from localStorage
      if (!token) {
        return rejectWithValue('No auth token found');
      }
      const response = await fetch('http://localhost:5000/api/tasks/nested', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        return rejectWithValue('Failed to fetch tasks');
      }
      const data = await response.json();
      return data; // nested groups with subGroups and tasks
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialToken = localStorage.getItem('token');

const initialState = {
  token: initialToken || null,
  groups: [],
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    setToken(state, action) {
      state.token = action.payload;
      localStorage.setItem('token', action.payload); // persist token
    },
    clearToken(state) {
      state.token = null;
      state.groups = [];
      state.status = 'idle';
      state.error = null;
      localStorage.removeItem('token'); // clear token from storage
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.groups = action.payload; // store nested structure as is
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload ?? action.error.message;
      });
  },
});

// Utility to check if date is today
const isToday = (date) => {
  const d = new Date(date);
  const now = new Date();
  return (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  );
};

// Selector to flatten nested groups -> subGroups -> tasks to a flat tasks array
export const selectAllTasks = (state) => {
  let allTasks = [];
  for (const group of state.todo.groups) {
    for (const subGroup of group.subGroups || []) {
      allTasks = allTasks.concat(subGroup.tasks || []);
    }
  }
  return allTasks;
};
export const selectGroups = (state) => state.todo.groups;

// Selector for tasks with date today
export const selectTodayTasks = (state) => {
  return selectAllTasks(state).filter((task) => task.date && isToday(task.date));
};

// Selector for overdue tasks: date in past and not completed
export const selectOverdueTasks = (state) => {
  const now = new Date();
  return selectAllTasks(state).filter(
    (task) => task.date && new Date(task.date) < now && !task.completed
  );
};

export const { setToken, clearToken } = todoSlice.actions;

export default todoSlice.reducer;
