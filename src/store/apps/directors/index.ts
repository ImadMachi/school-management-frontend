// ** Redux Imports
import { createSlice, createAsyncThunk, PayloadAction, Dispatch } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import { HOST } from 'src/store/constants/hostname'
import { DirectorType } from 'src/types/apps/directorTypes'
import { CreateDirectorDto } from 'src/views/apps/directors/list/AddDirectorDrawer'
import { UpdateDirectorDto } from 'src/pages/apps/directeurs/overview/[folder]'


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

// ** Fetch directors
export const fetchData = createAsyncThunk('appDirectors/fetchData', async () => {
  const response = await axios.get(`${HOST}/directors`)
  return response.data
})

export const fetchDirector = createAsyncThunk( 'appDirectors/fetchDirector', async (id: number) => {
  const response = await axios.get(`${HOST}/directors/${id}`);
  return response.data;
});

// ** Add User

export const addDirector = createAsyncThunk(
  'appDirectors/addDirector',
  async (data: CreateDirectorDto) => {
    const formData = new FormData();

    // Append createAccount property explicitly
    formData.append('firstName', data.firstName);

    formData.append('lastName', data.lastName);

    formData.append('phoneNumber', data.phoneNumber);

    formData.append('createAccount', data.createAccount.toString());

    formData.append('createUserDto[email]', data.createUserDto?.email || '');
    
    formData.append('createUserDto[password]', data.createUserDto?.password || '');
    
    formData.append('profileImage', data.profileImage || '');

    const response = await axios.post(`${HOST}/directors?create-account=${data.createAccount}`, formData);
    console.log(response.data);
    return response.data;
  }
);
// ** Delete Director
interface DeleteProps {
  id: number
  headers: Headers
}

export const deleteDirector = createAsyncThunk(
  'appDirectors/deleteDirector',
  async (id: number, { getState, dispatch }: Redux) => {
    await axios.delete(`${HOST}/directors/${id}`)
    return id
  }
)

export const updateDirector = createAsyncThunk(
  'appDirectors/updateDirector',
  async (payload: { id: number, updateDirectorDto: UpdateDirectorDto }, { getState, dispatch }: Redux) => {
    const { id, updateDirectorDto } = payload;
    const response = await axios.patch(`${HOST}/directors/${id}`, updateDirectorDto);
    return response.data;
  }
);


interface appDirectorsState {
  data: DirectorType[]
  total: number
  params: Record<string, any>
  allData: DirectorType[]
  selectedId: number | null;
  selectUserId: number| null;

}

const initialState: appDirectorsState = {
  data: [],
  total: 1,
  params: {},
  allData: [],
  selectedId: null,
  selectUserId: null,
}

export const appDirectorsSlice = createSlice({
  name: 'appDirectors',
  initialState,
  reducers: {
    filterData: (state, action: PayloadAction<string>) => {
      const filterValue = action.payload.toLowerCase().trim()
      if (filterValue === '') {
        state.data = state.allData
        return
      }
      state.data = state.allData.filter(
        director =>
          `${director.firstName} ${director.lastName}`.toLowerCase().includes(filterValue) ||
          director.phoneNumber.toLowerCase().includes(filterValue)
      )
    },
    setSelectedId: (state, action: PayloadAction<number | null>) => {
      state.selectedId = action.payload;
    },
    setSelectedUserId: (state, action: PayloadAction<number | null>) => {
      state.selectUserId = action.payload;
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.data = action.payload
      state.total = action.payload.length
      state.allData = action.payload
    })
    builder.addCase(deleteDirector.fulfilled, (state, action) => {
      state.data = state.data.filter(Director => Director.id !== action.payload)
      state.allData = state.allData.filter(Director => Director.id !== action.payload)
    })

    builder.addCase(addDirector.fulfilled, (state, action) => {
      state.data.unshift(action.payload)
      state.allData.unshift(action.payload)
    })
    builder.addCase(fetchDirector.fulfilled, (state, action) => {
      const userIdToDelete = action.payload.id;
    
      // Filter out the existing user data with the same ID
      state.data = state.data.filter(Director => Director.id !== userIdToDelete);
      state.allData = state.allData.filter(Director => Director.id !== userIdToDelete);
    
      // Add the updated user data to the beginning of the arrays
      state.data.unshift(action.payload);
      state.allData.unshift(action.payload);
    });
    
    builder.addCase(updateDirector.fulfilled, (state, action) => {
      const updatedDirector = action.payload;
      const index = state.allData.findIndex(Director => Director.id === updatedDirector.id);
    
      if (index !== -1) {
        // If the Director is found, update the data in both data and allData arrays
        state.data[index] = updatedDirector;
        state.allData[index] = updatedDirector;
      }
    });
    
    
  }
})

export const { setSelectedId } = appDirectorsSlice.actions;
export const { setSelectedUserId } = appDirectorsSlice.actions;
export const { filterData } = appDirectorsSlice.actions
export default appDirectorsSlice.reducer
