import React from 'react'
import { Link } from 'react-router-dom'

import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Field from '../Field/Field'
import Counter from '../Counter/Counter'
import BorderedButton from '../BorderedButton/BorderedButton'
import styles from './ProductCard.module.css'

import { togglePopup, updateCartCounter, updateFavoriteCounter } from '../../features/uiSlice'
import { checkToken, setUserData } from '../../features/userSlice'
import { addFavoriteItem, removeFavoriteItem, addCartItem, removeCartItem } from '../../api/api'
import Spinner from '../Spinner/Spinner'
import CartPopup from '../Popup/PopupCases/CartPopup'


let favoriteProducts = localStorage.getItem('favoriteItems') ? JSON.parse(localStorage.getItem('favoriteItems')) : []
let cartProducts = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : []

export default function ProductCard({ productData }) {

    const [inCart, setInCart] = useState(false)
    const [inFavorite, setInFavorite] = useState(false)
    const [quantity, setQuantity] = useState(null)
    const [imageLoading, setImageLoading] = useState(true)

    const userData = useSelector((state) => state.user.userData)

    const { favoriteItems = [], cartItems = [], _id } = userData || {}
    const { title, price, wholesalePrice, inStock, _id: productId, discount, createdAt } = productData || {}

    const date = new Date(createdAt)

    const dispatch = useDispatch()
    const tokenStatus = useSelector((state) => state.user.isTokenValid)

    useEffect(() => {
        if (!tokenStatus) {
            if (favoriteItems?.length && JSON.parse(localStorage.getItem('favoriteItems').includes(productId)))
                setInFavorite(true)

            if (cartItems?.length && JSON.parse(localStorage.getItem('cartItems').includes(productId)))
                setInCart(true)
        }

        if (tokenStatus) {
            setInFavorite(favoriteItems?.includes(productId))
            cartItems?.map(item => item?.productId === productId && setInCart(true))
            // dispatch(updateCartCounter(cartItems?.length))
        }

    }, [cartItems, favoriteItems, productId, tokenStatus, dispatch])

    return (
        <div className={styles['product-card']}>
            <div className={styles['product-card__tags']}>
                {discount !== 0 && <div className={`${styles['product-card__tag']} ${styles['product-card__discount-tag']}`}>{`Скидка ${discount}%`}</div>}
                <div className={`${styles['product-card__tag']} ${styles['product-card__popular-tag']}`}>Популярное</div>
                {new Date().getUTCDate() - date.getDate() <= 7 && <div className={`${styles['product-card__tag']} ${styles['product-card__new-tag']}`}>Новинка</div>}
            </div>
            <Link to={`products/${productId}`}>
                <div className={styles['product-card__image']}>
                    {imageLoading && <Spinner />}
                    <img style={imageLoading ? { display: 'none' } : { display: 'flex' }}
                        src="../../../public/images/product-img.png" alt="product image"
                        onLoad={() => setImageLoading(false)} />
                </div>
            </Link>

            <svg className={styles['product-card__fav-button']} width="20" height="18" viewBox="0 0 20 20" fill={inFavorite ? '#ed0000' : 'none'} xmlns="http://www.w3.org/2000/svg" color={inFavorite ? '#ed0000' : 'none'}

                onClick={async () => {
                    setInFavorite(!inFavorite)

                    if (!tokenStatus) {
                        if (!favoriteProducts?.length)
                            localStorage.setItem('favoriteItems', [])

                        if (!favoriteProducts?.includes(productId))
                            favoriteProducts.push(productId)
                        else
                            favoriteProducts.splice(favoriteProducts.findIndex(i => i === productId), 1)

                        localStorage.setItem('favoriteItems', JSON.stringify(favoriteProducts))
                    }


                    if (!favoriteItems?.includes(productId) && tokenStatus) {
                        await addFavoriteItem(_id, productId, () => dispatch(setUserData()))
                        dispatch(updateFavoriteCounter(favoriteItems?.length + 1))
                        dispatch(togglePopup(<CartPopup text='Товар добавлен в избранное!' />))
                    } else {
                        await removeFavoriteItem(_id, productId, () => dispatch(setUserData()))
                        dispatch(updateFavoriteCounter(favoriteItems?.length - 1))
                        dispatch(togglePopup(<CartPopup text='Товар удален из избранного!' />))
                    }

                }
                }>
                <path d="M10.0064 4.45274L10.5367 3.92241L11.0836 3.37546C11.9905 2.46862 13.1905 1.97122 14.4711 1.97122C15.7525 1.97122 16.948 2.465 17.8542 3.37122C18.7601 4.27705 19.2536 5.47601 19.25 6.75647V6.75862C19.25 8.03906 18.7527 9.239 17.846 10.1458C17.8459 10.1459 17.8458 10.146 17.8457 10.146L9.996 17.9666L2.1585 10.1291C1.25019 9.22075 0.750023 8.02436 0.750026 6.7459L0.75002 6.74375C0.746355 5.46477 1.24314 4.26538 2.15002 3.3585C3.05253 2.45599 4.25252 1.9585 5.52895 1.9585C6.80863 1.9585 8.01315 2.45953 8.92059 3.36698L9.47603 3.92241L10.0064 4.45274ZM9.86611 18.096C9.86644 18.0956 9.86677 18.0953 9.8671 18.095L9.86611 18.096Z" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <div className={styles['product-card__bottom-box']}>
                <Link className={styles['product-card__title']} to={`products/${productId}`}>{title}</Link>
                <div className={styles['product-card__fields']}>
                    <Field tittle='Розница:' value={discount > 0 ? `${Math.round(price - price / 100 * discount)} ₽` : `${price} ₽`} />
                    <Field tittle='Оптом (от 5 штук):' value={discount > 0 ? `${Math.round(wholesalePrice - wholesalePrice / 100 * discount)} ₽` : `${wholesalePrice} ₽`} />
                    <Field tittle='В наличии:' value={`${inStock} шт.`} />
                </div>
                <div className={styles['product-card__bottom']}>
                    <Counter onCounterChange={(value) => {
                        setQuantity(value)
                        setUserData()
                    }} />
                    <BorderedButton title={inCart ? 'В корзине' : 'В корзину'}
                        onClick={async () => {
                            setInCart(!inCart)

                            if (!tokenStatus) {
                                if (!cartProducts?.length)
                                    localStorage.setItem('cartItems', [])

                                if (!cartProducts?.includes(productId))
                                    cartProducts.push(productId)
                                else
                                    cartProducts.splice(cartProducts.findIndex(i => i === productId), 1)

                                localStorage.setItem('cartItems', JSON.stringify(cartProducts))
                            }

                            if (!tokenStatus)
                                return

                            if (!inCart) {
                                await addCartItem(_id, productId, quantity, () => dispatch(setUserData()))
                                dispatch(updateCartCounter(cartItems?.length + 1))
                                dispatch(togglePopup(<CartPopup text='Товар добавлен в корзину!' />))
                            } else {
                                await removeCartItem(_id, productId, () => dispatch(setUserData()))
                                dispatch(updateCartCounter(cartItems?.length - 1))
                                dispatch(togglePopup(<CartPopup text='Товар удален из корзины!' />))
                            }

                        }} />
                </div>
            </div>
        </div >
    )
}
