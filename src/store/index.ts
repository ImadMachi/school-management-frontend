// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import administrator from './apps/administrator'
import teachers from './apps/teachers' 
import students from './apps/students'

export const store = configureStore({
  reducer: {
    administrator,
    teachers,
    students
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
