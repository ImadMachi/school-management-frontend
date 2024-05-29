// ** Redux Imports
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// ** Axios Imports
import axios from "axios";
import toast from "react-hot-toast";

// ** Types
import { Dispatch } from "redux";
import { HOST } from "src/store/constants/hostname";
import {
  MailType,
  UpdateMailLabelType,
  FetchMailParamsType,
  UpdateMailParamsType,
  PaginateMailParamsType,
  MailFolderType,
  SendMailParamsType,
  FetchMailByUserIdParamsType,
} from "src/types/apps/mailTypes";

interface ReduxType {
  getState: any;
  dispatch: Dispatch<any>;
}

/************** map MailFolderType to appropriate value for backend ******************* */
type MailEntityMap = {
  [Key in MailFolderType]:
    | "recipients"
    | "sender"
    | "draft"
    | "starredBy"
    | "spam"
    | "trashedBy";
};

const mapMailFolderToEntity = (
  folder: MailFolderType
): MailEntityMap[MailFolderType] => {
  switch (folder) {
    case "inbox":
      return "recipients";
    case "sent":
      return "sender";
    case "draft":
      return "draft";
    case "starred":
      return "starredBy";
    case "spam":
      return "spam";
    case "trash":
      return "trashedBy";
    default:
      throw new Error("Invalid mail folder type");
  }
};

// ** Fetch Mails
export const fetchMails = createAsyncThunk(
  "appEmail/fetchMails",
  async (params: FetchMailParamsType) => {
    const entityFolder = mapMailFolderToEntity(params.folder);

    const response = await axios.get(
      `${HOST}/messages/auth?folder=${entityFolder}&text=${params.q}&categoryId=${params.selectedCategory}&groupId=${params.selectedGroup}`
    );

    return { mails: response.data, filter: params };
  }
);

export const fetchMailsByUserId = createAsyncThunk(
  "appEmail/fetchMailsByUserId",
  async (params: FetchMailByUserIdParamsType) => {
    const entityFolder = mapMailFolderToEntity(params.folder);
    const response = await axios.get(
      `${HOST}/messages/user/${params.userId}?folder=${entityFolder}&text=${params.q}&categoryId=${params.selectedCategory}&groupId=${params.selectedGroup}`
    );
    return { mails: response.data, filter: params };
  }
);

// ** Send Mail
export const sendMail = createAsyncThunk(
  "appEmail/sendMail",
  async (data: SendMailParamsType) => {
    const formData = new FormData();
    formData.append("subject", data.subject);
    formData.append("body", data.body);

    for (let i = 0; i < data.recipients.length; i++) {
      formData.append(`recipients[${i}][id]`, data.recipients[i].id.toString());
    }

    if (data.attachments) {
      for (let file of data.attachments) {
        formData.append(file.name, file);
      }
    }

    formData.append("categoryId", data.category.toString());

    const response = await axios.post(`${HOST}/messages`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }
);

// ** Get Current Mail
export const getCurrentMail = createAsyncThunk(
  "appEmail/selectMail",
  async (id: number | string) => {
    const response = await axios.get(`${HOST}/messages/${id}`);

    return response.data;
  }
);

// ** Mark Mail as Read
export const markAsRead = createAsyncThunk(
  "appEmail/markAsRead",
  async (id: number | string) => {
    const response = await axios.post(`${HOST}/messages/${id}/read`);
    return id;
  }
);

// ** Mark Mails as Starred
export const markAsStarred = createAsyncThunk(
  "appEmail/markAsStarred",
  async (id: number) => {
    const response = await axios.post(`${HOST}/messages/${id}/star`);
    return id;
  }
);

export const markAsUnStarred = createAsyncThunk(
  "appEmail/markAsUnStarred",
  async ({ id, folder }: { id: number; folder: MailFolderType }) => {
    const response = await axios.delete(`${HOST}/messages/${id}/unstar`);
    return { id, folder };
  }
);

export const moveToTrash = createAsyncThunk(
  "appEmail/moveToTrash",
  async ({ id, folder }: { id: number; folder: MailFolderType }) => {
    const response = await axios.post(`${HOST}/messages/${id}/trash`);
    return { id, folder };
  }
);

export const moveFromTrash = createAsyncThunk(
  "appEmail/moveFromTrash",
  async ({ id, folder }: { id: number; folder: MailFolderType }) => {
    const response = await axios.delete(`${HOST}/messages/${id}/untrash`);
    return { id, folder };
  }
);

export const paginateMail = createAsyncThunk(
  "appEmail/paginateMail",
  async (params: PaginateMailParamsType) => {
    const entityFolder = mapMailFolderToEntity(params.folder);

    const response = await axios.get(
      `${HOST}/messages/auth?folder=${entityFolder}&offset=${params.offset}&text=${params.q}&categoryId=${params.selectedCategory}&groupId=${params.selectedGroup}`
    );

    return { mails: response.data, filter: params };
  }
);

interface InitialStateProps {
  mails: MailType[];
  mailMeta: any;
  filter: FetchMailParamsType;
  currentMail: MailType | null;
  selectedMails: number[];
  newRecipientCount: number; 
}

const initialState: InitialStateProps = {
  mails: [],
  mailMeta: null,
  filter: {
    q: "",
    //@ts-ignore
    label: "",
    folder: "inbox",
  },
  currentMail: null,
  selectedMails: [],
  newRecipientCount: 0,
};

export const appEmailSlice = createSlice({
  name: "appEmail",
  initialState,
  reducers: {
    handleSelectMail: (state, action) => {
      const mails: any = state.selectedMails;
      if (!mails.includes(action.payload)) {
        mails.push(action.payload);
      } else {
        mails.splice(mails.indexOf(action.payload), 1);
      }
      state.selectedMails = mails;
    },
    handleSelectAllMail: (state, action) => {
      const selectAllMails: number[] = [];
      if (action.payload && state.mails !== null) {
        selectAllMails.length = 0;

        // @ts-ignore
        state.mails.forEach((mail: MailType) => selectAllMails.push(mail.id));
      } else {
        selectAllMails.length = 0;
      }
      state.selectedMails = selectAllMails as any;
    },
    resetNewRecipientCount: (state) => {  // Add this reducer
      state.newRecipientCount = 0;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMails.fulfilled, (state, action) => {
      const newRecipients = action.payload.mails.filter((mail: { id: any; }) => 
        !state.mails.some(existingMail => existingMail.id === mail.id)
      ).length;

      state.newRecipientCount += newRecipients;
      
      const mails = action.payload.mails.map((mail: any) => {
        if (mail.sender.director) {
          mail.sender.senderData = mail.sender.director;
          delete mail.sender.director;
        } else if (mail.sender.administrator) {
          mail.sender.senderData = mail.sender.administrator;
          delete mail.sender.administrator;
        } else if (mail.sender.teacher) {
          mail.sender.senderData = mail.sender.teacher;
          delete mail.sender.teacher;
        } else if (mail.sender.student) {
          mail.sender.senderData = mail.sender.student;
          delete mail.sender.student;
        } else if (mail.sender.parent) {
          mail.sender.senderData = mail.sender.parent;
          delete mail.sender.parent;
        }

        return mail;
      });

      state.mails = mails;
      state.filter = action.payload.filter;
    });

    builder.addCase(fetchMails.rejected, (state, action) => {
      toast.error("Erreur lors du chargement des messages");
    });

    builder.addCase(getCurrentMail.fulfilled, (state, action) => {
      const mail = action.payload;
      if (mail.sender.director) {
        mail.sender.senderData = mail.sender.director;
        delete mail.sender.director;
      } else if (mail.sender.administrator) {
        mail.sender.senderData = mail.sender.administrator;
        delete mail.sender.administrator;
      } else if (mail.sender.teacher) {
        mail.sender.senderData = mail.sender.teacher;
        delete mail.sender.teacher;
      } else if (mail.sender.student) {
        mail.sender.senderData = mail.sender.student;
        delete mail.sender.student;
      } else if (mail.sender.parent) {
        mail.sender.senderData = mail.sender.parent;
        delete mail.sender.parent;
      }

      state.currentMail = mail;
    });

    builder.addCase(paginateMail.fulfilled, (state, action) => {
      const mails = action.payload.mails.map((mail: any) => {
        if (mail.sender.director) {
          mail.sender.senderData = mail.sender.director;
          delete mail.sender.director;
        } else if (mail.sender.administrator) {
          mail.sender.senderData = mail.sender.administrator;
          delete mail.sender.administrator;
        } else if (mail.sender.teacher) {
          mail.sender.senderData = mail.sender.teacher;
          delete mail.sender.teacher;
        } else if (mail.sender.student) {
          mail.sender.senderData = mail.sender.student;
          delete mail.sender.student;
        } else if (mail.sender.parent) {
          mail.sender.senderData = mail.sender.parent;
          delete mail.sender.parent;
        }

        return mail;
      });

      state.mails = [...state.mails, ...mails];
      state.filter = action.payload.filter;
    });

    builder.addCase(paginateMail.rejected, (state, action) => {
      toast.error("Erreur lors du chargement des messages");
    });

    builder.addCase(sendMail.fulfilled, (state, action) => {
      const mail = action.payload;
      if (mail.sender.director) {
        mail.sender.senderData = mail.sender.director;
        delete mail.sender.director;
      } else if (mail.sender.administrator) {
        mail.sender.senderData = mail.sender.administrator;
        delete mail.sender.administrator;
      } else if (mail.sender.teacher) {
        mail.sender.senderData = mail.sender.teacher;
        delete mail.sender.teacher;
      } else if (mail.sender.student) {
        mail.sender.senderData = mail.sender.student;
        delete mail.sender.student;
      } else if (mail.sender.parent) {
        mail.sender.senderData = mail.sender.parent;
        delete mail.sender.parent;
      }
      state.mails.unshift(mail);
      toast.success("Message envoyé avec succès");
    });

    builder.addCase(sendMail.rejected, (state, action) => {
      toast.error("Erreur lors de l'envoi du message");
    });

    builder.addCase(fetchMailsByUserId.fulfilled, (state, action) => {
      const mails = action.payload.mails.map((message: any) => {
        return message;
      });

      // Assuming you have a similar structure as in fetchMails.fulfilled
      state.mails = mails;
      state.filter = {
        ...state.filter,
        ...action.payload.filter,
      };
    });

    builder.addCase(markAsRead.fulfilled, (state, action) => {
      state.mails.forEach((mail) => {
        if (mail.id == action.payload) {
          mail.isRead = true;
        }
      });
    });

    builder.addCase(markAsStarred.fulfilled, (state, action) => {
      state.mails.forEach((mail) => {
        if (mail.id == action.payload) {
          mail.isStarred = true;
        }
      });
    });

    builder.addCase(markAsUnStarred.fulfilled, (state, action) => {
      state.mails.forEach((mail) => {
        if (mail.id == action.payload.id) {
          mail.isStarred = false;
        }
      });

      if (action.payload.folder == "starred") {
        state.mails = state.mails.filter(
          (mail) => mail.id !== action.payload.id
        );
      }
    });

    builder.addCase(moveToTrash.fulfilled, (state, action) => {
      if (action.payload.folder != "trash") {
        state.mails = state.mails.filter(
          (mail) => mail.id !== action.payload.id
        );
      }
    });

    builder.addCase(moveFromTrash.fulfilled, (state, action) => {
      if (action.payload.folder == "trash") {
        state.mails = state.mails.filter(
          (mail) => mail.id !== action.payload.id
        );
      }
    });
  },
});

export const { handleSelectMail, handleSelectAllMail, resetNewRecipientCount } = appEmailSlice.actions;

export default appEmailSlice.reducer;
