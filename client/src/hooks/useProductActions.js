import { useDispatch, useSelector } from "react-redux"
import { setUserData } from "../features/userSlice"
import { addNotification, updateCartCounter, updateFavoriteCounter } from "../features/uiSlice"
import { addCartItem, addFavoriteItem, removeCartItem, removeFavoriteItem } from "../api/api"


export default function useProductActions() {
    const dispatch = useDispatch()

    const userData = useSelector((state) => state.user.userData)
    const tokenStatus = useSelector((state) => state.user.isTokenValid)

    const { favoriteItems = [], cartItems = [], _id } = userData || {}

    const cartItemAction = (productId, quantity) => {

        if (!tokenStatus)
            return

        if (!cartItems?.map(item => item?.productId).includes(productId)) {
            addCartItem(_id, productId, quantity || 1).then(res => {
                dispatch(setUserData())
                dispatch(updateCartCounter(cartItems?.length + 1))
                dispatch(addNotification({ id: crypto.randomUUID(), type: 'success', text: res.message, route: 'cart' }))
            }).catch(error =>
                dispatch(addNotification(
                    { id: crypto.randomUUID(), type: 'error', text: error.data?.error || 'Неизвестная ошибка' })))

        } else {
            removeCartItem(_id, productId).then(res => {
                dispatch(setUserData())
                dispatch(updateCartCounter(cartItems?.length - 1))
                dispatch(addNotification({ id: crypto.randomUUID(), type: 'success', text: res.message }))
            }).catch(error =>
                dispatch(addNotification(
                    { id: crypto.randomUUID(), type: 'error', text: error.data?.error || 'Неизвестная ошибка' })))
        }
    }

    const favoriteItemAction = (productId) => {
        if (!tokenStatus)
            return

        if (!favoriteItems?.includes(productId)) {
            addFavoriteItem(_id, productId).then(() => {
                dispatch(setUserData())
                dispatch(updateFavoriteCounter(favoriteItems?.length + 1))
                dispatch(addNotification({ id: crypto.randomUUID(), type: 'success', text: 'Товар добавлен в избранное.', route: 'cart' }))
            })
                .catch(error =>
                    dispatch(addNotification(
                        { id: crypto.randomUUID(), type: 'error', text: error.data?.error || 'Неизвестная ошибка' })))

        } else {
            removeFavoriteItem(_id, productId).then(() => {
                dispatch(setUserData())
                dispatch(updateFavoriteCounter(favoriteItems?.length - 1))
                dispatch(addNotification({ id: crypto.randomUUID(), type: 'success', text: 'Товар удален из избранного.' }))
            })
        }
    }
    return [favoriteItemAction, cartItemAction]
}
