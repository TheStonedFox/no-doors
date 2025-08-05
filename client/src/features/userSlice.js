import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { getUser, checkToken } from "../api/api"

const initialState = {
    userData: null,
    isTokenValid: false,
    brandsAndModels: null
}

export const checkTokenThunk = createAsyncThunk('user/checkTokenThunk', () => {
    return checkToken().then(res => res.message).catch(error => alert(error))
})

export const setUserData = createAsyncThunk('user/setUserData', () => getUser().then(res => res.user).catch(error => console.log(error)))

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(checkTokenThunk.fulfilled, (state, payload) => {
                state.isTokenValid = payload.payload === 'token valid'
            })
            .addCase(checkTokenThunk.rejected, (state) => {
                state.isTokenValid = false
            })
            .addCase(setUserData.fulfilled, (state, action) => {
                state.userData = action.payload
            })
            .addCase(setUserData.rejected, (state) => {
                state.userData = null
            })
    }
})

// export const { setToken, setCartItems } = userSlice.actions

