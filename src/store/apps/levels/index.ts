import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";
import toast from "react-hot-toast";
import { HOST } from "src/store/constants/hostname";
import { LevelType } from "src/types/apps/levelTypes";

interface AppLevelsState {
  data: LevelType[];
}

const initialState: AppLevelsState = {
  data: [],
};

export const fetchData = createAsyncThunk("appLevels/fetchData", async () => {
  const response = await axios.get(`${HOST}/levels`);
  return response.data;
});

export const addLevel = createAsyncThunk(
  "appLevels/addLevel",
  async (data: LevelType) => {
    const response = await axios.post(`${HOST}/levels`, data);
    return response.data;
  }
);

export const editLevel = createAsyncThunk(
  "appLevels/editLevel",
  async (data: LevelType) => {
    const response = await axios.put(`${HOST}/levels`, data);
    return response.data;
  }
);

export const deleteLevel = createAsyncThunk(
  "appLevels/deleteLevel",
  async (id: number) => {
    const response = await axios.delete(`${HOST}/levels/${id}`);
    return response.data;
  }
);

export const updateLevelStatus = createAsyncThunk(
  "appLevels/updateLevelStatus",
  async ({ id, disabled }: { id: number; disabled: boolean }) => {
    try {
      const response = await axios.put<LevelType>(
        `${HOST}/levels/${id}/status`,
        {
          disabled,
        }
      );
      return response.data;
    } catch (error: any) {
      throw error.response.data.message;
    }
  }
);


export const appLevelsSlice = createSlice({
  name: "appLevels",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.data = action.payload;
    });

    builder.addCase(addLevel.fulfilled, (state, action) => {
      state.data.push(action.payload);
      toast.success("Le niveau a été ajoutée avec succès");
    });

    builder.addCase(addLevel.rejected, (state, action) => {
      toast.error("Erreur ajoutant le niveau");
    });

    builder.addCase(editLevel.fulfilled, (state, action) => {
      const index = state.data.findIndex(
        (item) => item.id === action.payload.id
      );
      state.data[index] = action.payload;
      toast.success("Le niveau a été modifiée avec succès");
    });

    builder.addCase(editLevel.rejected, (state, action) => {
      toast.error("Erreur modifiant le niveau");
    });

    builder.addCase(deleteLevel.fulfilled, (state, action) => {
      state.data = state.data.filter((item) => item.id !== action.payload);
      toast.success("Le niveau été supprimée avec succès");
    });

    builder.addCase(deleteLevel.rejected, (state, action) => {
      toast.error("Erreur supprimant le niveau");
    });
    
    builder.addCase(updateLevelStatus.fulfilled, (state, action) => {
      state.data = state.data.filter((item) => item.id !== action.payload.id);
      // toast.success("Le niveau été supprimée avec succès");
    });

    builder.addCase(updateLevelStatus.rejected, (state, action) => {
      toast.error("Erreur supprimant le niveau");
    });
  },
});

export default appLevelsSlice.reducer;
