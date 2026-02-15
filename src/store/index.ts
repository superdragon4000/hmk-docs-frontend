import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth-slice';
import catalogsReducer from './catalogs-slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    catalogs: catalogsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
