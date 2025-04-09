import React, { useEffect, useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import Button from '../../components/Button/Button'
import CartItem from '.././../components/CartItem/CartItem'
import Spinner from '../../components/Spinner/Spinner'
import Input from '../../components/Input/Input'

import styles from './CartPage.module.css'
import { setUserData } from '../../features/userSlice'
import { getProducts } from '../../api/api'
import { useCart } from '../../hooks/useCart'

export default function CartPage() {
    const negative = useNavigate()
    const [promocode, setPromocode] = useState('')

    const [products, userData, sum, loadingStatus] = useCart()

    return (
        <div className={styles['cart-page']} >
            <h2 className={`${'section-title'} ${styles['cart-page__title']}`}>Ваша корзина</h2>

            {!loadingStatus && userData.cartItems.length ? <div className={styles['cart-page__cart-items']}>
                <p className={styles['cart-items__title']}>Название товара</p>
                <p className={styles['cart-items__title']}>Цена (Розница)</p>
                <p className={styles['cart-items__title']}>Цена (Опт от 5)</p>
                <p className={styles['cart-items__title']}>Остаток</p>
                <p className={styles['cart-items__title']}>Количество</p>
                <p className={styles['cart-items__title']}>Сумма</p>

                {userData?.cartItems.map(cartItem => {
                    const item = products.find(item => item._id === cartItem.productId)
                    return item ? <CartItem key={item._id} productData={item} initialQuantityValue={cartItem.quantity}></CartItem> : null
                })}
            </div> : <p>Ваша корзина пуста...</p>}
            {loadingStatus && <Spinner />}
            {/* {userData?.cartItems.length === 0 && !loadingStatus && <p>Ваша корзина пуста...</p>} */}

            {userData?.cartItems.length ? <div className={styles['cart-page__result']}>
                <div className={styles['result__promo-code']}>
                    <div className={styles['promo-code__box']}>
                        <h4>Введите промокод на скидку:</h4>
                        <div className={styles['promo-code__input-box']}>
                            <Input className={styles['promo-code__input']} type='text' placeholder='BUY2020GOGO' value={promocode} onChange={(value) => setPromocode(value)} />
                            <Button className={styles['promo-code__button']} title='Применить' />
                            <p>Скидка по промокоду составит: <strong>0%</strong></p>
                        </div>
                    </div>
                </div>
                <div className={styles['result__make-order']}>
                    <p>Итого:<strong>{sum} грн.</strong></p>
                    <Button title='Оформить заказ' onClick={() => negative('/order')} />
                </div>
            </div> : null}
        </div >
    )
}
