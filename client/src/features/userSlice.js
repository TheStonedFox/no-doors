import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { getUser } from "../api/api"

const initialState = {
    userData: null,
    isTokenValid: false,
}


export const checkToken = createAsyncThunk('user/checkToken', async () => {
    const res = await fetch('http://192.168.1.105:3001/auth/check', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem('token')
        }
    })

    const json = await res.json()
    return json.msg
})

export const setUserData = createAsyncThunk('user/setUserData', async () => {
    const res = await getUser()
    return res
})

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(checkToken.fulfilled, (state, payload) => {
                state.isTokenValid = payload.payload === 'token valid'
            })
            .addCase(checkToken.rejected, (state, action) => {
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

