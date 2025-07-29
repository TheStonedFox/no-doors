import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import BorderedButton from '../BorderedButton/BorderedButton'
import ThemeToggle from '../ThemeToggle/ThemeToggle'
import { toggleBurger } from '../../features/uiSlice'
import { useDispatch } from 'react-redux'

import styles from './BurgerMenu.module.css'

export default function BurgerMenu() {

    const dispatch = useDispatch()
    const isOpen = useSelector((state) => state.ui.isBurgerOpen)
    return (
        <div style={isOpen ? { width: '320px', padding: '50px' } : { width: '0', padding: '50px 0px' }} className={styles['burger-menu']} >
            {/* <ThemeToggle className={styles['burger-menu__theme-toggle']} /> */}
            <div className={styles.box}>
                <ul className={styles.links}>
                    <Link
                        to='/about'
                        onClick={() => dispatch(toggleBurger())}
                    >О компании</Link>
                    <Link
                        to='/delivery-and-pay'
                        onClick={() => dispatch(toggleBurger())}
                    >Доставка и оплата</Link>
                    <Link
                        to='/guarantees'
                        onClick={() => dispatch(toggleBurger())}
                    >Гарантии</Link>
                    <Link
                        to='/contacts'
                        onClick={() => dispatch(toggleBurger())}
                    >Контакты</Link>
                    <Link
                        to='/profile'
                        onClick={() => dispatch(toggleBurger())}
                    >Личный кабинет</Link>
                </ul>
                <BorderedButton title='+380 (965) 237-44-49' />
            </div>

        </div >
    )
}
