import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type TUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  packageId: string | null;
  usedStorageMB: number;
  bio?: string;
  organization?: string;
  avatarColor?: string;
} | null;

type TAuthState = {
  user: TUser;
  token: string | null;
};

const initialState: TAuthState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ user: TUser; token: string }>) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      console.log("Login Redux Slice updated:", action.payload);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
    setToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    updateUserPackage: (state, action: PayloadAction<{ packageId: string | null }>) => {
      if (state.user) {
        state.user.packageId = action.payload.packageId;
      }
    },
    updateUserProfile: (
      state,
      action: PayloadAction<{
        name?: string;
        phone?: string;
        bio?: string;
        organization?: string;
        avatarColor?: string;
      }>
    ) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

export const { login, logout, setToken, updateUserPackage, updateUserProfile } = authSlice.actions;
export default authSlice.reducer;
