import { useEffect, useState } from 'react'

import styles from './SearchResultItem.module.css'

import BorderedButton from '../../BorderedButton/BorderedButton'
import FavoriteButton from '../../FavoriteButton/FavoriteButton'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import useProductActions from '../../../hooks/useProductActions'

import { BsCartPlusFill } from 'react-icons/bs'
import { BsCartCheck } from 'react-icons/bs'
import { toggleSearchResults } from '../../../redux/features/uiSlice'


export default function SearchResultItem({ itemInfo }) {
    const [isInFavorite, setIsInFavorite] = useState(false)
    const [inCart, setInCart] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const userData = useSelector((state => state.user.userData))
    const { _id, title, price, wholesalePrice, inStock } = itemInfo || {}

    const { cartItems, favoriteItems } = userData || {}

    const [favoriteItemAction, cartItemAction] = useProductActions()

    useEffect(() => {
        setInCart(cartItems?.map(item => item?.productId).includes(_id))
        setIsInFavorite(favoriteItems?.includes(_id))
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
        <div className={styles['search-result__item']} tabIndex={-1} onClick={() => {
            dispatch(toggleSearchResults())
            navigate(`/products/${_id}`)
        }}>
            <div className={styles['item__image']} style={{ opacity: inStock ? '1' : '0.5' }}>
                <img src="../../../../public/images/categories/03.png" alt="product image" />
            </div>
            <div className={styles['item_info']} style={{ opacity: inStock ? '1' : '0.5' }}>
                <Link className={styles['item__title']} to={`products/${_id}`} onClick={() => dispatch(toggleSearchResults())}>{title}</Link>
                <div className={styles['sub-title']}>
                    <p>Артикул:  854236896ABC</p>
                    {inStock ? <p>{inStock} шт. в наличии</p> : <p style={{ color: 'var(--ui---red)' }}>Нет в наличии</p>}
                </div>
            </div>

            <div className={styles['item__prices']} style={{ opacity: inStock ? '1' : '0.5' }}>
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
                {inStock ? <BorderedButton className={styles['controls__add-to-cart-button']}
                    title={inCart ? 'В корзине' : 'В корзину'}
                    onClick={onCartButtonClick} /> : null}

                {inStock ? <button className={styles['controls__add-to-cart-icon-button']} onClick={onCartButtonClick}>
                    {inCart ? <BsCartCheck /> : <BsCartPlusFill />}
                </button> : null}

                <FavoriteButton className={styles['controls__add-to-favorite-button']}
                    isInFavorite={userData?.favoriteItems.includes(_id)}
                    onClick={onFavoriteButtonClick} iconMode={true} />
            </div>
        </div >
    )
}
