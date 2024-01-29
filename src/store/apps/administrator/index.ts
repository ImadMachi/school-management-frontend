// ** Redux Imports
import { createSlice, createAsyncThunk, PayloadAction, Dispatch } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import { HOST } from 'src/store/constants/hostname'
import { AdministratorType } from 'src/types/apps/administratorTypes'
import { CreateAdministratorDto } from 'src/views/apps/administrators/list/AddAdministratorDrawer'

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

// ** Fetch Administrators
export const fetchData = createAsyncThunk('appAdministrators/fetchData', async () => {
  const response = await axios.get(`${HOST}/administrators`)
  return response.data
})

// ** Add User
export const addAdministrator = createAsyncThunk(
  'appAdministrators/addAdministrator',
  async (data: CreateAdministratorDto, { getState, dispatch }: Redux) => {
    const response = await axios.post(`${HOST}/administrators?create-account=${data.createAccount}`, data)
    return response.data
  }
)

// ** Delete Administrator
interface DeleteProps {
  id: number
  headers: Headers
}

export const deleteAdministrator = createAsyncThunk(
  'appAdministrators/deleteAdministrator',
  async (id: number, { getState, dispatch }: Redux) => {
    await axios.delete(`${HOST}/administrators/${id}`)
    return id
  }
)

interface AppAdministratorsState {
  data: AdministratorType[]
  total: number
  params: Record<string, any>
  allData: AdministratorType[]
}

const initialState: AppAdministratorsState = {
  data: [],
  total: 1,
  params: {},
  allData: []
}

export const appAdministratorsSlice = createSlice({
  name: 'appAdministrators',
  initialState,
  reducers: {
    filterData: (state, action: PayloadAction<string>) => {
      const filterValue = action.payload.toLowerCase().trim()
      if (filterValue === '') {
        state.data = state.allData
        return
      }
      state.data = state.allData.filter(
        administrator =>
          `${administrator.firstName} ${administrator.lastName}`.toLowerCase().includes(filterValue) ||
          administrator.phoneNumber.toLowerCase().includes(filterValue)
      )
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.data = action.payload
      state.total = action.payload.length
      state.allData = action.payload
    })
    builder.addCase(deleteAdministrator.fulfilled, (state, action) => {
      state.data = state.data.filter(administrator => administrator.id !== action.payload)
      state.allData = state.allData.filter(administrator => administrator.id !== action.payload)
    })

    builder.addCase(addAdministrator.fulfilled, (state, action) => {
      state.data.unshift(action.payload)
      state.allData.unshift(action.payload)
    })
  }
})

export const { filterData } = appAdministratorsSlice.actions
export default appAdministratorsSlice.reducer
