import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  email: string | null;
  hydrated: boolean;
}

interface AuthPayload {
  accessToken: string | null;
  refreshToken: string | null;
  email: string | null;
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  email: null,
  hydrated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<AuthPayload>) {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.email = action.payload.email;
      state.hydrated = true;
    },
    clearAuth(state) {
      state.accessToken = null;
      state.refreshToken = null;
      state.email = null;
      state.hydrated = true;
    },
    setHydrated(state) {
      state.hydrated = true;
    },
  },
});

export const { setAuth, clearAuth, setHydrated } = authSlice.actions;
export default authSlice.reducer;
