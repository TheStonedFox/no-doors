import { useEffect, useState } from 'react'

import { useCart } from '../../hooks/useCart'

import Spinner from '../Spinner/Spinner'
import CartItem from '../CartItem/CartItem'

import styles from './CartItems.module.css'
import { getOrder } from '@api/api'

export default function CartItems({ orderId }) {

    const [products, userData, sum, loadingStatus] = useCart()

    const [order, setOrder] = useState()

    useEffect(() => {
        orderId && getOrder(orderId).then(res => setOrder(res.order)).catch(error => alert(error))
    }, [orderId])

    return (
        <div>
            {<div className={styles['cart-items']}>
                <p className={styles['cart-items__title']}>Название товара</p>
                <p className={styles['cart-items__title']}>Цена (Розница)</p>
                <p className={styles['cart-items__title']}>Цена (Опт от 5)</p>
                <p className={styles['cart-items__title']}>Остаток</p>
                <p className={styles['cart-items__title']}>Количество</p>
                <p className={styles['cart-items__title']}>Сумма</p>

                {!loadingStatus && userData.cartItems.length && !orderId ? userData?.cartItems.map(cartItem => {
                    const item = products?.find(item => item._id === cartItem.productId)
                    return item ? <CartItem key={item._id} productData={item} initialQuantityValue={cartItem.quantity}></CartItem> : null
                }) : null}

                {order?.products?.map(orderProduct => {
                    const item = products?.find(item => item._id === orderProduct.productId)
                    return item ? <CartItem key={item._id} productData={item} initialQuantityValue={orderProduct.quantity} viewOnly={true}></CartItem> : null
                })}

            </div>}
            {loadingStatus && <Spinner />}
        </div>

    )
}
