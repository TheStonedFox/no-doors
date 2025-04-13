import React, { useEffect, useRef, useState } from 'react'
import Counter from '../Counter/Counter'
import Field from '../Field/Field'
import styles from './CartItem.module.css'

import { addCartItem, removeCartItem, updateCartItem } from '../../api/api'
import { useDispatch, useSelector } from 'react-redux'
import { setUserData } from '../../features/userSlice'

import Spinner from '../Spinner/Spinner'
import CartPopup from '../Popup/PopupCases/CartPopup'

import { togglePopup } from '../../features/uiSlice'

export default function CartItem({ productData, initialQuantityValue, getTotalPriceValue }) {

    const { title, price, wholesalePrice, inStock, _id, discount } = productData

    const [quantity, setQuantity] = useState(initialQuantityValue)
    const [imageLoading, setImageLoading] = useState(true)

    const userData = useSelector((state) => state.user.userData)
    const dispatch = useDispatch()

    useEffect(() => {
        setQuantity(initialQuantityValue ? initialQuantityValue : 1)
        return () => dispatch(setUserData())
    }, [])

    return (
        <div className={styles['cart-item']} >
            <div className={styles['cart-item__img']}>
                <img style={{ display: imageLoading ? 'none' : 'flex' }} src="../../../public/images/product-img.png" alt="product image" onLoad={() => setImageLoading(false)} />
                {imageLoading && <Spinner />}
            </div>

            <div className={styles['cart-item__title']}>
                <h4>{title}</h4>
                <p>Артикул: 854236896ABC</p>
            </div>
            <div className={styles['cart-item__fields']}>
                <Field title='Цена (Розница)' value={discount ? `${price - price / 100 * discount} ₴` : `${price} ₴`} />
                <Field title='Цена (Опт от 5)' value={discount ? `${wholesalePrice - wholesalePrice / 100 * discount} ₴` : `${wholesalePrice} ₴`} />
                <Field title='Остаток' value={`${inStock} шт.`} />
                <Field title='Сумма' value={discount === 0 ?
                    quantity < 5 ?
                        price * quantity : wholesalePrice * quantity
                    : quantity < 5 ?
                        (price - price / 100 * discount) * quantity :
                        (wholesalePrice - wholesalePrice / 100 * discount) * quantity + '₴'} />
            </div>
            <p>{discount > 0 ? `${price - price / 100 * discount}` : `${price}`} ₴</p>
            <p>{discount > 0 ? `${wholesalePrice - wholesalePrice / 100 * discount}` : `${wholesalePrice}`} ₴</p>
            <p>{`${inStock} шт.`}</p>
            <div className={styles['cart-item__controls']}>
                <Counter
                    className={styles['cart-item__counter']}
                    onCounterChange={(value) => {
                        setQuantity(value)
                        updateCartItem(userData._id, _id, value, () => dispatch(setUserData()))
                    }}
                    initialValue={initialQuantityValue} />

                <p>{discount === 0 ?
                    quantity < 5 ?
                        price * quantity : wholesalePrice * quantity
                    : quantity < 5 ?
                        (price - price / 100 * discount) * quantity :
                        (wholesalePrice - wholesalePrice / 100 * discount) * quantity} ₴
                </p>
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    onClick={async () => {
                        await removeCartItem(userData?._id, _id, () => dispatch(setUserData()))
                        dispatch(togglePopup(<CartPopup text='Товар удален из корзины!' />))
                    }}
                >
                    <g opacity="0.3" clipPath="url(#clip0_37_1899)">
                        <path d="M11.4887 10.001L19.6917 1.79796C20.1028 1.38687 20.1028 0.720381 19.6917 0.309327C19.2806 -0.101766 18.6141 -0.101766 18.2031 0.309327L9.99998 8.51237L1.79695 0.309327C1.38586 -0.101766 0.719374 -0.101766 0.30832 0.309327C-0.102734 0.720421 -0.102773 1.3869 0.30832 1.79796L8.51135 10.001L0.30832 18.204C-0.102773 18.6151 -0.102773 19.2816 0.30832 19.6927C0.719413 20.1038 1.3859 20.1037 1.79695 19.6927L9.99998 11.4896L18.203 19.6927C18.6141 20.1038 19.2806 20.1037 19.6916 19.6927C20.1027 19.2816 20.1027 18.6151 19.6916 18.204L11.4887 10.001Z" fill="#ED0000" />
                    </g>
                    <defs>
                        <clipPath id="clip0_37_1899">
                            <rect width="20" height="20" fill="white" />
                        </clipPath>
                    </defs>
                </svg>
            </div>
        </div >
    )
}
