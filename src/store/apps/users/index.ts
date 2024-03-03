import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  Dispatch,
} from "@reduxjs/toolkit";

import axios from "axios";
import { UserType } from "src/types/apps/UserType";
const HOST = process.env.NEXT_PUBLIC_API_URL;

interface AppUserstate {
  data: UserType[];
  total: number;
  params: Record<string, any>;
  allData: UserType[];
  selectedId: number | null;
}

const initialState: AppUserstate = {
  data: [],
  total: 1,
  params: {},
  allData: [],
  selectedId: null,
};

export const fetchData = createAsyncThunk("appUsers/fetchData", async () => {
  const response = await axios.get(`${HOST}/users`);
  return response.data;
});

export const fetchUser = createAsyncThunk(
  "appUsers/fetchUser",
  async (id: number) => {
    const response = await axios.get(`${HOST}/users/${id}`);
    return response.data;
  }
);

export const fetchUserById = createAsyncThunk( "appUsers/fetchUserById", async (id
: number) => {
  const response = await axios.get(`${HOST}/users/${id}`);
  return response.data;
}
);

// export const deleteUser = createAsyncThunk(
//     'appUsers/deleteUsers',
//     async (id: number, { getState, dispatch }: Redux) => {
//         console.log(id)
//         await axios.delete(`${HOST}/Users/${id}`)
//         return id
//     })

// export const updateUser = createAsyncThunk(
//     'appUsers/updateUser',
//     async (payload: { id: number, updateUserDto: UpdateUserDto }, { getState, dispatch }: Redux) => {
//         const { id, updateUserDto } = payload;
//         const response = await axios.patch(`${HOST}/Users/${id}`, updateUserDto);
//         return response.data;
//     }
// );

export const appUsersSlice = createSlice({
  name: "appUsers",
  initialState,
  reducers: {
    filterData: (state, action: PayloadAction<string>) => {
      const filterValue = action.payload.toLowerCase().trim();
      if (filterValue === "") {
        state.data = state.allData;
        return;
      }
      state.data = state.allData.filter(
        (User) =>
          User.id.toString().toLowerCase().includes(filterValue) ||
          User.role.toLowerCase().includes(filterValue) ||
          User.isActive.toString().toLowerCase().includes(filterValue) ||
          User.email.toLowerCase().includes(filterValue)
      );
    },
    setSelectedId: (state, action: PayloadAction<number | null>) => {
      state.selectedId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      for (let user of action.payload) {
        if (user.director) {
          user.userData = user.director;
          delete user.director;
        } else if (user.administrator) {
          user.userData = user.administrator;
          delete user.administrator;
        } else if (user.teacher) {
          user.userData = user.teacher;
          delete user.teacher;
        } else if (user.student) {
          user.userData = user.student;
          delete user.student;
        } else if (user.parent) {
          user.userData = user.parent;
          delete user.parent;
        }
      }

      state.data = action.payload;
      state.total = action.payload.length;
      state.allData = action.payload;
    });
    // builder.addCase(deleteUser.fulfilled, (state, action) => {
    //     state.data = state.data.filter(User => User.id !== action.payload)
    //     state.allData = state.allData.filter(User => User.id !== action.payload)
    // })
    // builder.addCase(addUser.fulfilled, (state, action) => {
    //     state.data.unshift(action.payload)
    //     state.allData.unshift(action.payload)
    //     console.log(action.payload)
    // })
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      const userIdToDelete = action.payload.id;

      // Filter out the existing user data with the same ID
      state.data = state.data.filter((User) => User.id !== userIdToDelete);
      state.allData = state.allData.filter(
        (User) => User.id !== userIdToDelete
      );

      // Add the updated user data to the beginning of the arrays
      state.data.unshift(action.payload);
      state.allData.unshift(action.payload);
    });
    builder.addCase(fetchUserById.fulfilled, (state, action) => {
      const userIdToDelete = action.payload.id;

      // Filter out the existing user data with the same ID
      state.data = state.data.filter((User) => User.id !== userIdToDelete);
      state.allData = state.allData.filter(
        (User) => User.id !== userIdToDelete
      );

      // Add the updated user data to the beginning of the arrays
      state.data.unshift(action.payload);
      state.allData.unshift(action.payload);
    });
    // builder.addCase(updateUser.fulfilled, (state, action) => {
    //     const updateUser = action.payload;
    //     const index = state.allData.findIndex(User => User.id === updateUser.id);

    //     if (index !== -1) {
    //         // If the User is found, update the data in both data and allData arrays
    //         state.data[index] = updateUser;
    //         state.allData[index] = updateUser;
    //     }
    // })
  },
});

export const { setSelectedId } = appUsersSlice.actions;
export const { filterData } = appUsersSlice.actions;
export default appUsersSlice.reducer;
