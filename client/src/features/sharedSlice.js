import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { getStepChoices } from "../api/api"

const initialState = {
    chooseValues: {
        brands: [],
        categories: [],
        error: null,
        isLoading: false,
    }
}

export const getChooseValues = createAsyncThunk('shared/getChooseValues', () => getStepChoices().then(res => res.options))

export const sharedSlice = createSlice({
    name: 'shared',
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(getChooseValues.fulfilled, (state, payload) => {
                state.chooseValues.error = false
                state.chooseValues.isLoading = false
                state.chooseValues.brands = payload.payload.brands
                state.chooseValues.categories = payload.payload.categories
            })
            .addCase(getChooseValues.rejected, (state) => {
                state.chooseValues.error = true
                state.chooseValues.isLoading = false
            })
            .addCase(getChooseValues.pending, (state) => {
                state.chooseValues.isLoading = true
                state.chooseValues.error = false
            })
    }
})


