import { configureStore } from '@reduxjs/toolkit'
import { uiSlice } from '../features/uiSlice'
import { userSlice } from '../features/userSlice'
import { sharedSlice } from '../features/sharedSlice'



export const store = configureStore({
    reducer: {
        ui: uiSlice.reducer,
        user: userSlice.reducer,
        shared: sharedSlice.reducer
    }
})