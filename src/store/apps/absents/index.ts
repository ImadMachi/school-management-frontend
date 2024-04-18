// ** Redux Imports
import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  Dispatch,
} from "@reduxjs/toolkit";

// ** Axios Imports
import axios from "axios";
import { fr } from "date-fns/locale";
import toast from "react-hot-toast";
import { UpdateAbsentDto } from "src/pages/apps/absences";
import { AbsentsType } from "src/types/apps/absentsTypes";

const HOST = process.env.NEXT_PUBLIC_API_URL;

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

// ** Fetch addAbsentss
export const fetchData = createAsyncThunk("appAbsents/fetchData", async () => {
  const response = await axios.get(`${HOST}/absents`);
  return {absents : response.data};
  
});

export const fetchAbsent = createAsyncThunk(
  "appAbsents/fetchAbsent",
  async (id: number) => {
    const response = await axios.get(`${HOST}/absents/${id}`);
    return response.data;
  }
);

// ** Add Absents

export const addAbsent = createAsyncThunk(
  "appAbsents/addAbsent",
  async (data: AbsentsType) => {
    const response = await axios.post(`${HOST}/absents`, data);
    return response.data;
  }
);

// ** Update addAbsents

export const updateAbsent = createAsyncThunk(
  "appAbsents/updateAbsent",
  async (data: AbsentsType) => {
    const response = await axios.put(`${HOST}/absents`, data);
    return response.data;
  }
);

// ** Delete addAbsents
interface DeleteProps {
  id: number;
  headers: Headers;
}

export const deleteAbsent = createAsyncThunk(
  "appAbsents/deleteAbsent",
  async (id: number, { getState, dispatch }: Redux) => {
    await axios.delete(`${HOST}/absents/${id}`);
    return id;
  }
);

interface AppAbsentsState {
  absents: AbsentsType[];
  data: AbsentsType[];
  total: number;
  params: Record<string, any>;
  allData: AbsentsType[];
}

const initialState: AppAbsentsState = {
  absents: [],
  data: [],
  total: 1,
  params: {},
  allData: [],
};

export const appAbsentsSlice = createSlice({
  name: "appAbsents",
  initialState,
  reducers: {
    filterData: (state, action: PayloadAction<string>) => {
      const filterValue = action.payload.toLowerCase().trim();
      if (filterValue === "") {
        state.data = state.allData;
        return;
      }
      state.data = state.allData.filter(
        (absents) =>
          `${absents.absentUser.userData.firstName} ${absents.absentUser.userData.lastName}`
            .toLowerCase()
            .includes(filterValue) ||
          absents.datedebut.toString().toLowerCase().includes(filterValue) ||
          absents.datefin.toString().toLowerCase().includes(filterValue) ||
          absents.absentUser.role.toLowerCase().includes(filterValue) 
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      const absents = action.payload.absents.map((absent: any) => {
        if (absent.absentUser.director) {
          absent.absentUser.userData = absent.absentUser.director;
        } else if (absent.absentUser.administrator) {
          absent.absentUser.userData = absent.absentUser.administrator;
        } else if (absent.absentUser.teacher) {
          absent.absentUser.userData = absent.absentUser.teacher;
        } else if (absent.absentUser.student) {
          absent.absentUser.userData = absent.absentUser.student;
        } else if (absent.absentUser.parent) {
          absent.absentUser = absent.absentUser.parent;
        } else if (absent.absentUser.agent) {
          absent.absentUser.userData = absent.absentUser.agent;
        }
    
        // Process replaceUser array similarly to absentUser
        absent.replaceUser = absent.replaceUser.map((replaceUser: any) => {
          if (replaceUser.director) {
            replaceUser.userData = replaceUser.director;
          } else if (replaceUser.administrator) {
            replaceUser.userData = replaceUser.administrator;
          } else if (replaceUser.teacher) {
            replaceUser.userData = replaceUser.teacher;
          } else if (replaceUser.student) {
            replaceUser.userData = replaceUser.student;
          } else if (replaceUser.parent) {
            replaceUser = replaceUser.parent;
          } else if (replaceUser.agent) {
            replaceUser.userData = replaceUser.agent;
          }
          return replaceUser;
        });
    
        return absent;
      });
    
      state.data = absents;
      state.total = absents.length;
      state.allData = absents;
    });

    builder.addCase(fetchData.rejected, (state, action) => {
      toast.error("Erreur lors du chargement des absences");
    });

    builder.addCase(addAbsent.fulfilled, (state, action) => {
      state.data.push(action.payload);
      toast.success("L'absence a été ajouté avec succès");
    });

    builder.addCase(addAbsent.rejected, (state, action) => {
      toast.error("Erreur ajoutant l'absence");
    });
    
    builder.addCase(deleteAbsent.fulfilled, (state, action) => {
      state.data = state.data.filter(
        (addAbsents) => addAbsents.id !== action.payload
      );
      state.allData = state.allData.filter(
        (addAbsents) => addAbsents.id !== action.payload
      );
      toast.success("L'absence a été supprimé avec succès");
    });
    builder.addCase(deleteAbsent.rejected, (state, action) => {
      toast.error("Erreur supprimant l'absence");
    });
    builder.addCase(fetchAbsent.fulfilled, (state, action) => {
      const userIdToDelete = action.payload.id;

      state.data = state.data.filter((Parent) => Parent.id !== userIdToDelete);
      state.allData = state.allData.filter(
        (absent) => absent.id !== userIdToDelete
      );

      state.data.unshift(action.payload);
      state.allData.unshift(action.payload);
    });

    builder.addCase(updateAbsent.fulfilled, (state, action) => {
      const updateAbsent = action.payload;
      const index = state.allData.findIndex(
        (absent) => absent.id === updateAbsent.id
      );

      if (index !== -1) {
        state.data[index] = updateAbsent;
        state.allData[index] = updateAbsent;
        toast.success("L'absence a été modifié avec succès");
      }
    });
    builder.addCase(updateAbsent.rejected, (state, action) => {
      toast.error("Erreur modifiant l'absence");
    });
  },
});


export const { filterData } = appAbsentsSlice.actions;
export default appAbsentsSlice.reducer;
