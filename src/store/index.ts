// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import administrator from './apps/administrator'
import teachers from './apps/teachers'
import mail from './apps/mail'
import students from './apps/students'

export const store = configureStore({
  reducer: {
    administrator,
    teachers,
    mail,
    students
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    }) as any
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
