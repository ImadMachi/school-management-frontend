// ** Redux Imports
import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import { AdministratorType } from 'src/types/apps/administratorTypes'

const HOST = process.env.NEXT_PUBLIC_API_URL

interface Params {
  q: string
}

interface Headers {
  Authorization: string
  [key: string]: string
}

interface Data {
  params: Params
  headers: Headers
}

interface Redux {
  getState: any
  dispatch: Dispatch<any>
}

// ** Fetch Administrators
export const fetchData = createAsyncThunk('appAdministrators/fetchData', async ({ params, headers }: Data) => {
  const response = await axios.get(`${HOST}/administrators`, {
    params,
    headers
  })

  return response.data
})

// ** Add User
export const addAdministrator = createAsyncThunk(
  'appAdministrators/addAdministrator',
  async (data: { [key: string]: number | string }, { getState, dispatch }: Redux) => {
    const response = await axios.post(`${HOST}/administrators`, data)
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
  async ({ id, headers }: DeleteProps, { getState, dispatch }: Redux) => {
    await axios.delete(`${HOST}/administrators/${id}`, {
      headers
    })

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
  reducers: {},
  extraReducers: builder => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.data = action.payload
      // state.data = action.payload.data
      // state.total = action.payload.total
      // state.params = action.payload.params
      // state.allData = action.payload.allData
    })
    builder.addCase(deleteAdministrator.fulfilled, (state, action) => {
      state.data = state.data.filter(administrator => administrator.id !== action.payload)
    })

    builder.addCase(addAdministrator.fulfilled, (state, action) => {
      state.data.unshift(action.payload)
    })
    builder.addCase(addAdministrator.rejected, (state, action) => {})
  }
})

export default appAdministratorsSlice.reducer
