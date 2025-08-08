import React, { useEffect, useState } from 'react'

import styles from './SearchResultItem.module.css'

import BorderedButton from '../../BorderedButton/BorderedButton'
import FavoriteButton from '../../FavoriteButton/FavoriteButton'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { togglePopup, updateFavoriteCounter } from '../../../features/uiSlice'
import { setUserData } from '../../../features/userSlice'
import { addFavoriteItem, removeFavoriteItem } from '../../../api/api'
import useProductActions from '../../../hooks/useProductActions'

export default function SearchResultItem({ itemInfo }) {
    const [isInFavorite, setIsInFavorite] = useState(false)
    const [inCart, setInCart] = useState(false)
    const negative = useNavigate()

    const userData = useSelector((state => state.user.userData))
    const { _id, title, price, wholesalePrice, inStock } = itemInfo || {}

    const { cartItems, favoriteItems } = userData || {}

    const [favoriteItemAction, cartItemAction] = useProductActions()

    useEffect(() => {
        setInCart(cartItems?.map(item => item?.productId).includes(_id))
        setIsInFavorite(favoriteItems.includes(_id))
    }, [_id, cartItems, favoriteItems])

    const onFavoriteButtonClick = async () => {
        setIsInFavorite(!isInFavorite)
        favoriteItemAction(_id)
    }

    const onCartButtonClick = () => {
        cartItemAction(_id)
        setInCart(!inCart)
    }

    return (
        <div className={styles['search-result__item']} >
            <div className={styles['item__image']} onMouseDown={() => negative(`products/${_id}`)}>
                <img src="../../../../public/images/categories/03.png" alt="product image" />
            </div>
            <div className={styles['item_info']}>
                <Link className={styles['item__title']} to={`products/${_id}`}>{title}</Link>
                <div className={styles['sub-title']}>
                    <p>Артикул:  854236896ABC</p>
                    {inStock ? <p>{inStock} шт. в наличии</p> : <p style={{ color: 'var(--ui---red)' }}>Нет в наличии</p>}
                </div>
            </div>

            <div className={styles['item__prices']}>
                <div>
                    <p className={styles['item__price-type']}>в розницу</p>
                    <p className={styles['item__price-value']}>{price} ₴</p>
                </div>
                <div>
                    <p className={styles['item__price-type']}>от 5 шт.</p>
                    <p className={styles['item__price-value']}>{wholesalePrice} ₴</p>
                </div>
            </div>
            <div className={styles['item__controls']}>
                <BorderedButton className={styles['controls__add-to-cart-button']}
                    title={inCart ? 'В корзине' : 'В корзину'}
                    onClick={onCartButtonClick} />
                <FavoriteButton isInFavorite={userData?.favoriteItems.includes(_id)} onClick={onFavoriteButtonClick} />
            </div>
        </div>
    )
}
