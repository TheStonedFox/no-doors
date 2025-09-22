import styles from './HeaderMiddleContent.module.css'

import Logo from '@/svg/Logo'
import FavoriteIcon from '../HeaderFavoriteIcon'
import { Link } from 'react-router-dom'
import SearchInput from '../../SearchInput/SearchInput'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import CartIcon from '../CartIcon'
import { addNotification, toggleBurger } from '../../../redux/features/uiSlice'

export default function HeaderMiddleContent() {
    const userData = useSelector((state) => state.user.userData)
    const cartCounter = userData?.cartItems.length || 0
    const favoriteCounter = userData?.favoriteItems.length || 0
    const [searchValue, setSearchValue] = useState('')

    const dispatch = useDispatch()

    const tokenStatus = useSelector((state) => state.user.isTokenValid)

    const isBurgerOpen = useSelector((state) => state.ui.isBurgerOpen)

    const onHeaderButtonClick = (e) => {
        if (tokenStatus) return
        e.preventDefault()
        dispatch(addNotification({ type: 'info', text: 'Войдите в свой аккаунт.', route: 'auth' }))
    }
    return (
        <section className={styles['header__middle-content']}>
            <button className={styles.burger} style={{ zIndex: 1001 }} type="button" onClick={() => dispatch(toggleBurger())} id='menuButton'>
                <div className={styles.lines}>
                    <span className={`${styles.line} ${isBurgerOpen ? styles['line_active'] : ''}`}></span>
                    <span className={`${styles.line} ${isBurgerOpen ? styles.hide : ''}`}></span>
                    <span className={`${styles.line} ${isBurgerOpen ? styles['line_active'] : ''}`}></span>
                </div>
                <h3>Меню</h3>
            </button>
            <Link to="/" className={styles['header__logo']}>
                <Logo color='var(--typography---main)' />
            </Link>

            <SearchInput className={styles['header__search-input']} value={searchValue} onChange={(value) => setSearchValue(value)} />

            <div className={styles['header__middle-buttons']}>
                <Link to="/favorites" className={styles['header__middle-button']} onClick={onHeaderButtonClick}>
                    <FavoriteIcon />
                    <p>Избранное</p>
                    <div style={!favoriteCounter ? { display: 'none' } : {}}>
                        {favoriteCounter}
                    </div>
                </Link>
                <Link to="/cart" onClick={onHeaderButtonClick} className={styles['header__middle-button']}>
                    <CartIcon />
                    <p>Моя корзина</p>
                    <div style={!cartCounter ? { display: 'none' } : {}}>
                        {cartCounter}
                    </div>
                </Link>
            </div>
        </section>
    )
}
