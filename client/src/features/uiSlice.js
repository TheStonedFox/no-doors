import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    isBurgerOpen: false,
    isCatalogOpen: false,
    isPopupOpen: false,
    isSearchResultsOpen: false,
    isFiltersPanelOpen: false,
    theme: localStorage.getItem('theme') || 'light',
    popup: { type: '', message: '', data: '' },
    cartCounter: 0,
    favoriteCounter: 0,
}


export const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggleBurger: (state) => {
            state.isBurgerOpen = !state.isBurgerOpen
            state.isCatalogOpen = false
        },
        toggleCatalog: (state) => {
            state.isCatalogOpen = !state.isCatalogOpen
            state.isBurgerOpen = false
        },
        toggleFiltersPanel: (state) => {
            state.isFiltersPanelOpen = !state.isFiltersPanelOpen
            // state.isBurgerOpen = false
        },
        togglePopup: (state, action) => {
            state.isPopupOpen = !state.isPopupOpen
            state.popup = action.payload
        },
        toggleSearchResults: (state, action) => {
            state.isSearchResultsOpen = action.payload
        },
        closeAll: (state) => {
            state.isBurgerOpen = false
            state.isCatalogOpen = false
        },
        closeBurger: (state) => {
            state.isBurgerOpen = false
        },
        updateCartCounter: (state, payload) => {
            state.cartCounter = payload.payload
        },
        updateFavoriteCounter: (state, payload) => {
            state.favoriteCounter = payload.payload
        },
        setTheme: (state, payload) => {
            state.theme = payload.payload
        }
    }
})




export const { toggleBurger, toggleCatalog, closeAll, updateCartCounter, updateFavoriteCounter, togglePopup, closeBurger, toggleSearchResults, toggleFiltersPanel, setTheme } = uiSlice.actions