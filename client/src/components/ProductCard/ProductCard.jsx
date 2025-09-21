import styles from './ProductCard.module.css'

import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import BorderedButton from '../BorderedButton/BorderedButton'
import Counter from '../Counter/Counter'
import Field from '../Field/Field'

import FavoriteIcon from '@/svg/FavoriteIcon'

import getPrice from '@utils/getPrice'
import useProductActions from '../../hooks/useProductActions'
import { setUserData } from '../../redux/features/userSlice'
import Spinner from '../Spinner/Spinner'
import { addNotification } from '../../redux/features/uiSlice'


export default function ProductCard({ productData, ref }) {

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

    const { favoriteItemAction, cartItemAction, isCartFinally, isFavoriteFinally } = useProductActions()

    const onFavoriteButtonClick = () => {
        if (!tokenStatus)
            return dispatch(addNotification({ text: 'Нужно войти в аккаунт для этого действия', type: 'info', route: 'auth/' }))
        favoriteItemAction(productId)
        setInFavorite(!inFavorite)
    }

    const onAddToCartButtonClick = () => {
        if (!tokenStatus)
            return dispatch(addNotification({ text: 'Нужно войти в аккаунт для этого действия', type: 'info', route: 'auth/' }))
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

    function onCounterChange(value) {
        setQuantity(value)
        setUserData()
    }
    return (
        <div className={`${styles['product-card']} ${!inStock && styles['disabled']}`} ref={ref}>
            {Boolean(inStock) && <div className={styles['product-card__tags']} >
                {Boolean(discount) && <div className={`${styles['product-card__tag']} ${styles['product-card__discount-tag']}`}>{`Скидка ${discount}%`}</div>}
                <div className={`${styles['product-card__tag']} ${styles['product-card__popular-tag']}`}>Популярное</div>
                {new Date().getUTCDate() - date.getDate() <= 7 && <div className={`${styles['product-card__tag']} ${styles['product-card__new-tag']}`}>Новинка</div>}
            </div>}
            <button disabled={!isFavoriteFinally} onClick={onFavoriteButtonClick}>
                <FavoriteIcon className={styles['product-card__fav-button']} inFavorite={inFavorite} />
            </button>

            <Link to={`/products/${productId}`} style={{ opacity: inStock ? '1' : '0.5' }}>
                <div className={styles['product-card__image']}>
                    {imageLoading && <Spinner />}
                    <img style={imageLoading ? { display: 'none' } : { display: 'flex' }}
                        src="/images/categories/03.png" alt="product image"
                        onLoad={() => setImageLoading(false)} />
                </div>
            </Link>
            <div className={styles['product-card__bottom-box']} style={{ opacity: inStock ? '1' : '0.5' }}>
                <Link className={styles['product-card__title']} to={`/products/${productId}`}>{title}</Link>
                <div className={styles['product-card__fields']}>
                    <Field title='Розница:' value={`${getPrice(discount, price)} ₴`} />
                    <Field title='Оптом (от 5 штук):' value={`${getPrice(discount, wholesalePrice)} ₴`} />
                    {inStock ? <Field title='В наличии:' value={`${inStock} шт.`} /> : <p>Нет в наличии.</p>}
                </div>
                {Boolean(inStock) && <div className={styles['product-card__bottom']}>
                    <Counter onCounterChange={onCounterChange} maxValue={inStock} />
                    <BorderedButton
                        disabled={!isCartFinally}
                        className={styles['product-card__cart-button']}
                        title={inCart ? 'В корзине' : 'В корзину'}
                        onClick={onAddToCartButtonClick} />
                </div>}
            </div>
        </div >
    )
}
