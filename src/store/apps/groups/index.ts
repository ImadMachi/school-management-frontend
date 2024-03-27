import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import axios from "axios";
import toast from "react-hot-toast";
import { mapUserData } from "src/store/utils/mapUserData";
import { UserType } from "src/types/apps/UserType";
import { GroupType } from "src/types/apps/groupTypes";

const HOST = process.env.NEXT_PUBLIC_API_URL;

interface AppGroupstate {
  data: GroupType[];
  total: number;
  params: Record<string, any>;
}

const initialState: AppGroupstate = {
  data: [],
  total: 1,
  params: {},
};

export const fetchData = createAsyncThunk("appGroups/fetchData", async () => {
  const response = await axios.get(`${HOST}/groups`);
  return response.data;
});

interface AddGroupType {
  name: string;
  description: string;
  image: File | null;
  administratorUsers: UserType[];
  users: UserType[];
}
export const addGroup = createAsyncThunk(
  "appGroups/addGroup",
  async (data: AddGroupType) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    if (data.image) {
      formData.append("image", data.image);
    }
    data.administratorUsers.forEach((user, i) => {
      formData.append(`administratorUsers[${i}][id]`, `${user.id}`);
    });

    data.users.forEach((user, i) => {
      formData.append(`users[${i}][id]`, `${user.id}`);
    });

    const response = await axios.post(`${HOST}/groups`, formData);

    return response.data;
  }
);

export const editGroup = createAsyncThunk(
  "appGroups/editGroup",
  async (data: AddGroupType & { id: number }) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    if (data.image) {
      formData.append("image", data.image);
    }
    const response = await axios.put(`${HOST}/groups/${data.id}`, formData);
    return response.data;
  }
);

export const deleteGroup = createAsyncThunk(
  "appGroups/deleteGroup",
  async (id: number) => {
    await axios.delete(`${HOST}/groups/${id}`);
    return id;
  }
);

export const appGroupsSlice = createSlice({
  name: "appGroups",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      const groups = action.payload.map((group: GroupType) => {
        group.administratorUsers.forEach((user) => {
          mapUserData(user);
        });
        group.users.forEach((user) => {
          mapUserData(user);
        });
        return group;
      });

      state.data = groups;
    });

    builder.addCase(addGroup.fulfilled, (state, action) => {
      const newGroup = action.payload;
      newGroup.administratorUsers.forEach((user: any) => {
        mapUserData(user);
      });
      newGroup.users.forEach((user: any) => {
        mapUserData(user);
      });
      state.data = [newGroup, ...state.data];
    });

    builder.addCase(addGroup.rejected, (state, action) => {
      toast.error("Erreur lors de l'ajout de la catégorie.");
    });

    builder.addCase(deleteGroup.fulfilled, (state, action) => {
      state.data = state.data.filter((group) => group.id !== action.payload);
    });

    builder.addCase(editGroup.fulfilled, (state, action) => {
      const updatedGroup = action.payload;
      updatedGroup.administratorUsers.forEach((user: any) => {
        mapUserData(user);
      });
      updatedGroup.users.forEach((user: any) => {
        mapUserData(user);
      });

      state.data = state.data.map((group) => {
        if (group.id === updatedGroup.id) {
          return updatedGroup;
        }
        return group;
      });
    });
  },
});

export default appGroupsSlice.reducer;
