// ** Redux Imports
import { createSlice, createAsyncThunk, PayloadAction, Dispatch } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import { UpdateStudentDto } from 'src/pages/apps/etudiants/overview/[folder]'
import { StudentsType } from 'src/types/apps/studentTypes'
import { CreateStudentDto } from 'src/views/apps/student/list/AddStudentDrawer'

const HOST = process.env.NEXT_PUBLIC_API_URL

interface Params {
  q: string
}

interface Headers {
  Authorization: string
  [key: string]: string
}

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

// ** Fetch addStudents
export const fetchData = createAsyncThunk('appStudents/fetchData', async () => {
  const response = await axios.get(`${HOST}/students`)
  return response.data
})

export const fetchStudent = createAsyncThunk('appStudents/fetchStudent', async (id: number) => {
  const response = await axios.get(`${HOST}/students/${id}`);
  return response.data;
});

// ** Add User
export const addStudent = createAsyncThunk(
  'appStudents/addStudent',
  async (data: CreateStudentDto, { getState, dispatch }: Redux) => {
    const response = await axios.post(`${HOST}/students?create-account=${data.createAccount}`, data)
    return response.data
  }
)

export const updateStudent = createAsyncThunk(
  'appStudents/updateStudent',
  async (payload: { id: number, updateStudentDto: UpdateStudentDto }, { getState, dispatch }: Redux) => {
    const { id, updateStudentDto } = payload;
    const response = await axios.patch(`${HOST}/students/${id}`, updateStudentDto);
    return response.data;
  }
);

// ** Delete addStudent
interface DeleteProps {
  id: number
  headers: Headers
}

export const deleteStudent = createAsyncThunk(
  'appStudents/deleteStudent',
  async (id: number, { getState, dispatch }: Redux) => {
    console.log(id)
    await axios.delete(`${HOST}/students/${id}`)
    return id
  }
)

interface AppStaddStudentsState {
  data: StudentsType[]
  total: number
  params: Record<string, any>
  allData: StudentsType[]
  selectedId: number | null;
  selectedUserId: number | null;

}

const initialState: AppStaddStudentsState = {
  data: [],
  total: 1,
  params: {},
  allData: [],
  selectedId: null,
  selectedUserId: null,
}

export const appStudentsSlice = createSlice({
  name: 'appStudents',
  initialState,
  reducers: {
    filterData: (state, action: PayloadAction<string>) => {
      const filterValue = action.payload.toLowerCase().trim()
      if (filterValue === '') {
        state.data = state.allData
        return
      }
      state.data = state.allData.filter(
        students =>
          `${students.firstName} ${students.lastName}`.toLowerCase().includes(filterValue) ||
          students.dateOfBirth.toString().toLowerCase().includes(filterValue) ||
          students.sex.toLowerCase().includes(filterValue)
      )
    },
    setSelectedId: (state, action: PayloadAction<number | null>) => {
      state.selectedId = action.payload;
    },
    setSelectedUserId: (state, action: PayloadAction<number | null>) => {
      state.selectedUserId = action.payload;
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.data = action.payload
      state.total = action.payload.length
      state.allData = action.payload
    })
    builder.addCase(deleteStudent.fulfilled, (state, action) => {
      state.data = state.data.filter(StaddStudent => StaddStudent.id !== action.payload)
      state.allData = state.allData.filter(StaddStudent => StaddStudent.id !== action.payload)
    })

    builder.addCase(addStudent.fulfilled, (state, action) => {
      state.data.unshift(action.payload)
      state.allData.unshift(action.payload)
    })
    builder.addCase(fetchStudent.fulfilled, (state, action) => {
      const userIdToDelete = action.payload.id;

      // Filter out the existing user data with the same ID
      state.data = state.data.filter(student => student.id !== userIdToDelete);
      state.allData = state.allData.filter(student => student.id !== userIdToDelete);

      // Add the updated user data to the beginning of the arrays
      state.data.unshift(action.payload);
      state.allData.unshift(action.payload);
    });

    builder.addCase(updateStudent.fulfilled, (state, action) => {
      const updateStudent = action.payload;
      const index = state.allData.findIndex(student => student.id === updateStudent.id);

      if (index !== -1) {
        // If the student is found, update the data in both data and allData arrays
        state.data[index] = updateStudent;
        state.allData[index] = updateStudent;
      }
    });
  }

})

export const { setSelectedId } = appStudentsSlice.actions;
export const { setSelectedUserId } = appStudentsSlice.actions;
export const { filterData } = appStudentsSlice.actions
export default appStudentsSlice.reducer
