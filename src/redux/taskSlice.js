import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { showToast } from '../utils/showToast'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 

const BASE_URL = 'http://10.0.2.2:3000';

// Fetch tasks
export const fetchTasks = createAsyncThunk(
  'tasks/fetchTasks',
  async (params = {}, { rejectWithValue }) => {
    const { query = '', gender = '', page = 1, limit = 50 } = params;
    try {
      const res = await axios.get(`${BASE_URL}/tasks`, {
        params: { q: query, gender, _page: page, _limit: limit },
      });

      // Lưu cache offline
      await AsyncStorage.setItem('tasksCache', JSON.stringify(res.data));

      return res.data;
    } catch (err) {
      console.log('❌ Lỗi fetch, dùng cache', err.message);

      // Nếu không có mạng, lấy dữ liệu offline
      const cache = await AsyncStorage.getItem('tasksCache');
      if (cache) return JSON.parse(cache);
      return rejectWithValue(err.message);
    }
  }
);

// Thêm task
export const postTask = createAsyncThunk(
  'tasks/postTask',
  async (task, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${BASE_URL}/tasks`, task);
      showToast('success', '✅ Thêm công việc thành công');
      return res.data;
    } catch (err) {
      showToast('error', '❌ Thêm công việc thất bại', err.message);
      return rejectWithValue(err.message);
    }
  }
);

// Cập nhật task
export const updateTaskServer = createAsyncThunk(
  'tasks/updateTaskServer',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${BASE_URL}/tasks/${id}`, data);
      showToast('success', '✏️ Cập nhật công việc thành công');
      return res.data;
    } catch (err) {
      showToast('error', '❌ Cập nhật thất bại', err.message);
      return rejectWithValue(err.message);
    }
  }
);

// Xóa task
export const deleteTaskServer = createAsyncThunk(
  'tasks/deleteTaskServer',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_URL}/tasks/${id}`);
      showToast('success', '🗑️ Xóa công việc thành công');
      return id;
    } catch (err) {
      showToast('error', '❌ Xóa công việc thất bại', err.message);
      return rejectWithValue(err.message);
    }
  }
);

// Toggle completed
export const toggleCompleteServer = createAsyncThunk(
  'tasks/toggleCompleteServer',
  async (id, { rejectWithValue }) => {
    try {
      const res = await axios.put(`${BASE_URL}/tasks/${id}/complete`);
      showToast('success', '✅ Hoàn thành công việc');
      return res.data;
    } catch (err) {
      showToast('error', '❌ Cập nhật trạng thái thất bại', err.message);
      return rejectWithValue(err.message);
    }
  }
);

const taskSlice = createSlice({
  name: 'tasks',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {
    addTask: (state, action) => { state.list.unshift(action.payload); },
    updateTask: (state, action) => {
      const index = state.list.findIndex(t => t.id === action.payload.id);
      if (index !== -1) state.list[index] = action.payload;
    },
    deleteTask: (state, action) => { state.list = state.list.filter(t => t.id !== action.payload); },
    toggleComplete: (state, action) => {
      const task = state.list.find(t => t.id === action.payload);
      if (task) task.completed = !task.completed;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchTasks.pending, state => { state.loading = true; })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.list = Array.isArray(action.payload)
          ? action.payload
          : action.payload.data || [];
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(postTask.fulfilled, (state, action) => { state.list.unshift(action.payload); })
      .addCase(updateTaskServer.fulfilled, (state, action) => {
        const index = state.list.findIndex(t => t.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(deleteTaskServer.fulfilled, (state, action) => {
        state.list = state.list.filter(t => t.id !== action.payload);
      })
      .addCase(toggleCompleteServer.fulfilled, (state, action) => {
        const index = state.list.findIndex(t => t.id === action.payload.id);
        if (index !== -1) state.list[index] = action.payload;
      });
  },
});

export const { addTask, updateTask, deleteTask, toggleComplete } = taskSlice.actions;
export default taskSlice.reducer;
