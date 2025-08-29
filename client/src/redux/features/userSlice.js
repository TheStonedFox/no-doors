import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { getUser, checkToken } from "@api/api"

const initialState = {
    userData: null,
    isTokenValid: false,
    brandsAndModels: null
}

export const checkTokenThunk = createAsyncThunk('user/checkTokenThunk', () => {
    return checkToken().then(res => res.message).catch(error => console.log(error))
})

export const setUserData = createAsyncThunk('user/setUserData', () => getUser().then(res => res.user).catch(error => console.log(error)))

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        resetUser: (state) => { state.userData = null }
    },
    extraReducers: (builder) => {
        builder
            .addCase(checkTokenThunk.fulfilled, (state, action) => {
                state.isTokenValid = action.payload === 'token valid'
                if (!state.isTokenValid) state.userData = null
            })
            .addCase(checkTokenThunk.rejected, (state) => {
                state.isTokenValid = false
                state.userData = null
            })
            .addCase(setUserData.fulfilled, (state, action) => {
                state.userData = action.payload || null
            })
            .addCase(setUserData.rejected, (state) => {
                state.userData = null
            })
    }
})

export const { resetUser } = userSlice.actions

