// ** Redux Imports
import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  Dispatch,
} from "@reduxjs/toolkit";

// ** Axios Imports
import axios from "axios";
import { HOST } from "src/store/constants/hostname";
import { AdministratorType } from "src/types/apps/administratorTypes";
import { CreateAdministratorDto } from "src/views/apps/administrators/list/AddAdministratorDrawer";
import { UpdateAdministratorDto } from "src/pages/apps/administrateurs/overview/[...params]";
import toast from "react-hot-toast";
import { CreateAdministratorAccountDto } from "src/views/apps/administrators/list/AddAdministratorAccountDrawer";

// Use Record to define the type with known keys

interface Params {
  q: string;
}

interface Headers {
  Authorization: string;
  [key: string]: string;
}

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}
// ** Fetch Administrators
export const fetchData = createAsyncThunk(
  "appAdministrators/fetchData",
  async () => {
    const response = await axios.get(`${HOST}/administrators`);
    return response.data;
  }
);

export const fetchAdministrator = createAsyncThunk(
  "appAdministrators/fetchAdministrator",
  async (id: number) => {
    const response = await axios.get(`${HOST}/administrators/${id}`);
    return response.data;
  }
);

export const addAdministrator = createAsyncThunk(
  "appAdministrators/addAdministrator",
  async (data: CreateAdministratorDto) => {
    const formData = new FormData();

    // Append createAccount property explicitly
    formData.append("firstName", data.firstName);

    formData.append("lastName", data.lastName);

    formData.append("phoneNumber", data.phoneNumber);

    formData.append("createAccount", data.createAccount.toString());

    if (data.createAccount) {
      formData.append("createUserDto[email]", data.createUserDto?.email || "");
      formData.append(
        "createUserDto[password]",
        data.createUserDto?.password || ""
      );
      formData.append("profile-images", data.profileImage || "");
    }

    const response = await axios.post(
      `${HOST}/administrators?create-account=${data.createAccount}`,
      formData
    );
    return response.data;
  }
);

export const addAdministratorAccount = createAsyncThunk(
  "appAdministrators/addAdministratorAccount",
  async (
    payload: { id: number; data: CreateAdministratorAccountDto },
    { getState, dispatch }: Redux
  ) => {
    const { id, data } = payload;
    const formData = new FormData();

    formData.append("email", data.email || "");
    formData.append("password", data.password || "");
    formData.append("profile-images", data.profileImage || "");

    const response = await axios.post(
      `${HOST}/administrators/${id}/create-account`,
      formData
    );
    return response.data;
  }
);

// ** Delete Administrator
interface DeleteProps {
  id: number;
  headers: Headers;
}

export const deleteAdministrator = createAsyncThunk(
  "appAdministrators/deleteAdministrator",
  async (id: number, { getState, dispatch }: Redux) => {
    await axios.delete(`${HOST}/administrators/${id}`);
    return id;
  }
);

export const updateAdministrator = createAsyncThunk(
  "appAdministrators/updateAdministrator",
  async (
    payload: { id: number; updateAdministratorDto: UpdateAdministratorDto },
    { getState, dispatch }: Redux
  ) => {
    const { id, updateAdministratorDto } = payload;
    const response = await axios.patch(
      `${HOST}/administrators/${id}`,
      updateAdministratorDto
    );
    return response.data;
  }
);

export const updateAdministratorStatus = createAsyncThunk(
  "appAdministrators/updateAdministratorStatus",
  async ({ id, disabled }: { id: number; disabled: boolean }) => {
    try {
      const response = await axios.put<AdministratorType>(
        `${HOST}/administrators/${id}/status`,
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

interface AppAdministratorsState {
  find(arg0: (admin: any) => boolean): unknown;
  data: AdministratorType[];
  total: number;
  params: Record<string, any>;
  allData: AdministratorType[];
  AdministratorId: number | null;
  AdministratorUserId: number | null;
}

const initialState: AppAdministratorsState = {
  data: [],
  total: 1,
  params: {},
  allData: [],
  AdministratorId: null,
  AdministratorUserId: null,
};

export const appAdministratorsSlice = createSlice({
  name: "appAdministrators",
  initialState,
  reducers: {
    filterData: (state, action: PayloadAction<string>) => {
      const filterValue = action.payload.toLowerCase().trim();
      if (filterValue === "") {
        state.data = state.allData;
        return;
      }
      state.data = state.allData.filter(
        (administrator) =>
          `${administrator.firstName} ${administrator.lastName}`
            .toLowerCase()
            .includes(filterValue) ||
          administrator.phoneNumber.toLowerCase().includes(filterValue)
      );
    },
    setAdministratorId: (state, action: PayloadAction<number | null>) => {
      state.AdministratorId = action.payload;
    },
    setAdministratorUserId: (state, action: PayloadAction<number | null>) => {
      state.AdministratorUserId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.data = action.payload;
      state.total = action.payload.length;
      state.allData = action.payload;
    });
    builder.addCase(deleteAdministrator.fulfilled, (state, action) => {
      state.data = state.data.filter(
        (administrator) => administrator.id !== action.payload
      );
      state.allData = state.allData.filter(
        (administrator) => administrator.id !== action.payload
      );
      toast.success("L'administrateur a été supprimé avec succès");
    });
    builder.addCase(deleteAdministrator.rejected, (state, action) => {
      toast.error("Erreur supprimant l'administrateur");
    });

    builder.addCase(addAdministrator.fulfilled, (state, action) => {
      state.data.unshift(action.payload);
      state.allData.unshift(action.payload);
      toast.success("L'administrateur a été ajoutée avec succès");
    });
    builder.addCase(addAdministrator.rejected, (state, action) => {
      if (action.error.code === "ERR_BAD_REQUEST") {
        toast.error("Cet email est déjà utilisé");
        return;
      }

      toast.error("Erreur ajoutant l'administrateur ");
    });

    builder.addCase(addAdministratorAccount.fulfilled, (state, action) => {
      const updatedAdministrator = action.payload;
      const index = state.allData.findIndex(
        (administrator) => administrator.id === updatedAdministrator.id
      );

      if (index !== -1) {
        state.data[index] = updatedAdministrator;
        state.allData[index] = updatedAdministrator;
        toast.success("Le compte a été créé avec succès");
      }
    });
    builder.addCase(addAdministratorAccount.rejected, (state, action) => {
      if (action.error.code === "ERR_BAD_REQUEST") {
        toast.error("Cet email est déjà utilisé");
        return;
      }
      toast.error("Erreur ajoutant le compte");
    });

    builder.addCase(fetchAdministrator.fulfilled, (state, action) => {
      const userIdToDelete = action.payload.id;
      state.data = state.data.filter(
        (administrator) => administrator.id !== userIdToDelete
      );
      state.allData = state.allData.filter(
        (administrator) => administrator.id !== userIdToDelete
      );
      state.data.unshift(action.payload);
      state.allData.unshift(action.payload);
    });

    builder.addCase(updateAdministrator.fulfilled, (state, action) => {
      const updatedAdministrator = action.payload;
      const index = state.allData.findIndex(
        (administrator) => administrator.id === updatedAdministrator.id
      );

      if (index !== -1) {
        state.data[index] = updatedAdministrator;
        state.allData[index] = updatedAdministrator;
        toast.success("L'administrateur a été supprimé avec succès");
      }
    });
    builder.addCase(updateAdministrator.rejected, (state, action) => {
      toast.error("Erreur supprimant l'administrateur");
    });
    builder.addCase(updateAdministratorStatus.fulfilled, (state, action) => {
      const deleteAdministratorId = action.payload.id;
      state.data = state.data.filter(
        (administrator) => administrator.id !== deleteAdministratorId
      );
      state.allData = state.allData.filter(
        (administrator) => administrator.id !== deleteAdministratorId
      );
      toast.success("L'administrateur a été modifié avec succès");
    });
    builder.addCase(updateAdministratorStatus.rejected, (state, action) => {
      toast.error("Erreur supprimant l'administrateur");
    });
  },
});

export const { setAdministratorId } = appAdministratorsSlice.actions;
export const { setAdministratorUserId } = appAdministratorsSlice.actions;
export const { filterData } = appAdministratorsSlice.actions;
export default appAdministratorsSlice.reducer;
