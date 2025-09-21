import { useDispatch, useSelector } from 'react-redux'
import { setUserData } from '../redux/features/userSlice'
import { addNotification } from '../redux/features/uiSlice'
import * as api from '@api/api'
import { useState } from 'react'

export default function useProductActions() {
    const dispatch = useDispatch()
    const userData = useSelector((state) => state.user.userData)
    const tokenStatus = useSelector((state) => state.user.isTokenValid)
    const [isCartFinally, setIsCartFinally] = useState(true)
    const [isFavoriteFinally, setIsFavoriteFinally] = useState(true)

    const cartItemAction = (productId, quantity) => {
        if (!tokenStatus) return
        setIsCartFinally(false)
        api.toggleCartItem({ userId: userData?._id, quantity }, productId)
            .then(res => {
                dispatch(addNotification({ type: 'success', text: res.message, route: 'cart' }))
                dispatch(setUserData())
            })
            .catch(error => dispatch(addNotification({ type: 'error', text: error.message })))
            .finally(() => setIsCartFinally(true))
    }

    const favoriteItemAction = (productId) => {
        if (!tokenStatus) return
        setIsFavoriteFinally(false)
        api.toggleFavoriteItem(userData?._id, productId)
            .then(res => {
                dispatch(addNotification({ type: 'success', text: res.message, route: 'favorites' }))
                dispatch(setUserData())
            })
            .catch(error => dispatch(addNotification({ type: 'error', text: error.message })))
            .finally(() => setIsFavoriteFinally(true))
    }
    return { favoriteItemAction, cartItemAction, isCartFinally, isFavoriteFinally }
}
