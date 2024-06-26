// ** Redux Imports
import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
  Dispatch,
} from "@reduxjs/toolkit";

// ** Axios Imports
import axios from "axios";
import toast from "react-hot-toast";
import { UpdateAgentDto } from "src/pages/apps/agents/overview/[...params]";
import { HOST } from "src/store/constants/hostname";
import { AgentsType } from "src/types/apps/agentTypes";
import { CreateAgentAccountDto } from "src/views/apps/agents/list/AddAgentAccountDrawer";
import { CreateAgentDto } from "src/views/apps/agents/list/AddAgentDrawer";

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

// ** Fetch addAgents
export const fetchData = createAsyncThunk("appAgents/fetchData", async () => {
  const response = await axios.get(`${HOST}/agents`);
  return response.data;
});

export const fetchAgent = createAsyncThunk(
  "appAgents/fetchAgent",
  async (id: number) => {
    const response = await axios.get(`${HOST}/agents/${id}`);
    return response.data;
  }
);

// ** Add User

export const addAgent = createAsyncThunk(
  "appAgents/addAgent",
  async (data: CreateAgentDto) => {
    const formData = new FormData();

    formData.append("firstName", data.firstName);

    formData.append("lastName", data.lastName);

    formData.append("phoneNumber", data.phoneNumber);

    formData.append("createAccount", data.createAccount.toString() || "");

    if (data.createAccount) {
      formData.append("createUserDto[email]", data.createUserDto?.email || "");
      formData.append(
        "createUserDto[password]",
        data.createUserDto?.password || ""
      );
      formData.append("profile-images", data.profileImage || "");
    }
    const response = await axios.post(
      `${HOST}/agents?create-account=${data.createAccount}`,
      formData
    );
    return response.data;
  }
);

export const addAgentAccount = createAsyncThunk(
  "appAgents/addAgentAccount",
  async (
    payload: { id: number; data: CreateAgentAccountDto },
    { getState, dispatch }: Redux
  ) => {
    const { id, data } = payload;
    const formData = new FormData();

    formData.append("email", data.email || "");
    formData.append("password", data.password || "");
    formData.append("profile-images", data.profileImage || "");

    const response = await axios.post(
      `${HOST}/agents/${id}/create-account`,
      formData
    );
    return response.data;
  }
);

export const updateAgent = createAsyncThunk(
  "appAgents/updateAgent",
  async (
    payload: { id: number; updateAgentDto: UpdateAgentDto },
    { getState, dispatch }: Redux
  ) => {
    const { id, updateAgentDto } = payload;
    const response = await axios.patch(`${HOST}/agents/${id}`, updateAgentDto);
    return response.data;
  }
);

export const updateAgentStatus = createAsyncThunk(
  "appAgents/updateAgentStatus",
  async ({ id, disabled }: { id: number; disabled: boolean }) => {
    try {
      const response = await axios.put<AgentsType>(
        `${HOST}/agents/${id}/status`,
        {
          disabled,
        }
      );
      return response.data;
    } catch (error: any) {
      throw error.response.data.message;
    }
  }
);

// ** Delete addAgent
interface DeleteProps {
  id: number;
  headers: Headers;
}

export const deleteAgent = createAsyncThunk(
  "appAgents/deleteAgent",
  async (id: number, { getState, dispatch }: Redux) => {
    await axios.delete(`${HOST}/agents/${id}`);
    return id;
  }
);

interface AppaddAgentsState {
  data: AgentsType[];
  total: number;
  params: Record<string, any>;
  allData: AgentsType[];
  agentId: number | null;
  agentUserId: number | null;
}

const initialState: AppaddAgentsState = {
  data: [],
  total: 1,
  params: {},
  allData: [],
  agentId: null,
  agentUserId: null,
};

export const appAgentsSlice = createSlice({
  name: "appAgents",
  initialState,
  reducers: {
    filterData: (state, action: PayloadAction<string>) => {
      const filterValue = action.payload.toLowerCase().trim();
      if (filterValue === "") {
        state.data = state.allData;
        return;
      }
      state.data = state.allData.filter(
        (agents) =>
          `${agents.firstName} ${agents.lastName}`
            .toLowerCase()
            .includes(filterValue) ||
          agents.phoneNumber.toString().toLowerCase().includes(filterValue)
      );
    },
    setAgentId: (state, action: PayloadAction<number | null>) => {
      state.agentId = action.payload;
    },
    setAgentUserId: (state, action: PayloadAction<number | null>) => {
      state.agentUserId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchData.fulfilled, (state, action) => {
      state.data = action.payload;
      state.total = action.payload.length;
      state.allData = action.payload;
    });
    builder.addCase(deleteAgent.fulfilled, (state, action) => {
      state.data = state.data.filter(
        (addAgent) => addAgent.id !== action.payload
      );
      state.allData = state.allData.filter(
        (addAgent) => addAgent.id !== action.payload
      );
      toast.success("L'agent a été supprimé avec succès");
    });
    builder.addCase(deleteAgent.rejected, (state, action) => {
      toast.error("Erreur supprimant l'agent");
    });
    builder.addCase(addAgent.fulfilled, (state, action) => {
      state.data.unshift(action.payload);
      state.allData.unshift(action.payload);
      toast.success("L'agent a été ajouté avec succès");
    });
    builder.addCase(addAgent.rejected, (state, action) => {
      if (action.error.code === "ERR_BAD_REQUEST") {
        toast.error("Cet email est déjà utilisé");
        return;
      }
      toast.error("Erreur ajoutant l'agent");
    });

    builder.addCase(addAgentAccount.fulfilled, (state, action) => {
      const updatedAgent = action.payload;
      const index = state.allData.findIndex(
        (agent) => agent.id === updatedAgent.id
      );

      if (index !== -1) {
        state.data[index] = updatedAgent;
        state.allData[index] = updatedAgent;
        toast.success("Le compte a été créé avec succès");
      }
    });
    builder.addCase(addAgentAccount.rejected, (state, action) => {
      if (action.error.code === "ERR_BAD_REQUEST") {
        toast.error("Cet email est déjà utilisé");
        return;
      }
      toast.error("Erreur ajoutant le compte");
    });

    builder.addCase(fetchAgent.fulfilled, (state, action) => {
      const userIdToDelete = action.payload.id;

      // Filter out the existing user data with the same ID
      state.data = state.data.filter((Parent) => Parent.id !== userIdToDelete);
      state.allData = state.allData.filter(
        (agent) => agent.id !== userIdToDelete
      );

      // Add the updated user data to the beginning of the arrays
      state.data.unshift(action.payload);
      state.allData.unshift(action.payload);
    });

    builder.addCase(updateAgent.fulfilled, (state, action) => {
      const updateAgent = action.payload;
      const index = state.allData.findIndex(
        (agent) => agent.id === updateAgent.id
      );

      if (index !== -1) {
        // If the Parent is found, update the data in both data and allData arrays
        state.data[index] = updateAgent;
        state.allData[index] = updateAgent;
        toast.success("L'agent a été modifié avec succès");
      }
    });
    builder.addCase(updateAgent.rejected, (state, action) => {
      toast.error("Erreur modifiant l'agent");
    });
    builder.addCase(updateAgentStatus.fulfilled, (state, action) => {
      const deletedAgentId = action.payload.id;

      state.data = state.data.filter((agent) => agent.id !== deletedAgentId);
      state.allData = state.allData.filter(
        (agent) => agent.id !== deletedAgentId
      );
      toast.success("L'agent a été supprimé avec succès");
    });
    builder.addCase(updateAgentStatus.rejected, (state, action) => {
      toast.error("Erreur supprimant l'agent");
    });
  },
});

export const { setAgentId } = appAgentsSlice.actions;
export const { setAgentUserId } = appAgentsSlice.actions;
export const { filterData } = appAgentsSlice.actions;
export default appAgentsSlice.reducer;
