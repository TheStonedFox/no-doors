import styles from './HeaderMiddleContent.module.css'

import Logo from '@/svg/Logo'
import FavoriteIcon from '../HeaderFavoriteIcon'
import { Link } from 'react-router-dom'
import SearchInput from '../../SearchInput/SearchInput'
import { useDispatch, useSelector } from 'react-redux'
import { useState } from 'react'
import CartIcon from '../CartIcon'
import { toggleBurger } from '../../../redux/features/uiSlice'

export default function HeaderMiddleContent() {
    const userData = useSelector((state) => state.user.userData)
    const cartCounter = userData?.cartItems.length || 0
    const favoriteCounter = userData?.favoriteItems.length || 0
    const [searchValue, setSearchValue] = useState('')

    const dispatch = useDispatch()


    const isBurgerOpen = useSelector((state) => state.ui.isBurgerOpen)
    return (
        <section className={styles['header__middle-content']}>
            <button className={styles.burger} style={{ zIndex: 1001 }} type="button" onClick={() => dispatch(toggleBurger())}>
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
                <Link to="/favorites" className={styles['header__middle-button']}>
                    <FavoriteIcon />
                    <p>Избранное</p>
                    <div style={!favoriteCounter ? { display: 'none' } : null}>
                        {favoriteCounter}
                    </div>
                </Link>
                <Link to="/cart" className={styles['header__middle-button']}>
                    <CartIcon />
                    <p>Моя корзина</p>
                    <div style={!cartCounter ? { display: 'none' } : null}>
                        {cartCounter}
                    </div>
                </Link>
            </div>
        </section>
    )
}
