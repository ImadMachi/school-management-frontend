import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios'; // Assuming axios is used for HTTP requests
import { HOST } from 'src/store/constants/hostname';
import { StatisticsType } from 'src/types/apps/statisticsType';

interface StatisticsState {
  data: StatisticsType | null;
  loading: boolean;
  error: string | null;
}



const initialState: StatisticsState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchStatistics = createAsyncThunk(
    "appStatistics/fetchStatistics",
    async () => {
      const response = await axios.get(`${HOST}/statistics`);
      return response.data;
    }
  );

const statisticsSlice = createSlice({
  name: 'statistics',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchStatistics.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchStatistics.fulfilled, (state, action) => {
      state.loading = false;
      state.error = null;
      state.data = action.payload;
    });
    builder.addCase(fetchStatistics.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Failed to fetch statistics';
    });
  },
});

export const statisticsActions = statisticsSlice.actions;

export default statisticsSlice.reducer;
