import React, { useEffect, useMemo, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import Button from '../../components/Button/Button'
import CartItem from '.././../components/CartItem/CartItem'
import Spinner from '../../components/Spinner/Spinner'
import Input from '../../components/Input/Input'
import CartItems from '../../components/CartItems/CartItems'

import styles from './CartPage.module.css'
import { useCart } from '../../hooks/useCart'


export default function CartPage() {
    const negative = useNavigate()
    const [promocode, setPromocode] = useState('')

    const [, userData, sum,] = useCart()

    return (
        <div className={styles['cart-page']} >
            <h2 className={`${'section-title'} ${styles['cart-page__title']}`}>Ваша корзина</h2>
            <CartItems />
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
        </div>
    )
}
