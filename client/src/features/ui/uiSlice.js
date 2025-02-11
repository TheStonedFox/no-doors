import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isBurgerOpen: false,
    isCatalogOpen: false
}

export const uiSlice = createSlice({
    name: 'burger',
    initialState,
    reducers: {
        toggleBurger: (state) => {
            state.isBurgerOpen = !state.isBurgerOpen
        },
        toggleCatalog: (state) => {
            state.isCatalogOpen = !state.isCatalogOpen
        }
    }
})

export const { toggleBurger, toggleCatalog } = uiSlice.actions