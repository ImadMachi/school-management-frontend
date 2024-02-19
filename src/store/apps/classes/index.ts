import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";
import { ClassType } from "src/types/apps/classTypes";

const HOST = process.env.NEXT_PUBLIC_API_URL;

interface AppClassesState {
  data: ClassType[];
}

const initialState: AppClassesState = {
  data: [],
};

export const fetchData = createAsyncThunk("appClasses/fetchData", async () => {
  const response = await axios.get(`${HOST}/classes`);

  return response.data;
});

export const appClassesSlice = createSlice({
  name: "appClasses",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.data = action.payload;
    });
  },
});

export default appClassesSlice.reducer;
