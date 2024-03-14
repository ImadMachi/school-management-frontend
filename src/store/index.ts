// ** Toolkit imports
import { configureStore } from "@reduxjs/toolkit";

// ** Reducers
import administrator from "./apps/administrator";
import teachers from "./apps/teachers";
import mail from "./apps/mail";
import templates from "./apps/templates";
import students from "./apps/students";
import parents from "./apps/parents";
import directors from "./apps/directors";
import users from "./apps/users";
import categories from "./apps/categories";
import classes from "./apps/classes";

export const store = configureStore({
  reducer: {
    administrator,
    teachers,
    mail,
    templates,
    students,
    parents,
    directors,
    users,
    categories,
    classes,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }) as any,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
