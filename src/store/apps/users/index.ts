import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  Dispatch,
} from "@reduxjs/toolkit";

import axios from "axios";
import toast from "react-hot-toast";
import { HOST } from "src/store/constants/hostname";
import { mapUserData } from "src/store/utils/mapUserData";
import { UserRole, UserType } from "src/types/apps/UserType";

interface AppUserstate {
  data: UserType[];
  total: number;
  params: Record<string, any>;
  allData: UserType[];
  selectedId: { id: number | null; role: string | null } | null;
}

const initialState: AppUserstate = {
  data: [],
  total: 1,
  params: {},
  allData: [],
  selectedId: null,
};

export const fetchData = createAsyncThunk(
  "appUsers/fetchData",
  async (role?: UserRole) => {
    const response = await axios.get(`${HOST}/users?role=${role}`);
    return response.data;
  }
);

export const fetchUser = createAsyncThunk(
  "appUsers/fetchUser",
  async (id: number) => {
    const response = await axios.get(`${HOST}/users/${id}`);
    return response.data;
  }
);

export const fetchUserById = createAsyncThunk(
  "appUsers/fetchUserById",
  async (id: number) => {
    const response = await axios.get(`${HOST}/users/${id}`);
    return response.data;
  }
);

export const updatePassword = createAsyncThunk(
  "appUsers/updatePassword",
  async ({ id, newPassword }: { id: number; newPassword: string }) => {
    const response = await axios.post<UserType>(
      `${HOST}/users/${id}/change-password`,
      { newPassword }
    );
    return response.data;
  }
);

export const reactivateAccount = createAsyncThunk(
  "appUsers/reactivateAccount",
  async ({ id }: { id: number }) => {
    const response = await axios.get(`${HOST}/users/${id}/reactivate-account`);
    return response.data;
  }
);

export const uploadProfileImage = createAsyncThunk(
  "appUsers/uploadProfileImage",
  async ({ id, file }: { id: number; file: File }) => {
    const formData = new FormData();
    formData.append("profile-images", file);

    const response = await axios.post<UserType>(
      `${HOST}/users/${id}/update-profile-image`,
      formData
    );

    return response.data;
  }
);

export const updateUserStatus = createAsyncThunk(
  "appUsers/updateUserStatus",
  async ({ id, disabled }: { id: number; disabled: boolean }) => {
    try {
      const response = await axios.put<UserType>(`${HOST}/users/${id}/status`, {
        disabled,
      });
      return response.data;
    } catch (error: any) {
      throw error.response.data.message;
    }
  }
);

export const appUsersSlice = createSlice({
  name: "appUsers",
  initialState,
  reducers: {
    filterData: (state, action: PayloadAction<string>) => {
      const filterValue = action.payload.toLowerCase().trim();
      if (filterValue === "") {
        state.data = state.allData;
        return;
      }
      state.data = state.allData.filter(
        (User) =>
          User.id.toString().toLowerCase().includes(filterValue) ||
          User.role.toLowerCase().includes(filterValue) ||
          User.isActive.toString().toLowerCase().includes(filterValue) ||
          User.email.toLowerCase().includes(filterValue) ||
          `${User.userData.firstName} ${User.userData.lastName}`
            .toLowerCase()
            .includes(filterValue)
      );
    },
    setSelectedId: (
      state,
      action: PayloadAction<{ id: number | null; role: string | null }>
    ) => {
      state.selectedId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      for (let user of action.payload) {
        mapUserData(user);
      }

      state.data = action.payload;
      state.total = action.payload.length;
      state.allData = action.payload;
    });
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      const userIdToDelete = action.payload.id;

      state.data = state.data.filter((User) => User.id !== userIdToDelete);
      state.allData = state.allData.filter(
        (User) => User.id !== userIdToDelete
      );

      state.data.unshift(action.payload);
      state.allData.unshift(action.payload);
    });
    builder.addCase(fetchUserById.fulfilled, (state, action) => {
      const userIdToDelete = action.payload.id;

      state.data = state.data.filter((User) => User.id !== userIdToDelete);
      state.allData = state.allData.filter(
        (User) => User.id !== userIdToDelete
      );
      state.data.unshift(action.payload);
      state.allData.unshift(action.payload);
    });
    builder.addCase(updatePassword.fulfilled, (state, action) => {
      toast.success("Le mot de passe a été mis à jour avec succès");
    });
    builder.addCase(updatePassword.rejected, (state, action) => {
      toast.error("Erreur lors de la mise à jour du mot de passe");
    });
    builder.addCase(uploadProfileImage.fulfilled, (state, action) => {
      const updateUser = action.payload;
      const index = state.allData.findIndex(
        (User) => User.id === updateUser.id
      );

      if (index !== -1) {
        state.data[index] = updateUser;
        state.allData[index] = updateUser;
        toast.success("L'image de profil a été mise à jour avec succès");
      }
    });
    builder.addCase(uploadProfileImage.rejected, (state, action) => {
      toast.error("Erreur lors de la mise à jour de l'image de profil");
    });
    builder.addCase(updateUserStatus.fulfilled, (state, action) => {
      const deletedUserId = action.payload.id;

      state.data = state.data.filter((User) => User.id !== deletedUserId);
      state.allData = state.allData.filter((User) => User.id !== deletedUserId);

      toast.success("L'utilisateur a été supprimé avec succès");
    });

    builder.addCase(updateUserStatus.rejected, (state, action) => {
      toast.error("Erreur supprimant l'utilisateur");
    });

    builder.addCase(reactivateAccount.fulfilled, (state, action) => {
      toast.success("Le compte a été réactivé avec succès");
    });

    builder.addCase(reactivateAccount.rejected, (state, action) => {
      toast.error("Erreur lors de la réactivation du compte");
    });
  },
});

export const { setSelectedId } = appUsersSlice.actions;
export const { filterData } = appUsersSlice.actions;
export default appUsersSlice.reducer;
