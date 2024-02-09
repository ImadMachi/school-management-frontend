import { createSlice, createAsyncThunk, PayloadAction, Dispatch } from '@reduxjs/toolkit'

import axios from 'axios'
import { UpdateTeacherDto } from 'src/pages/apps/teachers/overview/[folder]'
import { TeachersType } from 'src/types/apps/teacherTypes'
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
    selectedId: number | null;

}


const initialState: AppTeacherState = {
    data: [],
    total: 1,
    params: {},
    allData: [],
    selectedId: null
}


export const fetchData = createAsyncThunk('appTeachers/fetchData', async () => {
    const response = await axios.get(`${HOST}/teachers`)
    return response.data;
}
)

export const fetchTeacher = createAsyncThunk('appTeachers/fetchTeacher', async (id: number) => {
    const response = await axios.get(`${HOST}/teachers/${id}`);
    return response.data;
});

export const addTeacher = createAsyncThunk(
    'appTeachers/addTeachers',
    async (data: CreateTeacherDto, { getState, dispatch }: Redux) => {
        try {
            console.log('Request Payload:', data); // Add this line to log the payload
            const response = await axios.post(`${HOST}/teachers?create-account=true`, data)
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

export const updateTeacher = createAsyncThunk(
    'appteachers/updateTeacher',
    async (payload: { id: number, updateTeacherDto: UpdateTeacherDto }, { getState, dispatch }: Redux) => {
        const { id, updateTeacherDto } = payload;
        const response = await axios.patch(`${HOST}/teachers/${id}`, updateTeacherDto);
        return response.data;
    }
);

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
                    teacher.phoneNumber.toLowerCase().includes(filterValue) ||
                    teacher.dateOfBirth.toString().toLowerCase().includes(filterValue) ||
                    teacher.dateOfEmployment.toString().toLowerCase().includes(filterValue) ||
                    teacher.sex.toLowerCase().includes(filterValue)
            )
        },
        setSelectedId: (state, action: PayloadAction<number | null>) => {
            state.selectedId = action.payload;
        },
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
        builder.addCase(fetchTeacher.fulfilled, (state, action) => {
            const userIdToDelete = action.payload.id;

            // Filter out the existing user data with the same ID
            state.data = state.data.filter(teacher => teacher.id !== userIdToDelete);
            state.allData = state.allData.filter(teacher => teacher.id !== userIdToDelete);

            // Add the updated user data to the beginning of the arrays
            state.data.unshift(action.payload);
            state.allData.unshift(action.payload);
        })
        builder.addCase(updateTeacher.fulfilled, (state, action) => {
            const updateTeacher = action.payload;
            const index = state.allData.findIndex(teacher => teacher.id === updateTeacher.id);

            if (index !== -1) {
                // If the teacher is found, update the data in both data and allData arrays
                state.data[index] = updateTeacher;
                state.allData[index] = updateTeacher;
            }
        })
    }
})

export const { setSelectedId } = appTeachersSlice.actions;
export const { filterData } = appTeachersSlice.actions;
export default appTeachersSlice.reducer;



