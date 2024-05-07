import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";
import toast from "react-hot-toast";
import { HOST } from "src/store/constants/hostname";
import { ClassType } from "src/types/apps/classTypes";

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

export const addClass = createAsyncThunk(
  "appClasses/addClass",
  async (data: ClassType) => {
    const response = await axios.post(`${HOST}/classes`, data);
    return response.data;
  }
);

export const editClass = createAsyncThunk(
  "appClasses/editClass",
  async (data: ClassType) => {
    const response = await axios.put(`${HOST}/classes`, data);
    return response.data;
  }
);

export const deleteClass = createAsyncThunk(
  "appClasses/deleteClass",
  async (id: number) => {
    const response = await axios.delete(`${HOST}/classes/${id}`);
    return response.data;
  }
);

export const appClassesSlice = createSlice({
  name: "appClasses",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.data = action.payload;
    });

    builder.addCase(addClass.fulfilled, (state, action) => {
      state.data.push(action.payload);
      toast.success("La classe a été ajoutée avec succès");
    });

    builder.addCase(addClass.rejected, (state, action) => {
      toast.error("Erreur ajoutant la classe");
    });

    builder.addCase(editClass.fulfilled, (state, action) => {
      const index = state.data.findIndex(
        (item) => item.id === action.payload.id
      );
      state.data[index] = action.payload;
      toast.success("La classe a été modifiée avec succès");
    });

    builder.addCase(editClass.rejected, (state, action) => {
      toast.error("Erreur modifiant la classe");
    });

    builder.addCase(deleteClass.fulfilled, (state, action) => {
      state.data = state.data.filter((item) => item.id !== action.payload);
      toast.success("La classe a été supprimée avec succès");
    });

    builder.addCase(deleteClass.rejected, (state, action) => {
      toast.error("Erreur supprimant la classe");
    });
  },
});

export default appClassesSlice.reducer;
