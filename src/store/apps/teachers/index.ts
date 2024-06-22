import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  Dispatch,
} from "@reduxjs/toolkit";

import axios from "axios";
import toast from "react-hot-toast";
import { UpdateTeacherDto } from "src/pages/apps/enseignants/overview/[...params]";
import { HOST } from "src/store/constants/hostname";
import { TeachersType } from "src/types/apps/teacherTypes";
import { CreateTeacherAccountDto } from "src/views/apps/teacher/list/AddTeacherAccountDrawer";
import { CreateTeacherDto } from "src/views/apps/teacher/list/AddTeacherDrawer";

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

interface DeleteProps {
  id: number;
  headers: Headers;
}

interface AppTeacherState {
  data: TeachersType[];
  total: number;
  params: Record<string, any>;
  allData: TeachersType[];
  teacherId: number | null;
  teacherUserId: number | null;
}

const initialState: AppTeacherState = {
  data: [],
  total: 1,
  params: {},
  allData: [],
  teacherId: null,
  teacherUserId: null,
};

export const fetchData = createAsyncThunk("appTeachers/fetchData", async () => {
  const response = await axios.get(`${HOST}/teachers`);
  return response.data;
});

export const fetchTeacher = createAsyncThunk(
  "appTeachers/fetchTeacher",
  async (id: number) => {
    const response = await axios.get(`${HOST}/teachers/${id}`);
    return response.data;
  }
);

export const addTeacher = createAsyncThunk(
  "appTeachers/addTeachers",
  async (data: CreateTeacherDto) => {
    const formData = new FormData();

    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("dateOfBirth", data.dateOfBirth.toISOString());
    formData.append("dateOfEmployment", data.dateOfEmployment.toISOString());
    formData.append("phoneNumber", data.phoneNumber);
    formData.append("sex", data.sex);

    formData.append("createAccount", data.createAccount.toString());
    if (data.createAccount) {
      formData.append("createUserDto[email]", data.createUserDto?.email || "");
      formData.append(
        "createUserDto[password]",
        data.createUserDto?.password || ""
      );
      if (data.profileImage) {
        formData.append("profileImage", data.profileImage);
      }
    }

    const response = await axios.post(
      `${HOST}/teachers?create-account=${data.createAccount}`,
      formData
    );

    return response.data;
  }
);

export const addTeacherAccount = createAsyncThunk(
  "appTeachers/addTeacherAccount",
  async (
    payload: { id: number; data: CreateTeacherAccountDto },
    { getState, dispatch }: Redux
  ) => {
    const { id, data } = payload;
    const formData = new FormData();

    formData.append("email", data.email || "");
    formData.append("password", data.password || "");
    formData.append("profile-images", data.profileImage || "");

    const response = await axios.post(
      `${HOST}/teachers/${id}/create-account`,
      formData
    );
    return response.data;
  }
);

export const deleteTeacher = createAsyncThunk(
  "appTeachers/deleteTeachers",
  async (id: number, { getState, dispatch }: Redux) => {
    await axios.delete(`${HOST}/teachers/${id}`);
    return id;
  }
);

export const updateTeacher = createAsyncThunk(
  "appTeachers/updateTeacher",
  async (
    payload: { id: number; updateTeacherDto: UpdateTeacherDto },
    { getState, dispatch }: Redux
  ) => {
    const { id, updateTeacherDto } = payload;
    const response = await axios.patch(
      `${HOST}/teachers/${id}`,
      updateTeacherDto
    );
    return response.data;
  }
);

export const updateTeacherStatus = createAsyncThunk(
  "appTeachers/updateTeacherStatus",
  async ({ id, disabled }: { id: number; disabled: boolean }) => {
    try {
      const response = await axios.put<TeachersType>(
        `${HOST}/teachers/${id}/status`,
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

export const appTeachersSlice = createSlice({
  name: "appTeachers",
  initialState,
  reducers: {
    filterData: (state, action: PayloadAction<string>) => {
      const filterValue = action.payload.toLowerCase().trim();
      if (filterValue === "") {
        state.data = state.allData;
        return;
      }
      state.data = state.allData.filter(
        (teacher) =>
          `${teacher.firstName} ${teacher.lastName}`
            .toLowerCase()
            .includes(filterValue) ||
          teacher.phoneNumber.toLowerCase().includes(filterValue) ||
          teacher.dateOfBirth.toString().toLowerCase().includes(filterValue) ||
          teacher.dateOfEmployment
            .toString()
            .toLowerCase()
            .includes(filterValue) ||
          teacher.sex.toLowerCase().includes(filterValue) ||
          teacher.subjects.toLowerCase().includes(filterValue)
      );
    },
    setTeacherId: (state, action: PayloadAction<number | null>) => {
      state.teacherId = action.payload;
    },
    setTeacherUserId: (state, action: PayloadAction<number | null>) => {
      state.teacherUserId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.data = action.payload;
      state.total = action.payload.length;
      state.allData = action.payload;
    });
    builder.addCase(deleteTeacher.fulfilled, (state, action) => {
      state.data = state.data.filter(
        (teacher) => teacher.id !== action.payload
      );
      state.allData = state.allData.filter(
        (teacher) => teacher.id !== action.payload
      );
      toast.success("enseignant a été supprimé avec succès");
    });

    builder.addCase(addTeacher.fulfilled, (state, action) => {
      state.data.unshift(action.payload);
      state.allData.unshift(action.payload);
      toast.success("L'enseignant a été ajouté avec succès");
    });
    builder.addCase(addTeacher.rejected, (state, action) => {
      if (action.error.code === "ERR_BAD_REQUEST") {
        toast.error("Cet email est déjà utilisé");
        return;
      }
      toast.error("Erreur lors de l'ajout de l'enseignant");
    });
    builder.addCase(addTeacherAccount.fulfilled, (state, action) => {
      const updatedTeacher = action.payload;
      const index = state.allData.findIndex(
        (administrator) => administrator.id === updatedTeacher.id
      );

      if (index !== -1) {
        state.data[index] = updatedTeacher;
        state.allData[index] = updatedTeacher;
        toast.success("Le compte a été créé avec succès");
      }
    });
    builder.addCase(addTeacherAccount.rejected, (state, action) => {
      if (action.error.code === "ERR_BAD_REQUEST") {
        toast.error("Cet email est déjà utilisé");
        return;
      }
      toast.error("Erreur ajoutant le compte");
    });

    builder.addCase(deleteTeacher.rejected, (state, action) => {
      toast.error("Erreur supprimant l'enseignant");
    });
    builder.addCase(fetchTeacher.fulfilled, (state, action) => {
      const userIdToDelete = action.payload.id;

      state.data = state.data.filter(
        (teacher) => teacher.id !== userIdToDelete
      );
      state.allData = state.allData.filter(
        (teacher) => teacher.id !== userIdToDelete
      );

      state.data.unshift(action.payload);
      state.allData.unshift(action.payload);
    });

    builder.addCase(updateTeacher.fulfilled, (state, action) => {
      const index = state.data.findIndex(
        (item) => item.id === action.payload.id
      );
      state.data[index] = action.payload;
      toast.success("L'enseignant a été modifiée avec succès");
    });
    builder.addCase(updateTeacher.rejected, (state, action) => {
      toast.error("Erreur modifiant l'enseignant");
    });
    builder.addCase(updateTeacherStatus.fulfilled, (state, action) => {
      const deletedTeacherId = action.payload.id;
      state.data = state.data.filter(
        (teacher) => teacher.id !== deletedTeacherId
      );
      state.allData = state.allData.filter(
        (teacher) => teacher.id !== deletedTeacherId
      );
      toast.success("L'enseignant a été supprimé avec succès");
    });

    builder.addCase(updateTeacherStatus.rejected, (state, action) => {
      toast.error("Erreur   supprimant l'enseignant");
    });
  },
});

export const { setTeacherId } = appTeachersSlice.actions;
export const { setTeacherUserId } = appTeachersSlice.actions;
export const { filterData } = appTeachersSlice.actions;
export default appTeachersSlice.reducer;
