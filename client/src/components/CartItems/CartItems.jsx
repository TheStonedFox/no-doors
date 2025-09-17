import { useEffect, useState } from 'react'

import { useCart } from '../../hooks/useCart'

import Spinner from '../Spinner/Spinner'
import CartItem from '../CartItem/CartItem'

import styles from './CartItems.module.css'
import { getOrder } from '@api/api'
import EmptyPlaceholder from '../EmptyPlaceholder/EmptyPlaceholder'

export default function CartItems({ orderId, className, viewOnly }) {

    const { products, userData, isLoading, error, refetch } = useCart()

    const [order, setOrder] = useState()

    useEffect(() => {
        orderId && getOrder(orderId).then(res => setOrder(res.order)).catch(error => alert(error))
    }, [orderId])

    return (
        <div className={className}>
            <div className={styles['cart-items']}>
                <p className={styles['cart-items__title']}>Название товара</p>
                <p className={styles['cart-items__title']}>Цена (Розница)</p>
                <p className={styles['cart-items__title']}>Цена (Опт от 5)</p>
                {!viewOnly && <p className={styles['cart-items__title']}>Остаток</p>}
                <p className={styles['cart-items__title']}>Количество</p>
                <p className={styles['cart-items__title']}>Сумма</p>

                {Boolean(!isLoading && !error && userData?.cartItems.length) && !orderId && userData.cartItems.map(cartItem => {
                    const item = products?.find(item => item._id === cartItem.productId)
                    return item ? <CartItem key={item._id} productData={item} initialQuantityValue={cartItem.quantity}></CartItem> : null
                })}

                {order?.products?.map(orderProduct => {
                    const item = products?.find(item => item._id === orderProduct.productId)
                    return item ? <CartItem key={item._id} productData={item} initialQuantityValue={orderProduct.quantity} viewOnly={true} reviewButton={order?.status === 'paid'}></CartItem> : null
                })}

            </div>
            {error && !isLoading &&
                <EmptyPlaceholder title=' Не удалось загрузить список товаров.' actionTitle='Попробовать еще раз.' action={refetch} />}
            {isLoading && <Spinner />}
        </div>

    )
}
