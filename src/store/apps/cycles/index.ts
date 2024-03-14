import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";
import toast from "react-hot-toast";
import { CycleType } from "src/types/apps/cycleTypes";

const HOST = process.env.NEXT_PUBLIC_API_URL;

interface AppCyclesState {
  data: CycleType[];
}

const initialState: AppCyclesState = {
  data: [],
};

export const fetchData = createAsyncThunk("appCycles/fetchData", async () => {
  const response = await axios.get(`${HOST}/cycles`);
  return response.data;
});

export const addCycle = createAsyncThunk(
  "appCycles/addCycle",
  async (data: CycleType) => {
    const response = await axios.post(`${HOST}/cycles`, data);
    return response.data;
  }
);

export const editCycle = createAsyncThunk(
  "appCycles/editCycle",
  async (data: CycleType) => {
    const response = await axios.put(`${HOST}/cycles`, data);
    return response.data;
  }
);

export const deleteCycle = createAsyncThunk(
  "appCycles/deleteCycle",
  async (id: number) => {
    const response = await axios.delete(`${HOST}/cycles/${id}`);
    return response.data;
  }
);

export const appCyclesSlice = createSlice({
  name: "appCycles",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.data = action.payload;
    });

    builder.addCase(addCycle.fulfilled, (state, action) => {
      state.data.push(action.payload);
      toast.success("Le cycles a été ajoutée avec succès");
    });

    builder.addCase(addCycle.rejected, (state, action) => {
      toast.error("Erreur ajoutant le cycles");
    });

    builder.addCase(editCycle.fulfilled, (state, action) => {
      const index = state.data.findIndex(
        (item) => item.id === action.payload.id
      );
      state.data[index] = action.payload;
      toast.success("Le cycles a été modifiée avec succès");
    });

    builder.addCase(editCycle.rejected, (state, action) => {
      toast.error("Erreur modifiant le cycles");
    });

    builder.addCase(deleteCycle.fulfilled, (state, action) => {
      state.data = state.data.filter((item) => item.id !== action.payload);
      toast.success("Le cycles été supprimée avec succès");
    });

    builder.addCase(deleteCycle.rejected, (state, action) => {
      toast.error("Erreur supprimant le cycles");
    });
  },
});

export default appCyclesSlice.reducer;
