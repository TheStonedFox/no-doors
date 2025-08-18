import { createSlice } from "@reduxjs/toolkit"

import { generateId } from '../../utils/generateId'

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
    notificationList: [],
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
        updateCartCounter: (state, action) => {
            state.cartCounter = action.payload
        },
        updateFavoriteCounter: (state, action) => {
            state.favoriteCounter = action.payload
        },
        setTheme: (state, action) => {
            state.theme = action.payload
        },
        addNotification: (state, action) => {
            // state.notificationList = [action.payload, ...state.notificationList]
            state.notificationList = [{ ...action.payload, id: generateId() }, ...state.notificationList]
        },
        removeNotification: (state, action) => {
            state.notificationList = state.notificationList.filter(
                notification => notification.id !== action.payload
            )
        }
    }
})



export const { toggleBurger, toggleCatalog, closeAll, updateCartCounter, updateFavoriteCounter, togglePopup, closeBurger, toggleSearchResults, toggleFiltersPanel, setTheme, addNotification, removeNotification } = uiSlice.actions