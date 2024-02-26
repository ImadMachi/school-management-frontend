// ** Redux Imports
import { createSlice, createAsyncThunk, PayloadAction, Dispatch } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'
import { HOST } from 'src/store/constants/hostname'
import { AdministratorType } from 'src/types/apps/administratorTypes'
import { CreateAdministratorDto } from 'src/views/apps/administrators/list/AddAdministratorDrawer'
import { UpdateAdministratorDto } from 'src/pages/apps/administrateurs/overview/[folder]'
import { fr } from 'date-fns/locale'


// Use Record to define the type with known keys

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

export const fetchAdministrator = createAsyncThunk('appAdministrators/fetchAdministrator', async (id: number) => {
  const response = await axios.get(`${HOST}/administrators/${id}`);
  return response.data;
});


// export const addAdministrator = createAsyncThunk(
//   'appAdministrators/addAdministrator',
//   async (data: CreateAdministratorDto, { getState, dispatch }: Redux) => {
//     const response = await axios.post(`${HOST}/administrators?create-account=${data.createAccount}`, data)
//     return response.data
//   }
// )

export const addAdministrator = createAsyncThunk(
  'appAdministrators/addAdministrator',
  async (data: CreateAdministratorDto) => {
    const formData = new FormData();

    // Append createAccount property explicitly
    formData.append('firstName', data.firstName);

    formData.append('lastName', data.lastName);

    formData.append('phoneNumber', data.phoneNumber);

    formData.append('createAccount', data.createAccount.toString());

    formData.append('createUserDto[email]', data.createUserDto?.email || '');
    
    formData.append('createUserDto[password]', data.createUserDto?.password || '');
    
    formData.append('profileImage', data.profileImage || '');

    // // Append createUserDto properties
    // if (data.createUserDto && data.createAccount) {
    //   Object.entries(data.createUserDto).forEach(([key, value]) => {
    //     // Append properties with the desired format
    //     formData.append(`createUserDto[${key}]`, value.toString());
    //   });
    // }

    const response = await axios.post(`${HOST}/administrators?create-account=${data.createAccount}`, formData);
    console.log(response.data);
    return response.data;
  }
);

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

export const updateAdministrator = createAsyncThunk(
  'appAdministrators/updateAdministrator',
  async (payload: { id: number, updateAdministratorDto: UpdateAdministratorDto }, { getState, dispatch }: Redux) => {
    const { id, updateAdministratorDto } = payload;
    const response = await axios.patch(`${HOST}/administrators/${id}`, updateAdministratorDto);
    return response.data;
  }
);


interface AppAdministratorsState {
  data: AdministratorType[]
  total: number
  params: Record<string, any>
  allData: AdministratorType[]
  selectedId: number | null;
  selectUserId: number | null;

}

const initialState: AppAdministratorsState = {
  data: [],
  total: 1,
  params: {},
  allData: [],
  selectedId: null,
  selectUserId: null,
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
    builder.addCase(deleteAdministrator.fulfilled, (state, action) => {
      state.data = state.data.filter(administrator => administrator.id !== action.payload)
      state.allData = state.allData.filter(administrator => administrator.id !== action.payload)
    })

    builder.addCase(addAdministrator.fulfilled, (state, action) => {
      state.data.unshift(action.payload)
      state.allData.unshift(action.payload)
    })
    builder.addCase(fetchAdministrator.fulfilled, (state, action) => {
      const userIdToDelete = action.payload.id;

      // Filter out the existing user data with the same ID
      state.data = state.data.filter(administrator => administrator.id !== userIdToDelete);
      state.allData = state.allData.filter(administrator => administrator.id !== userIdToDelete);

      // Add the updated user data to the beginning of the arrays
      state.data.unshift(action.payload);
      state.allData.unshift(action.payload);
    });

    builder.addCase(updateAdministrator.fulfilled, (state, action) => {
      const updatedAdministrator = action.payload;
      const index = state.allData.findIndex(administrator => administrator.id === updatedAdministrator.id);

      if (index !== -1) {
        // If the administrator is found, update the data in both data and allData arrays
        state.data[index] = updatedAdministrator;
        state.allData[index] = updatedAdministrator;
      }
    });


  }
})

export const { setSelectedId } = appAdministratorsSlice.actions;
export const { setSelectedUserId } = appAdministratorsSlice.actions;
export const { filterData } = appAdministratorsSlice.actions
export default appAdministratorsSlice.reducer
