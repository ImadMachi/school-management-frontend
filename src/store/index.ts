// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import administrator from './apps/administrator'
import teachers from './apps/teachers'
import mail from './apps/mail'
import students from './apps/students'
import parents from './apps/parents'
import users from './apps/users'

export const store = configureStore({
  reducer: {
    administrator,
    teachers,
    mail,
    students,
    parents,
    users
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    }) as any
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
