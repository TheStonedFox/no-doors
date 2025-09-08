import { Link, useNavigate } from 'react-router-dom'
import Button from '@components/Button/Button'
import CartItems from '@components/CartItems/CartItems'
import EmptyPlaceholder from '@components/EmptyPlaceholder/EmptyPlaceholder'

import styles from './CartPage.module.css'
import { useCart } from '../../hooks/useCart'
import { clearCart } from '../../api/api'

import { setUserData } from '../../redux/features/userSlice'
import { useDispatch } from 'react-redux'
import { addNotification } from '../../redux/features/uiSlice'

export default function CartPage() {
    const dispatch = useDispatch()
    document.querySelector('title').innerHTML = 'Корзина'
    const navigate = useNavigate()

    const [, userData, sum, loadingStatus] = useCart()

    const onCartClearButtonClick = () => {
        clearCart(userData._id).then((res) => {
            dispatch(setUserData())
            dispatch(addNotification({ type: 'info', text: res.message }))
        })
    }

    return (
        <div className={`${styles['cart-page']} container`} >
            <section className={styles['cart-page__header']}>
                <h2 className={`${'section-title'} ${styles['cart-page__title']}`}>Ваша корзина</h2>
                <a href='#' className='header-link header-link_clear' onClick={onCartClearButtonClick}>Очистить корзину</a>
            </section>
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
