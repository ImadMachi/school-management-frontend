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
import { UpdateStudentDto } from "src/pages/apps/eleves/overview/[folder]";
import { StudentsType } from "src/types/apps/studentTypes";
import { CreateStudentDto } from "src/views/apps/student/list/AddStudentDrawer";

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

// ** Fetch addStudents
export const fetchData = createAsyncThunk("appStudents/fetchData", async () => {
  const response = await axios.get(`${HOST}/students`);
  return response.data;
});

export const fetchStudent = createAsyncThunk(
  "appStudents/fetchStudent",
  async (id: number) => {
    const response = await axios.get(`${HOST}/students/${id}`);
    return response.data;
  }
);

// ** Add User
export const addStudent = createAsyncThunk(
  "appStudents/addStudent",
  async (data: CreateStudentDto) => {
    const formData = new FormData();

    // Append createAccount property explicitly
    formData.append("firstName", data.firstName);

    formData.append("lastName", data.lastName);

    formData.append("identification", data.identification);

    formData.append("dateOfBirth", data.dateOfBirth.toString());

    formData.append("sex", data.sex);

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
      `${HOST}/students?create-account=${data.createAccount}`,
      formData
    );
    console.log(response.data);
    return response.data;
  }
);

export const updateStudent = createAsyncThunk(
  "appStudents/updateStudent",
  async (
    payload: { id: number; updateStudentDto: UpdateStudentDto },
    { getState, dispatch }: Redux
  ) => {
    const { id, updateStudentDto } = payload;
    const response = await axios.patch(
      `${HOST}/students/${id}`,
      updateStudentDto
    );
    return response.data;
  }
);

// ** Delete addStudent
interface DeleteProps {
  id: number;
  headers: Headers;
}

export const deleteStudent = createAsyncThunk(
  "appStudents/deleteStudent",
  async (id: number, { getState, dispatch }: Redux) => {
    await axios.delete(`${HOST}/students/${id}`);
    return id;
  }
);

interface AppAddStudentsState {
  data: StudentsType[];
  total: number;
  params: Record<string, any>;
  allData: StudentsType[];
  studentId: number | null;
  studentUserId: number | null;
}

const initialState: AppAddStudentsState = {
  data: [],
  total: 1,
  params: {},
  allData: [],
  studentId: null,
  studentUserId: null,
};

export const appStudentsSlice = createSlice({
  name: "appStudents",
  initialState,
  reducers: {
    filterData: (state, action: PayloadAction<string>) => {
      const filterValue = action.payload.toLowerCase().trim();
      if (filterValue === "") {
        state.data = state.allData;
        return;
      }
      state.data = state.allData.filter(
        (student) =>
          `${student.firstName} ${student.lastName}`
            .toLowerCase()
            .includes(filterValue) ||
          student.identification.includes(filterValue) ||
          student.dateOfBirth.toString().toLowerCase().includes(filterValue) ||
          student.sex.toLowerCase().includes(filterValue)
      );
    },
    setStudentId: (state, action: PayloadAction<number | null>) => {
      state.studentId = action.payload;
    },
    setStudentUserId: (state, action: PayloadAction<number | null>) => {
      state.studentUserId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.data = action.payload;
      state.total = action.payload.length;
      state.allData = action.payload;
    });
    builder.addCase(deleteStudent.fulfilled, (state, action) => {
      state.data = state.data.filter(
        (student) => student.id !== action.payload
      );
      state.allData = state.allData.filter(
        (student) => student.id !== action.payload
      );
      toast.success("L'élève a été supprimé avec succès");
    });
    builder.addCase(deleteStudent.rejected, (state, action) => {
      toast.error("Erreur supprimant l'élève");
    });

    builder.addCase(addStudent.fulfilled, (state, action) => {
      state.data.unshift(action.payload);
      state.allData.unshift(action.payload);
      toast.success("L'élève a été ajouté avec succès");
    });
    builder.addCase(addStudent.rejected, (state, action) => {
      toast.error("Erreur ajoutant l'élève");
    });
    builder.addCase(fetchStudent.fulfilled, (state, action) => {
      const userIdToDelete = action.payload.id;

      // Filter out the existing user data with the same ID
      state.data = state.data.filter(
        (administrator) => administrator.id !== userIdToDelete
      );
      state.allData = state.allData.filter(
        (administrator) => administrator.id !== userIdToDelete
      );

      // Add the updated user data to the beginning of the arrays
      state.data.unshift(action.payload);
      state.allData.unshift(action.payload);
    });

    builder.addCase(updateStudent.fulfilled, (state, action) => {
      const updatedStudent = action.payload;
      const index = state.allData.findIndex(
        (student) => student.id === updatedStudent.id
      );

      if (index !== -1) {
        // If the administrator is found, update the data in both data and allData arrays
        state.data[index] = updatedStudent;
        state.allData[index] = updatedStudent;
        toast.success("L'élève a été modifié avec succès");
      }
    });
    builder.addCase(updateStudent.rejected, (state, action) => {
      toast.error("Erreur modifiant l'élève");
    });
  },
});

export const { setStudentId } = appStudentsSlice.actions;
export const { setStudentUserId } = appStudentsSlice.actions;
export const { filterData } = appStudentsSlice.actions;
export default appStudentsSlice.reducer;
