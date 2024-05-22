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
import { DirectorType } from "src/types/apps/directorTypes";
import { CreateDirectorDto } from "src/views/apps/directors/list/AddDirectorDrawer";
import { UpdateDirectorDto } from "src/pages/apps/directeurs/overview/[...params]";
import toast from "react-hot-toast";
import { t } from "i18next";
import { CreateDirectorAccountDto } from "src/views/apps/directors/list/AddDirectorAccountDrawer";

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

// ** Fetch directors
export const fetchData = createAsyncThunk(
  "appDirectors/fetchData",
  async () => {
    const response = await axios.get(`${HOST}/directors`);
    return response.data;
  }
);

export const fetchDirector = createAsyncThunk(
  "appDirectors/fetchDirector",
  async (id: number) => {
    const response = await axios.get(`${HOST}/directors/${id}`);
    return response.data;
  }
);

// ** Add User

export const addDirector = createAsyncThunk(
  "appDirectors/addDirector",
  async (data: CreateDirectorDto) => {
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
      `${HOST}/directors?create-account=${data.createAccount}`,
      formData
    );
    return response.data;
  }
);

export const addDirectorAccount = createAsyncThunk(
  "appDirectors/addDirectorAccount",
  async (
    payload: { id: number; data: CreateDirectorAccountDto },
    { getState, dispatch }: Redux
  ) => {
    const { id, data } = payload;
    const formData = new FormData();

    formData.append("email", data.email || "");
    formData.append("password", data.password || "");
    formData.append("profile-images", data.profileImage || "");

    const response = await axios.post(
      `${HOST}/directors/${id}/create-account`,
      formData
    );
    return response.data;
  }
);

// ** Delete Director
interface DeleteProps {
  id: number;
  headers: Headers;
}

export const deleteDirector = createAsyncThunk(
  "appDirectors/deleteDirector",
  async (id: number, { getState, dispatch }: Redux) => {
    await axios.delete(`${HOST}/directors/${id}`);
    return id;
  }
);

export const updateDirector = createAsyncThunk(
  "appDirectors/updateDirector",
  async (
    payload: { id: number; updateDirectorDto: UpdateDirectorDto },
    { getState, dispatch }: Redux
  ) => {
    const { id, updateDirectorDto } = payload;
    const response = await axios.patch(
      `${HOST}/directors/${id}`,
      updateDirectorDto
    );
    return response.data;
  }
);

export const updateDirectorStatus = createAsyncThunk(
  "appDirectors/updateDirectorStatus",
  async ({ id, disabled }: { id: number; disabled: boolean }) => {
    try {
      const response = await axios.put<DirectorType>(
        `${HOST}/directors/${id}/status`,
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

interface appDirectorsState {
  data: DirectorType[];
  total: number;
  params: Record<string, any>;
  allData: DirectorType[];
  directorId: number | null;
  directorUserId: number | null;
}

const initialState: appDirectorsState = {
  data: [],
  total: 1,
  params: {},
  allData: [],
  directorId: null,
  directorUserId: null,
};

export const appDirectorsSlice = createSlice({
  name: "appDirectors",
  initialState,
  reducers: {
    filterData: (state, action: PayloadAction<string>) => {
      const filterValue = action.payload.toLowerCase().trim();
      if (filterValue === "") {
        state.data = state.allData;
        return;
      }
      state.data = state.allData.filter(
        (director) =>
          `${director.firstName} ${director.lastName}`
            .toLowerCase()
            .includes(filterValue) ||
          director.phoneNumber.toLowerCase().includes(filterValue)
      );
    },
    setDirectorId: (state, action: PayloadAction<number | null>) => {
      state.directorId = action.payload;
    },
    setDirectorUserId: (state, action: PayloadAction<number | null>) => {
      state.directorUserId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.data = action.payload;
      state.total = action.payload.length;
      state.allData = action.payload;
    });
    builder.addCase(deleteDirector.fulfilled, (state, action) => {
      state.data = state.data.filter(
        (Director) => Director.id !== action.payload
      );
      state.allData = state.allData.filter(
        (Director) => Director.id !== action.payload
      );
      toast.success("Le directeur a été supprimé avec succès");
    });
    builder.addCase(deleteDirector.rejected, (state, action) => {
      toast.error("Erreur supprimant le directeur");
    });
    builder.addCase(addDirector.fulfilled, (state, action) => {
      state.data.unshift(action.payload);
      state.allData.unshift(action.payload);
      toast.success("Le directeur a été ajouté avec succès");
    });
    builder.addCase(addDirector.rejected, (state, action) => {
      if (action.error.code === "ERR_BAD_REQUEST") {
        toast.error("Cet email est déjà utilisé");
        return;
      }
      toast.error("Erreur ajoutant le directeur");
    });
    builder.addCase(addDirectorAccount.fulfilled, (state, action) => {
      const updatedDirector = action.payload;
      const index = state.allData.findIndex(
        (Director) => Director.id === updatedDirector.id
      );

      if (index !== -1) {
        state.data[index] = updatedDirector;
        state.allData[index] = updatedDirector;
        toast.success("Le compte du directeur a été créé avec succès");
      }
    });
    builder.addCase(addDirectorAccount.rejected, (state, action) => {
      if (action.error.code === "ERR_BAD_REQUEST") {
        toast.error("Cet email est déjà utilisé");
        return;
      }
      toast.error("Erreur ajoutant le compte du directeur");
    });
    builder.addCase(fetchDirector.fulfilled, (state, action) => {
      const userIdToDelete = action.payload.id;
      state.data = state.data.filter(
        (Director) => Director.id !== userIdToDelete
      );
      state.allData = state.allData.filter(
        (Director) => Director.id !== userIdToDelete
      );

      state.data.unshift(action.payload);
      state.allData.unshift(action.payload);
    });

    builder.addCase(updateDirector.fulfilled, (state, action) => {
      const updatedDirector = action.payload;
      const index = state.allData.findIndex(
        (Director) => Director.id === updatedDirector.id
      );

      if (index !== -1) {
        // If the Director is found, update the data in both data and allData arrays
        state.data[index] = updatedDirector;
        state.allData[index] = updatedDirector;
        toast.success("Le directeur a été modifié avec succès");
      }
    });
    builder.addCase(updateDirector.rejected, (state, action) => {
      toast.error("Erreur modifiant le directeur");
    });
    builder.addCase(updateDirectorStatus.fulfilled, (state, action) => {
      const deletedDirectorId = action.payload.id;
      state.data = state.data.filter(
        (Director) => Director.id !== deletedDirectorId
      );
      state.allData = state.allData.filter(
        (Director) => Director.id !== deletedDirectorId
      );
      toast.success("Le directeur a été supprimé avec succès");
    });
    builder.addCase(updateDirectorStatus.rejected, (state, action) => {
      toast.error("Erreur supprimant le directeur");
    });
  },
});

export const { setDirectorId } = appDirectorsSlice.actions;
export const { setDirectorUserId } = appDirectorsSlice.actions;
export const { filterData } = appDirectorsSlice.actions;
export default appDirectorsSlice.reducer;
