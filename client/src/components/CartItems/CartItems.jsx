import React from 'react'

import { useCart } from '../../hooks/useCart'

import Spinner from '../Spinner/Spinner'
import CartItem from '../CartItem/CartItem'

import styles from './CartItems.module.css'

export default function CartItems() {

    const [products, userData, sum, loadingStatus] = useCart()

    return (
        <div>
            {!loadingStatus && userData.cartItems.length ? <div className={styles['cart-items']}>
                <p className={styles['cart-items__title']}>Название товара</p>
                <p className={styles['cart-items__title']}>Цена (Розница)</p>
                <p className={styles['cart-items__title']}>Цена (Опт от 5)</p>
                <p className={styles['cart-items__title']}>Остаток</p>
                <p className={styles['cart-items__title']}>Количество</p>
                <p className={styles['cart-items__title']}>Сумма</p>

                {userData?.cartItems.map(cartItem => {
                    const item = products?.find(item => item._id === cartItem.productId)
                    return item ? <CartItem key={item._id} productData={item} initialQuantityValue={cartItem.quantity}></CartItem> : null
                })}
            </div> : <p>Ваша корзина пуста...</p>}
            {loadingStatus && <Spinner />}
        </div>
    )
}
