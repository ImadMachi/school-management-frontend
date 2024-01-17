import { Dispatch } from 'redux'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

import axios from 'axios'
import { TeachersType } from 'src/types/apps/teachers'
import build from 'next/dist/build'

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

interface DeleteProps {
    id: number
    headers: Headers
}


interface AppTeacherState {
    data: TeachersType[]
    total: number
    params: Record<string, any>
    allData: TeachersType[]
}


const initialState: AppTeacherState = {
    data: [],
    total: 1,
    params: {},
    allData: []
}


export const fetchData = createAsyncThunk(
    'appTeachers/fetchData', async ({ params, headers }: Data) => {
    const response = await axios.get(`${HOST}/teachers`, {
        params,
        headers
    })
    return response.data
}
)

export const addTeacher = createAsyncThunk(
    'appTeachers/addTeacher', 
    async (data: { [key: string]: number | string }, { getState, dispatch }: Redux) => {
    const response = await axios.post(`${HOST}/teachers`, data)
    return response.data
})

export const deleteTeacher = createAsyncThunk(
    'appTeachers/deleteTeacher',
     async ({ id, headers }: DeleteProps, { getState, dispatch }: Redux) => {
    await axios.delete(`${HOST}/teachers/${id}`, {
        headers
    })
    return id
})

export const updateTeacher = createAsyncThunk('appTeachers/updateTeacher',
 async (data: { [key: string]: number | string }, { getState, dispatch }: Redux) => {
    const response = await axios.put(`${HOST}/teachers/${data.id}`, data)
    return response.data
})

export const appTeachersSlice = createSlice({
    name: 'appTeachers',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchData.fulfilled, (state, action) => {
            state.data = action.payload
            // state.data = action.payload.data
            // state.total = action.payload.total
            // state.params = action.payload.params
            // state.allData = action.payload.data
        })
        builder.addCase(addTeacher.fulfilled, (state, action) => {
            state.data.push(action.payload)
        })
        builder.addCase(deleteTeacher.fulfilled, (state, action) => {
            state.data = state.data.filter((item) => item.id !== action.payload)
        })
        builder.addCase(updateTeacher.fulfilled, (state, action) => {
            const index = state.data.findIndex((item) => item.id === action.payload.id)
            state.data[index] = action.payload
        })

    }
})

export default appTeachersSlice.reducer;



