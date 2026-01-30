import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UserRole = 'user' | 'admin' | null;

interface AuthState {
  isAuthenticated: boolean;
  role: UserRole;
  displayName?: string;
}

const initialState: AuthState = {
  isAuthenticated: false,
  role: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth(
      state,
      action: PayloadAction<{ isAuthenticated: boolean; role: UserRole; displayName?: string }>
    ) {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.role = action.payload.role;
      state.displayName = action.payload.displayName;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.role = null;
      state.displayName = undefined;
    }
  }
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;

