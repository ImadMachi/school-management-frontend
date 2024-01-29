// ** Redux Imports
import { createSlice, createAsyncThunk, PayloadAction, Dispatch } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
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

// ** Add User
export const addStudent = createAsyncThunk(
  'appStudents/addStudent',
  async (data: CreateStudentDto, { getState, dispatch }: Redux) => {
    const response = await axios.post(`${HOST}/students?create-account=${data.createAccount}`, data)
    return response.data
  }
)

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
}

const initialState: AppStaddStudentsState = {
  data: [],
  total: 1,
  params: {},
  allData: []
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
      state.allData = state.allData.filter(StaddStudent => StaddStudent.id !== action.payload)    })

    builder.addCase(addStudent.fulfilled, (state, action) => {
      state.data.unshift(action.payload)
      state.allData.unshift(action.payload)    })
  }
})

export const { filterData } = appStudentsSlice.actions
export default appStudentsSlice.reducer
