import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";
import { CategoryType } from "src/types/apps/categoryTypes";

const HOST = process.env.NEXT_PUBLIC_API_URL;

interface AppCategoriestate {
  data: CategoryType[];
  total: number;
  params: Record<string, any>;
  selectedId: number | null;
}

const initialState: AppCategoriestate = {
  data: [],
  total: 1,
  params: {},
  selectedId: null,
};

export const fetchData = createAsyncThunk(
  "appCategories/fetchData",
  async () => {
    const response = await axios.get(`${HOST}/message-categories`);
    return response.data;
  }
);

export const appCategoriesSlice = createSlice({
  name: "appCategories",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.data = action.payload;
    });
  },
});

export default appCategoriesSlice.reducer;
