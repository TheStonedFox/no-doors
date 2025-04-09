import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import BorderedButton from '../BorderedButton/BorderedButton'
import LanguageDropdown from '../LanguageDropdown/LanguageDropdown'
import { toggleBurger } from '../../features/uiSlice'
import { useDispatch } from 'react-redux'

import styles from './BurgerMenu.module.css'

export default function BurgerMenu() {

    const dispatch = useDispatch()
    const isOpen = useSelector((state) => state.ui.isBurgerOpen)
    return (
        <div style={isOpen ? { width: '320px', padding: '50px' } : { width: '0', padding: '50px 0px' }} className={styles['burger-menu']} >
            <LanguageDropdown className={styles['burger-menu__language']} />
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
                </ul>
                <BorderedButton title='+7 (965) 237-44-49' />
            </div>

        </div >
    )
}
