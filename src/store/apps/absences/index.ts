// ** Redux Imports
import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  Dispatch,
} from "@reduxjs/toolkit";

// ** Axios Imports
import axios from "axios";
import toast from "react-hot-toast";
import { HOST } from "src/store/constants/hostname";
import { AbsenceType } from "src/types/apps/absenceTypes";

interface Headers {
  Authorization: string;
  [key: string]: string;
}

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

// ** Fetch addAbsences
export const fetchData = createAsyncThunk("appAbsences/fetchData", async () => {
  const response = await axios.get(`${HOST}/absences`);
  return { absences: response.data };
});

export const fetchAbsence = createAsyncThunk(
  "appAbsences/fetchAbsence",
  async (id: number) => {
    const response = await axios.get(`${HOST}/absences/${id}`);
    return response.data;
  }
);

// ** Add Absences

export const addAbsence = createAsyncThunk(
  "appAbsences/addAbsence",
  async (data: AbsenceType) => {
    const response = await axios.post(`${HOST}/absences`, data);
    return response.data;
  }
);

// ** Update addAbsences

export const updateAbsence = createAsyncThunk(
  "appAbsences/updateAbsence",
  async (data: AbsenceType) => {
    const response = await axios.put(`${HOST}/absences`, data);
    return response.data;
  }
);

// ** Delete addAbsences
interface DeleteProps {
  id: number;
  headers: Headers;
}

export const deleteAbsence = createAsyncThunk(
  "appAbsences/deleteAbsence",
  async (id: number, { getState, dispatch }: Redux) => {
    await axios.delete(`${HOST}/absences/${id}`);
    return id;
  }
);

interface AppAbsencesState {
  absences: AbsenceType[];
  data: AbsenceType[];
  total: number;
  params: Record<string, any>;
  allData: AbsenceType[];
}

const initialState: AppAbsencesState = {
  absences: [],
  data: [],
  total: 1,
  params: {},
  allData: [],
};

export const appAbsencesSlice = createSlice({
  name: "appAbsences",
  initialState,
  reducers: {
    filterData: (state, action: PayloadAction<string>) => {
      const filterValue = action.payload.toLowerCase().trim();
      if (filterValue === "") {
        state.data = state.allData;
        return;
      }
      state.data = state.allData.filter(
        (absences) =>
          `${absences.absentUser.userData.firstName} ${absences.absentUser.userData.lastName}`
            .toLowerCase()
            .includes(filterValue) ||
          absences.startDate.toString().toLowerCase().includes(filterValue) ||
          absences.endDate.toString().toLowerCase().includes(filterValue) ||
          absences.absentUser.role.toLowerCase().includes(filterValue) ||
          absences.absentUser.email.toLowerCase().includes(filterValue)
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      const absences = action.payload.absences.map((absent: any) => {
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

        // absent.replacingUsers = absent.replacingUsers.map(
        //   (replaceUser: any) => {
        //     if (replaceUser.director) {
        //       replaceUser.userData = replaceUser.director;
        //     } else if (replaceUser.administrator) {
        //       replaceUser.userData = replaceUser.administrator;
        //     } else if (replaceUser.teacher) {
        //       replaceUser.userData = replaceUser.teacher;
        //     } else if (replaceUser.student) {
        //       replaceUser.userData = replaceUser.student;
        //     } else if (replaceUser.parent) {
        //       replaceUser = replaceUser.parent;
        //     } else if (replaceUser.agent) {
        //       replaceUser.userData = replaceUser.agent;
        //     }
        //     return replaceUser;
        //   }
        // );

        return absent;
      });

      state.data = absences;
      state.total = absences.length;
      state.allData = absences;
    });

    builder.addCase(fetchData.rejected, (state, action) => {
      toast.error("Erreur lors du chargement des absences");
    });

    builder.addCase(addAbsence.fulfilled, (state, action) => {
      state.data.push(action.payload);
      toast.success("L'absence a été ajouté avec succès");
    });

    builder.addCase(addAbsence.rejected, (state, action) => {
      toast.error("Erreur ajoutant l'absence");
    });

    builder.addCase(deleteAbsence.fulfilled, (state, action) => {
      state.data = state.data.filter(
        (addAbsences) => addAbsences.id !== action.payload
      );
      state.allData = state.allData.filter(
        (addAbsences) => addAbsences.id !== action.payload
      );
      toast.success("L'absence a été supprimé avec succès");
    });
    builder.addCase(deleteAbsence.rejected, (state, action) => {
      toast.error("Erreur supprimant l'absence");
    });
    builder.addCase(fetchAbsence.fulfilled, (state, action) => {
      const userIdToDelete = action.payload.id;

      state.data = state.data.filter((Parent) => Parent.id !== userIdToDelete);
      state.allData = state.allData.filter(
        (absent) => absent.id !== userIdToDelete
      );

      state.data.unshift(action.payload);
      state.allData.unshift(action.payload);
    });

    builder.addCase(updateAbsence.fulfilled, (state, action) => {
      const updateAbsence = action.payload;
      const index = state.allData.findIndex(
        (absent) => absent.id === updateAbsence.id
      );

      if (index !== -1) {
        state.data[index] = updateAbsence;
        state.allData[index] = updateAbsence;
        toast.success("L'absence a été modifié avec succès");
      }
    });
    builder.addCase(updateAbsence.rejected, (state, action) => {
      toast.error("Erreur modifiant l'absence");
    });
  },
});

export const { filterData } = appAbsencesSlice.actions;
export default appAbsencesSlice.reducer;
