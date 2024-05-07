import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";
import toast from "react-hot-toast";
import { HOST } from "src/store/constants/hostname";
import { SubjectType } from "src/types/apps/subjectTypes";

interface AppSubjectsState {
  data: SubjectType[];
}

const initialState: AppSubjectsState = {
  data: [],
};

export const fetchData = createAsyncThunk("appSubjects/fetchData", async () => {
  const response = await axios.get(`${HOST}/subjects`);
  return response.data;
});

export const addSubject = createAsyncThunk(
  "appSubjects/addSubject",
  async (data: SubjectType) => {
    const response = await axios.post(`${HOST}/subjects`, data);
    return response.data;
  }
);

export const editSubject = createAsyncThunk(
  "appSubjects/editSubject",
  async (data: SubjectType) => {
    const response = await axios.put(`${HOST}/subjects`, data);
    return response.data;
  }
);

export const deleteSubject = createAsyncThunk(
  "appSubjects/deleteSubject",
  async (id: number) => {
    const response = await axios.delete(`${HOST}/subjects/${id}`);
    return response.data;
  }
);

export const appSubjectsSlice = createSlice({
  name: "appSubjects",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.data = action.payload;
    });

    builder.addCase(addSubject.fulfilled, (state, action) => {
      state.data.push(action.payload);
      toast.success("La matière a été ajoutée avec succès");
    });

    builder.addCase(addSubject.rejected, (state, action) => {
      toast.error("Erreur ajoutant la matière");
    });

    builder.addCase(editSubject.fulfilled, (state, action) => {
      const index = state.data.findIndex(
        (item) => item.id === action.payload.id
      );
      state.data[index] = action.payload;
      toast.success("La matière a été modifiée avec succès");
    });

    builder.addCase(editSubject.rejected, (state, action) => {
      toast.error("Erreur modifiant la matière");
    });

    builder.addCase(deleteSubject.fulfilled, (state, action) => {
      state.data = state.data.filter((item) => item.id !== action.payload);
      toast.success("La matière a été supprimée avec succès");
    });

    builder.addCase(deleteSubject.rejected, (state, action) => {
      toast.error("Erreur supprimant la matière");
    });
  },
});

export default appSubjectsSlice.reducer;
