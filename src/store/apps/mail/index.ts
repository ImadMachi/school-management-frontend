// ** Redux Imports
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'

// ** Axios Imports
import axios from 'axios'

// ** Types
import { Dispatch } from 'redux'
import { HOST } from 'src/store/constants/hostname'
import {
  MailType,
  UpdateMailLabelType,
  FetchMailParamsType,
  UpdateMailParamsType,
  PaginateMailParamsType,
  MailFolderType,
  SendMailParamsType
} from 'src/types/apps/mailTypes'

interface ReduxType {
  getState: any
  dispatch: Dispatch<any>
}

/************** map MailFolderType to appropriate value for backend ******************* */
type MailEntityMap = {
  [Key in MailFolderType]: 'recipients' | 'sender' | 'draft' | 'starredBy' | 'spam' | 'trashedBy'
}

const mapMailFolderToEntity = (folder: MailFolderType): MailEntityMap[MailFolderType] => {
  switch (folder) {
    case 'inbox':
      return 'recipients'
    case 'sent':
      return 'sender'
    case 'draft':
      return 'draft'
    case 'starred':
      return 'starredBy'
    case 'spam':
      return 'spam'
    case 'trash':
      return 'trashedBy'
    default:
      throw new Error('Invalid mail folder type')
  }
}

// ** Fetch Mails
export const fetchMails = createAsyncThunk('appEmail/fetchMails', async (params: FetchMailParamsType) => {
  const entityFolder = mapMailFolderToEntity(params.folder)
  const response = await axios.get(`${HOST}/messages/auth?folder=${entityFolder}`)
  return { mails: response.data, filter: params }
})

// ** Send Mail
export const sendMail = createAsyncThunk('appEmail/sendMail', async (data: SendMailParamsType) => {
  const formData = new FormData()
  formData.append('subject', data.subject)
  formData.append('body', data.body)
  for (let i = 0; i < data.recipients.length; i++) {
    formData.append(`recipients[${i}][id]`, data.recipients[i].id.toString())
  }
  for (let file of data.attachments) {
    formData.append(file.name, file)
  }

  const response = await axios.post(`${HOST}/messages`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
  return response.data
})

// ** Get Current Mail
export const getCurrentMail = createAsyncThunk('appEmail/selectMail', async (id: number | string) => {
  const response = await axios.get(`${HOST}/messages/${id}`)
  return response.data
})

// ** Prev/Next Mails
export const paginateMail = createAsyncThunk('appEmail/paginateMail', async (params: PaginateMailParamsType) => {
  const response = await axios.get('/apps/email/paginate-email', { params })

  return response.data
})

interface InitialStateProps {
  mails: MailType[]
  mailMeta: any
  filter: FetchMailParamsType
  currentMail: MailType | null
  selectedMails: number[]
}

const initialState: InitialStateProps = {
  mails: [],
  mailMeta: null,
  filter: {
    q: '',
    //@ts-ignore
    label: '',
    folder: 'inbox'
  },
  currentMail: null,
  selectedMails: []
}

export const appEmailSlice = createSlice({
  name: 'appEmail',
  initialState,
  reducers: {
    handleSelectMail: (state, action) => {
      const mails: any = state.selectedMails
      if (!mails.includes(action.payload)) {
        mails.push(action.payload)
      } else {
        mails.splice(mails.indexOf(action.payload), 1)
      }
      state.selectedMails = mails
    },
    handleSelectAllMail: (state, action) => {
      const selectAllMails: number[] = []
      if (action.payload && state.mails !== null) {
        selectAllMails.length = 0

        // @ts-ignore
        state.mails.forEach((mail: MailType) => selectAllMails.push(mail.id))
      } else {
        selectAllMails.length = 0
      }
      state.selectedMails = selectAllMails as any
    }
  },
  extraReducers: builder => {
    builder.addCase(fetchMails.fulfilled, (state, action) => {
      const mails = action.payload.mails.map((mail: any) => {
        if (mail.sender.administrator) {
          mail.sender.senderData = mail.sender.administrator
        } else if (mail.sender.teacher) {
          mail.sender.senderData = mail.sender.teacher
        }
        return mail
      })

      state.mails = mails
      state.filter = action.payload.filter
    })
    builder.addCase(getCurrentMail.fulfilled, (state, action) => {
      const mail = action.payload
      if (mail.sender.administrator) {
        mail.sender.senderData = mail.sender.administrator
      } else if (mail.sender.teacher) {
        mail.sender.senderData = mail.sender.teacher
      }
      state.currentMail = mail
    })
    builder.addCase(paginateMail.fulfilled, (state, action) => {
      state.currentMail = action.payload
    })
    builder.addCase(sendMail.fulfilled, (state, action) => {
      const mail = action.payload
      if (mail.sender.administrator) {
        mail.sender.senderData = mail.sender.administrator
      } else if (mail.sender.teacher) {
        mail.sender.senderData = mail.sender.teacher
      }
      state.mails.unshift(mail)
    })
  }
})

export const { handleSelectMail, handleSelectAllMail } = appEmailSlice.actions

export default appEmailSlice.reducer