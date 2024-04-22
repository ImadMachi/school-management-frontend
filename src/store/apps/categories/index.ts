import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";
import toast from "react-hot-toast";
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

interface AddCategoryType {
  name: string;
  description: string;
  image: File | null;
}
export const addCategory = createAsyncThunk(
  "appCategories/addCategory",
  async (data: AddCategoryType) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    if (data.image) {
      formData.append("image", data.image);
    }
    const response = await axios.post(`${HOST}/message-categories`, formData);

    return response.data;
  }
);

export const editCategory = createAsyncThunk(
  "appCategories/editCategory",
  async (data: AddCategoryType & { id: number }) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    if (data.image) {
      formData.append("image", data.image);
    }
    const response = await axios.put(
      `${HOST}/message-categories/${data.id}`,
      formData
    );
    return response.data;
  }
);

export const deleteCategory = createAsyncThunk(
  "appCategories/deleteCategory",
  async (id: number) => {
    await axios.delete(`${HOST}/message-categories/${id}`);
    return id;
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

    builder.addCase(addCategory.fulfilled, (state, action) => {
      state.data = [action.payload, ...state.data];
    });

    builder.addCase(addCategory.rejected, (state, action) => {
      toast.error("Erreur lors de l'ajout de la catégorie.");
    });

    builder.addCase(deleteCategory.fulfilled, (state, action) => {
      state.data = state.data.filter(
        (category) => category.id !== action.payload
      );
    });

    builder.addCase(editCategory.fulfilled, (state, action) => {
      state.data = state.data.map((category) => {
        if (category.id === action.payload.id) {
          return action.payload;
        }
        return category;
      });
    });
  },
});

export default appCategoriesSlice.reducer;
