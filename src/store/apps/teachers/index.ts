import { createSlice, createAsyncThunk, PayloadAction, Dispatch } from '@reduxjs/toolkit'

import axios from 'axios'
import { TeachersType } from 'src/types/apps/teachers'
import { CreateTeacherDto } from 'src/views/apps/teacher/list/AddTeacherDrawer'

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


export const fetchData = createAsyncThunk('appTeachers/fetchData', async () => {
    const response = await axios.get(`${HOST}/teachers`)
    return response.data;
}
)

export const addTeacher = createAsyncThunk(
    'appTeachers/addTeachers',
    async (data: CreateTeacherDto, { getState, dispatch }: Redux) => {
        try {
            console.log('Request Payload:', data); // Add this line to log the payload
            const response = await axios.post(`${HOST}/teachers?create-account=${data.createAccount}`, data)
            return response.data;
        }
        catch (error) {
            console.error('Error adding teacher:', error);
            throw error;
        }
    }

)

export const deleteTeacher = createAsyncThunk(
    'appTeachers/deleteTeachers',
    async (id: number, { getState, dispatch }: Redux) => {
        console.log(id)
        await axios.delete(`${HOST}/teachers/${id}`)
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
    reducers: {
        filterData: (state, action: PayloadAction<string>) => {
            const filterValue = action.payload.toLowerCase().trim()
            if (filterValue === '') {
                state.data = state.allData
                return
            }
            state.data = state.allData.filter(
                teacher =>
                    `${teacher.firstName} ${teacher.lastName}`.toLowerCase().includes(filterValue) ||
                    teacher.phoneNumber.toLowerCase().includes(filterValue) || teacher.sex.toLowerCase().includes(filterValue) ||
                    `${teacher.dateOfBirth} ${teacher.dateOfEmployment}`.toLowerCase().includes(filterValue) 
            )
        }
    },
    extraReducers: builder => {
        builder.addCase(fetchData.fulfilled, (state, action) => {
            state.data = action.payload
            state.total = action.payload.length
            state.allData = action.payload
            console.log(action.payload)
        })
        builder.addCase(deleteTeacher.fulfilled, (state, action) => {
            state.data = state.data.filter(teacher => teacher.id !== action.payload)
            state.allData = state.allData.filter(teacher => teacher.id !== action.payload)
        })
        builder.addCase(addTeacher.fulfilled, (state, action) => {
            state.data.unshift(action.payload)
            state.allData.unshift(action.payload)
            console.log(action.payload)
        })
        builder.addCase(updateTeacher.fulfilled, (state, action) => {
            const index = state.data.findIndex((item) => item.id === action.payload.id)
            state.data[index] = action.payload
        })

    }
})
export const { filterData } = appTeachersSlice.actions;
export default appTeachersSlice.reducer;



