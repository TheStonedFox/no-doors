import React from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import BorderedButton from '../BorderedButton/BorderedButton'
import LanguageDropdown from '../LanguageDropdown/LanguageDropdown'

import styles from './BurgerMenu.module.css'

export default function BurgerMenu() {

    const isOpen = useSelector((state) => state.burger.isBurgerOpen)
    return (
        <div style={isOpen ? { width: '320px', padding: '50px' } : { width: '0', padding: '50px 0px' }} className={styles['burger-menu']} >
            <LanguageDropdown className={styles['burger-menu__language']} />
            <div className={styles.box}>
                <ul className={styles.links}>
                    <Link to='/about'>О компании</Link>
                    <Link to='/delivery-and-pay'>Доставка и оплата</Link>
                    <Link to='/guarantees'>Гарантии</Link>
                    <Link to='/contacts'>Контакты</Link>
                </ul>
                <BorderedButton title='+7 (965) 237-44-49' />
            </div>

        </div >
    )
}
