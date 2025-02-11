import React from 'react'
import { useSelector } from 'react-redux'

import styles from './BurgerMenu.module.css'

export default function BurgerMenu() {

    const isOpen = useSelector((state) => state.burger.isBurgerOpen)
    return (
        <div style={isOpen ? { width: '320px' } : { width: '0' }} className={styles['burger-menu']} ></div >
    )
}
