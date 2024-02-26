// ** Redux Imports
import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  Dispatch,
} from "@reduxjs/toolkit";

// ** Axios Imports
import axios from "axios";
import { UpdateParentDto } from "src/pages/apps/parents/overview/[folder]";
import { ParentsType } from "src/types/apps/parentTypes";
import { CreateParentDto } from "src/views/apps/parents/list/AddParentDrawer";

const HOST = process.env.NEXT_PUBLIC_API_URL;

interface Params {
  q: string;
}

interface Headers {
  Authorization: string;
  [key: string]: string;
}

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

// ** Fetch addParents
export const fetchData = createAsyncThunk("appParents/fetchData", async () => {
  const response = await axios.get(`${HOST}/parents`);
  return response.data;
});

export const fetchParent = createAsyncThunk(
  "appParents/fetchParent",
  async (id: number) => {
    const response = await axios.get(`${HOST}/parents/${id}`);
    return response.data;
  }
);

// ** Add User
export const addParent = createAsyncThunk(
  "appParents/addParent",
  async (data: CreateParentDto, { getState, dispatch }: Redux) => {
    const response = await axios.post(
      `${HOST}/parents?create-account=${data.createAccount}`,
      data
    );
    return response.data;
  }
);

export const updateParent = createAsyncThunk(
  "appParents/updateParent",
  async (
    payload: { id: number; updateParentDto: UpdateParentDto },
    { getState, dispatch }: Redux
  ) => {
    const { id, updateParentDto } = payload;
    const response = await axios.patch(
      `${HOST}/parents/${id}`,
      updateParentDto
    );
    return response.data;
  }
);

// ** Delete addParent
interface DeleteProps {
  id: number;
  headers: Headers;
}

export const deleteParent = createAsyncThunk(
  "appParents/deleteParent",
  async (id: number, { getState, dispatch }: Redux) => {
    await axios.delete(`${HOST}/parents/${id}`);
    return id;
  }
);

interface AppaddParentsState {
  data: ParentsType[];
  total: number;
  params: Record<string, any>;
  allData: ParentsType[];
  selectedId: number | null;
  selectedUserId: number | null;
}

const initialState: AppaddParentsState = {
  data: [],
  total: 1,
  params: {},
  allData: [],
  selectedId: null,
  selectedUserId: null,
};

export const appParentsSlice = createSlice({
  name: "appParents",
  initialState,
  reducers: {
    filterData: (state, action: PayloadAction<string>) => {
      const filterValue = action.payload.toLowerCase().trim();
      if (filterValue === "") {
        state.data = state.allData;
        return;
      }
      state.data = state.allData.filter(
        (parents) =>
          `${parents.firstName} ${parents.lastName}`
            .toLowerCase()
            .includes(filterValue) ||
          parents.phoneNumber.toString().toLowerCase().includes(filterValue)
      );
    },
    setSelectedId: (state, action: PayloadAction<number | null>) => {
      state.selectedId = action.payload;
    },
    setSelectedUserId: (state, action: PayloadAction<number | null>) => {
      state.selectedUserId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.data = action.payload;
      state.total = action.payload.length;
      state.allData = action.payload;
    });
    builder.addCase(deleteParent.fulfilled, (state, action) => {
      state.data = state.data.filter(
        (addParent) => addParent.id !== action.payload
      );
      state.allData = state.allData.filter(
        (addParent) => addParent.id !== action.payload
      );
    });

    builder.addCase(addParent.fulfilled, (state, action) => {
      state.data.unshift(action.payload);
      state.allData.unshift(action.payload);
    });
    builder.addCase(fetchParent.fulfilled, (state, action) => {
      const userIdToDelete = action.payload.id;

      // Filter out the existing user data with the same ID
      state.data = state.data.filter((Parent) => Parent.id !== userIdToDelete);
      state.allData = state.allData.filter(
        (Parent) => Parent.id !== userIdToDelete
      );

      // Add the updated user data to the beginning of the arrays
      state.data.unshift(action.payload);
      state.allData.unshift(action.payload);
    });

    builder.addCase(updateParent.fulfilled, (state, action) => {
      const updateParent = action.payload;
      const index = state.allData.findIndex(
        (parent) => parent.id === updateParent.id
      );

      if (index !== -1) {
        // If the Parent is found, update the data in both data and allData arrays
        state.data[index] = updateParent;
        state.allData[index] = updateParent;
      }
    });
  },
});

export const { setSelectedId } = appParentsSlice.actions;
export const { setSelectedUserId } = appParentsSlice.actions;
export const { filterData } = appParentsSlice.actions;
export default appParentsSlice.reducer;
