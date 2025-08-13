import React from 'react'
import { Link } from 'react-router-dom'

import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Field from '../Field/Field'
import Counter from '../Counter/Counter'
import BorderedButton from '../BorderedButton/BorderedButton'

import FavoriteIcon from '../../SvgIcons/FavoriteIcon'

import styles from './ProductCard.module.css'


import { setUserData } from '../../redux/features/userSlice'
import Spinner from '../Spinner/Spinner'
import getPrice from '@utils/getPrice'
import useProductActions from '../../hooks/useProductActions'

// import { BsFillCartCheckFill } from "react-icons/bs"
// import { BsCartPlusFill } from "react-icons/bs"


// let favoriteProducts = localStorage.getItem('favoriteItems') ? JSON.parse(localStorage.getItem('favoriteItems')) : []
// let cartProducts = localStorage.getItem('cartItems') ? JSON.parse(localStorage.getItem('cartItems')) : []

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

    const [favoriteItemAction, cartItemAction] = useProductActions()

    const onFavoriteButtonClick = () => {
        favoriteItemAction(productId)
        setInFavorite(!inFavorite)
    }

    const onAddToCartButtonClick = () => {
        setInCart(!inCart)
        cartItemAction(productId, quantity)
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
        }

    }, [cartItems, favoriteItems, productId, tokenStatus, dispatch])

    return (
        <div className={`${styles['product-card']} ${!inStock && styles['disabled']}`}>
            {inStock ? <div className={styles['product-card__tags']}>
                {discount ? <div className={`${styles['product-card__tag']} ${styles['product-card__discount-tag']}`}>{`Скидка ${discount}%`}</div> : null}
                <div className={`${styles['product-card__tag']} ${styles['product-card__popular-tag']}`}>Популярное</div>
                {new Date().getUTCDate() - date.getDate() <= 7 && <div className={`${styles['product-card__tag']} ${styles['product-card__new-tag']}`}>Новинка</div>}
            </div> : null}
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
                    {inStock ? <Field title='В наличии:' value={`${inStock} шт.`} /> : <p>Нет в наличии.</p>}
                </div>
                {inStock ? <div className={styles['product-card__bottom']}>
                    <Counter onCounterChange={(value) => {
                        setQuantity(value)
                        setUserData()
                    }} />
                    <BorderedButton
                        className={styles['product-card__cart-button']}
                        title={inCart ? 'В корзине' : 'В корзину'}
                        onClick={onAddToCartButtonClick} />

                    {/* <button className={styles['product-card__cart-icon-button']} onClick={onAddToCartButtonClick}>
                        <p>{inCart ? 'В корзине' : 'В корзину'}</p>
                        {inCart ? <BsFillCartCheckFill /> : <BsCartPlusFill />}
                    </button> */}
                </div> : null}
            </div>
        </div >
    )
}
