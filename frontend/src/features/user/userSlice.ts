import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { IUser } from '../../types';
import axios from "axios";

type isAuthResponse = {
  isLogged: boolean,
  user?: IUser
}

export const fetchUserIsAuth = createAsyncThunk<isAuthResponse>(
  'user/isAuth',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get<isAuthResponse>(`${import.meta.env.VITE_BACKEND_BASE_URL}/isAuth`);
      console.log(res.data);

      return res.data;
    } catch (error: any) {
      return rejectWithValue(error.res?.data || "Error while checking is user auth")
    }
  }
)

interface UserState {
  user: IUser | null,
  lightMode: boolean,
  isAuth: boolean,
  isLoading: boolean,
  userPic: string,
  lang: string
}

const getLang: string = localStorage.getItem('lang')! ? localStorage.getItem('lang')! : 'en';
const getTheme: boolean = JSON.parse(localStorage.getItem('lightMode')!) ? JSON.parse(localStorage.getItem('lightMode')!) : false;

const initialState: UserState = {
  user: null,
  lightMode: getTheme,
  isAuth: false,
  isLoading: false,
  userPic: '',
  lang: getLang
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    handleTheme: (state, action: PayloadAction<boolean>) => {
      state.lightMode = action.payload;
      localStorage.setItem('lightMode', JSON.stringify(state.lightMode))
    },
    handleUserPic: (state, action: PayloadAction<string>) => {
      state.userPic = action.payload;
    },
    handleLangChange: (state, action: PayloadAction<string>) => {
      state.lang = action.payload;
      localStorage.setItem('lang', action.payload)
      window.location.reload()
    }
  },
  extraReducers(builder) {
    builder
      .addCase(fetchUserIsAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUserIsAuth.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user || null;
        state.isAuth = action.payload.isLogged;
      })
      .addCase(fetchUserIsAuth.rejected, (state) => {
        state.isLoading = false;

      })
  },
})

export const { handleTheme, handleUserPic, handleLangChange } = userSlice.actions;
export default userSlice.reducer;