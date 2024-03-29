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
    console.log(response.data);
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

interface AppAdministratorsState {
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
      toast.success("La classe a été ajoutée avec succès");
    });
    builder.addCase(addAdministrator.rejected, (state, action) => {
      toast.error("Erreur ajoutant la classe");
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
        toast.success("L'administrateur a été modifié avec succès");
      }
    });
    builder.addCase(updateAdministrator.rejected, (state, action) => {
      toast.error("Erreur modifiant l'administrateur");
    });
  },
});

export const { setAdministratorId } = appAdministratorsSlice.actions;
export const { setAdministratorUserId } = appAdministratorsSlice.actions;
export const { filterData } = appAdministratorsSlice.actions;
export default appAdministratorsSlice.reducer;
