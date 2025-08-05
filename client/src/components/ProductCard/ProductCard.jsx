import React from 'react'
import { Link } from 'react-router-dom'

import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Field from '../Field/Field'
import Counter from '../Counter/Counter'
import BorderedButton from '../BorderedButton/BorderedButton'

import FavoriteIcon from '../../SvgIcons/FavoriteIcon'

import styles from './ProductCard.module.css'


import { togglePopup, updateCartCounter, updateFavoriteCounter } from '../../features/uiSlice'
import { setUserData } from '../../features/userSlice'
import { addFavoriteItem, removeFavoriteItem, addCartItem, removeCartItem } from '../../api/api'
import Spinner from '../Spinner/Spinner'
import getPrice from '../../utils/getPrice'

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

    const onFavoriteButtonClick = async () => {
        setInFavorite(!inFavorite)

        // if (!tokenStatus) {
        //     if (!favoriteProducts?.length)
        //         localStorage.setItem('favoriteItems', [])

        //     if (!favoriteProducts?.includes(productId))
        //         favoriteProducts.push(productId)
        //     else
        //         favoriteProducts.splice(favoriteProducts.findIndex(i => i === productId), 1)

        //     localStorage.setItem('favoriteItems', JSON.stringify(favoriteProducts))
        // }

        if (!favoriteItems?.includes(productId) && tokenStatus) {
            await addFavoriteItem(_id, productId).then(() => {
                dispatch(setUserData())
                dispatch(updateFavoriteCounter(favoriteItems?.length + 1))
                dispatch(togglePopup({ type: 'product-card', message: 'Товар добавлен в избранное!' }))
            })
                .catch(error => console.log(error))

        } else {
            await removeFavoriteItem(_id, productId).then(() => {
                dispatch(setUserData())
                dispatch(updateFavoriteCounter(favoriteItems?.length - 1))
                dispatch(togglePopup({ type: 'product-card', message: 'Товар удален из избранного!' }))
            })
        }
    }

    const onAddToCartButtonClick = async () => {
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
            await addCartItem(_id, productId, quantity).then(res => {
                dispatch(setUserData())
                dispatch(updateCartCounter(cartItems?.length + 1))
                dispatch(togglePopup({ type: 'product-card', message: res.message }))
            }).catch(error => alert(error))

        } else {
            await removeCartItem(_id, productId).then(res => {
                dispatch(setUserData())
                dispatch(updateCartCounter(cartItems?.length - 1))
                dispatch(togglePopup({ type: 'product-card', message: res.message }))
            }).catch(error => alert(error))
        }

    }

    useEffect(() => {
        // if (!tokenStatus) {
        //     if (favoriteItems?.length && JSON.parse(localStorage.getItem('favoriteItems')?.includes(productId)))
        //         setInFavorite(true)

        //     if (cartItems?.length && JSON.parse(localStorage.getItem('cartItems')?.includes(productId)))
        //         setInCart(true)
        // }

        if (tokenStatus) {
            setInFavorite(favoriteItems?.includes(productId))
            cartItems?.map(item => item?.productId === productId && setInCart(true))
            // dispatch(updateCartCounter(cartItems?.length))
        }

    }, [cartItems, favoriteItems, productId, tokenStatus, dispatch])

    return (
        <div className={styles['product-card']}>
            <div className={styles['product-card__tags']}>
                {discount ? <div className={`${styles['product-card__tag']} ${styles['product-card__discount-tag']}`}>{`Скидка ${discount}%`}</div> : null}
                <div className={`${styles['product-card__tag']} ${styles['product-card__popular-tag']}`}>Популярное</div>
                {new Date().getUTCDate() - date.getDate() <= 7 && <div className={`${styles['product-card__tag']} ${styles['product-card__new-tag']}`}>Новинка</div>}
            </div>
            <FavoriteIcon className={styles['product-card__fav-button']} onClick={onFavoriteButtonClick} inFavorite={inFavorite} />
            <Link to={`/products/${productId}`}>
                <div className={styles['product-card__image']}>
                    {imageLoading && <Spinner />}
                    <img style={imageLoading ? { display: 'none' } : { display: 'flex' }}
                        src="/images/categories/03.png" alt="product image"
                        onLoad={() => setImageLoading(false)} />
                </div>
            </Link>
            <div className={styles['product-card__bottom-box']}>
                <Link className={styles['product-card__title']} to={`/products/${productId}`}>{title}</Link>
                <div className={styles['product-card__fields']}>
                    <Field title='Розница:' value={`${getPrice(discount, price)} ₴`} />
                    <Field title='Оптом (от 5 штук):' value={`${getPrice(discount, wholesalePrice)} ₴`} />
                    <Field title='В наличии:' value={`${inStock} шт.`} />
                </div>
                <div className={styles['product-card__bottom']}>
                    <Counter onCounterChange={(value) => {
                        setQuantity(value)
                        setUserData()
                    }} />
                    <BorderedButton title={inCart ? 'В корзине' : 'В корзину'} onClick={onAddToCartButtonClick} />
                </div>
            </div>
        </div >
    )
}
