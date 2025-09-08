import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { getStepChoices } from "@api/api"
import { getProductComments } from "../../api/api"

const initialState = {
    chooseValues: {
        brands: [],
        categories: [],
        error: null,
        isLoading: false,
    },
    idCommentToUpdate: null
}

export const getChooseValues = createAsyncThunk('shared/getChooseValues', () => getStepChoices())

export const sharedSlice = createSlice({
    name: 'shared',
    initialState,
    reducers: {
        setIdCommentToUpdate: (state, action) => {
            state.idCommentToUpdate = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            // ChooseValues-------------------------------------------------------------------
            .addCase(getChooseValues.fulfilled, (state, action) => {
                state.chooseValues.error = false
                state.chooseValues.isLoading = false
                state.chooseValues.brands = action.payload.options.brands
                state.chooseValues.categories = action.payload.options.categories
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


export const { setIdCommentToUpdate } = sharedSlice.actions