import { useDispatch, useSelector } from 'react-redux'
import { setUserData } from '../redux/features/userSlice'
import { addNotification, updateCartCounter, updateFavoriteCounter } from '../redux/features/uiSlice'
import * as api from '@api/api'
import { useState } from 'react'

export default function useProductActions() {
    const dispatch = useDispatch()

    const userData = useSelector((state) => state.user.userData)
    const tokenStatus = useSelector((state) => state.user.isTokenValid)
    const [isFinally, setIsFinally] = useState(true)

    const { favoriteItems = [], cartItems = [], _id } = userData || {}

    const cartItemAction = (productId, quantity) => {
        if (!tokenStatus) return
        if (!isFinally) return
        setIsFinally(false)
        if (!cartItems?.map(item => item?.productId).includes(productId)) {
            api.addCartItem(_id, productId, quantity || 1)
                .then(res => {
                    dispatch(setUserData())
                    dispatch(updateCartCounter(cartItems?.length + 1))
                    dispatch(addNotification({ type: 'success', text: res.message, route: 'cart' }))
                })
                .catch(error =>
                    dispatch(addNotification(
                        { type: 'error', text: error.data?.error || 'Неизвестная ошибка' })))
                .finally(() => setIsFinally(true))

        } else {
            api.removeCartItem(_id, productId)
                .then(res => {
                    dispatch(setUserData())
                    dispatch(updateCartCounter(cartItems?.length - 1))
                    dispatch(addNotification({ type: 'success', text: res.message }))
                }).catch(error =>
                    dispatch(addNotification(
                        { type: 'error', text: error.data?.error || 'Неизвестная ошибка' })))
                .finally(() => setIsFinally(true))
        }
    }

    const favoriteItemAction = (productId) => {
        if (!tokenStatus) return
        if (!isFinally) return
        setIsFinally(false)
        if (!favoriteItems?.includes(productId)) {
            api.addFavoriteItem(_id, productId)
                .then(() => {
                    dispatch(setUserData())
                    dispatch(updateFavoriteCounter(favoriteItems?.length + 1))
                    dispatch(addNotification({ type: 'success', text: 'Товар добавлен в избранное.', route: 'favorites' }))
                })
                .catch(error =>
                    dispatch(addNotification(
                        { type: 'error', text: error.data?.error || 'Неизвестная ошибка' })))
                .finally(() => setIsFinally(true))

        } else {
            api.removeFavoriteItem(_id, productId)
                .then(() => {
                    dispatch(setUserData())
                    dispatch(updateFavoriteCounter(favoriteItems?.length - 1))
                    dispatch(addNotification({ type: 'success', text: 'Товар удален из избранного.' }))
                })
                .finally(() => setIsFinally(true))
        }
    }
    return [favoriteItemAction, cartItemAction]
}
