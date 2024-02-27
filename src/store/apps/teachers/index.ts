import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  Dispatch,
} from "@reduxjs/toolkit";

import axios from "axios";
import { UpdateTeacherDto } from "src/pages/apps/enseignants/overview/[folder]";
import { TeachersType } from "src/types/apps/teacherTypes";
import { CreateTeacherDto } from "src/views/apps/teacher/list/AddTeacherDrawer";

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

interface DeleteProps {
  id: number;
  headers: Headers;
}

interface AppTeacherState {
  data: TeachersType[];
  total: number;
  params: Record<string, any>;
  allData: TeachersType[];
  selectedId: number | null;
  selectedUserId: number | null;
}

const initialState: AppTeacherState = {
  data: [],
  total: 1,
  params: {},
  allData: [],
  selectedId: null,
  selectedUserId: null,
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

    // Append createAccount property explicitly
    formData.append('firstName', data.firstName);

    formData.append('lastName', data.lastName);

    formData.append('dateOfBirth', data.dateOfBirth.toString());    

    formData.append('dateOfEmployment', data.dateOfEmployment.toString());

    formData.append('phoneNumber', data.phoneNumber);

    formData.append('sex', data.sex);    

    formData.append('createAccount', data.createAccount.toString());

    formData.append('createUserDto[email]', data.createUserDto?.email || '');
    
    formData.append('createUserDto[password]', data.createUserDto?.password || '');
    
    formData.append('profileImage', data.profileImage || '');

    const response = await axios.post(`${HOST}/teachers?create-account=${data.createAccount}`, formData);
    console.log(response.data);
    return response.data;
  }
);


export const deleteTeacher = createAsyncThunk(
  "appTeachers/deleteTeachers",
  async (id: number, { getState, dispatch }: Redux) => {
    console.log(id);
    await axios.delete(`${HOST}/teachers/${id}`);
    return id;
  }
);

export const updateTeacher = createAsyncThunk(
  "appteachers/updateTeacher",
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
          teacher.sex.toLowerCase().includes(filterValue)
      );
    },
    setSelectedId: (state, action: PayloadAction<number | null>) => {
      state.selectedId = action.payload;
    },
    setSelectedUserId: (state, action: PayloadAction<number | null>) => {
      state.selectedUserId = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.data = action.payload;
      state.total = action.payload.length;
      state.allData = action.payload;
      console.log(action.payload);
    });
    builder.addCase(deleteTeacher.fulfilled, (state, action) => {
      state.data = state.data.filter(
        (teacher) => teacher.id !== action.payload
      );
      state.allData = state.allData.filter(
        (teacher) => teacher.id !== action.payload
      );
    });
    builder.addCase(addTeacher.fulfilled, (state, action) => {
      state.data.unshift(action.payload);
      state.allData.unshift(action.payload);
      console.log(action.payload);
    });
    builder.addCase(fetchTeacher.fulfilled, (state, action) => {
      const userIdToDelete = action.payload.id;

      // Filter out the existing user data with the same ID
      state.data = state.data.filter(
        (teacher) => teacher.id !== userIdToDelete
      );
      state.allData = state.allData.filter(
        (teacher) => teacher.id !== userIdToDelete
      );

      // Add the updated user data to the beginning of the arrays
      state.data.unshift(action.payload);
      state.allData.unshift(action.payload);
    });
    builder.addCase(updateTeacher.fulfilled, (state, action) => {
      const updateTeacher = action.payload;
      const index = state.allData.findIndex(
        (teacher) => teacher.id === updateTeacher.id
      );

      if (index !== -1) {
        // If the teacher is found, update the data in both data and allData arrays
        state.data[index] = updateTeacher;
        state.allData[index] = updateTeacher;
      }
    });
  },
});

export const { setSelectedId } = appTeachersSlice.actions;
export const { setSelectedUserId } = appTeachersSlice.actions;
export const { filterData } = appTeachersSlice.actions;
export default appTeachersSlice.reducer;
