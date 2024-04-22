import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";
import toast from "react-hot-toast";
import { TemplateType } from "src/types/apps/templateTypes";

const HOST = process.env.NEXT_PUBLIC_API_URL;

interface AppTemplatestate {
  data: TemplateType[];
  total: number;
  params: Record<string, any>;
  selectedId: number | null;
}

const initialState: AppTemplatestate = {
  data: [],
  total: 1,
  params: {},
  selectedId: null,
};

export const fetchData = createAsyncThunk(
  "appTemplates/fetchData",
  async () => {
    const response = await axios.get(`${HOST}/templates`);
    return response.data;
  }
);

interface AddTemplateType {
  title: string;
  description: string;
  subject: string;
  body: string;
  category: { id: number };
}
export const addTemplate = createAsyncThunk(
  "appTemplates/addTemplate",
  async (data: AddTemplateType) => {
    const response = await axios.post(`${HOST}/templates`, data);

    return response.data;
  }
);

interface EditTemplateType {
  id: number;
  title: string;
  description: string;
  subject: string;
  body: string;
  category: { id: number };
}

export const editTemplate = createAsyncThunk(
  "appTemplates/editTemplate",
  async (data: EditTemplateType) => {
    const response = await axios.put(`${HOST}/templates`, data);
    return response.data;
  }
);

export const deleteTemplate = createAsyncThunk(
  "appTemplates/deleteTemplate",
  async (id: number) => {
    await axios.delete(`${HOST}/templates/${id}`);
    return id;
  }
);

export const appTemplatesSlice = createSlice({
  name: "appTemplates",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.data = action.payload;
    });

    builder.addCase(addTemplate.fulfilled, (state, action) => {
      state.data = [action.payload, ...state.data];
    });

    builder.addCase(addTemplate.rejected, (state, action) => {
      toast.error("Erreur lors de l'ajout de la template.");
    });

    builder.addCase(editTemplate.fulfilled, (state, action) => {
      state.data = state.data.map((template) => {
        if (template.id === action.payload.id) {
          return action.payload;
        }
        return template;
      });
    });

    builder.addCase(deleteTemplate.fulfilled, (state, action) => {
      state.data = state.data.filter(
        (category) => category.id !== action.payload
      );
    });
  },
});

export default appTemplatesSlice.reducer;
