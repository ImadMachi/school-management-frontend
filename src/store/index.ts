// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import administrator from './apps/administrator'
import teachers from './apps/teachers' 

export const store = configureStore({
  reducer: {
    administrator,
    teachers
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
