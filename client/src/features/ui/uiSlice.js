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
            state.isCatalogOpen = false
        },
        toggleCatalog: (state) => {
            state.isCatalogOpen = !state.isCatalogOpen
            state.isBurgerOpen = false
        }
    }
})

export const { toggleBurger, toggleCatalog } = uiSlice.actions