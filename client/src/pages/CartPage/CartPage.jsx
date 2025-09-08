import { useNavigate } from 'react-router-dom'
import Button from '@components/Button/Button'
import CartItems from '@components/CartItems/CartItems'
import EmptyPlaceholder from '@components/EmptyPlaceholder/EmptyPlaceholder'

import styles from './CartPage.module.css'
import { useCart } from '../../hooks/useCart'


export default function CartPage() {
    document.querySelector('title').innerHTML = 'Корзина'
    const navigate = useNavigate()

    const [, userData, sum, loadingStatus] = useCart()

    return (
        <div className={`${styles['cart-page']} container`} >
            <h2 className={`${'section-title'} ${styles['cart-page__title']}`}>Ваша корзина</h2>
            <CartItems className={styles['cart-page__cart-items']} />
            {userData?.cartItems.length ? <div className={styles['cart-page__result']}>
                <div className={styles['result__make-order']}>
                    <p>Итого: <strong>{sum} грн.</strong></p>
                    <Button title='Оформить заказ' onClick={() => navigate('/order')} />
                </div>
            </div> : null}
            {!userData?.cartItems.length && !loadingStatus ? <EmptyPlaceholder title='Корзина пуста.' /> : null}
        </div>
    )
}
