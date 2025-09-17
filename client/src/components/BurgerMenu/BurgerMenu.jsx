import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import BorderedButton from '../BorderedButton/BorderedButton'
import ThemeToggle from '../ThemeToggle/ThemeToggle'
import { closeBurger, toggleBurger } from '../../redux/features/uiSlice'
import { useDispatch } from 'react-redux'

import styles from './BurgerMenu.module.css'
import { useEffect, useRef, useState } from 'react'
import useSwipe from '../../hooks/useSwipe'
import AvatarIcon from '../../svg/AvatarIcon'
export default function BurgerMenu() {

    const dispatch = useDispatch()
    const isBurgerOpen = useSelector((state) => state.ui.isBurgerOpen)

    const userData = useSelector(state => state.user.userData)


    const menuRef = useRef(null)
    const { handleTouchStart, handleTouchMove, handleTouchEnd } = useSwipe(
        isBurgerOpen,
        menuRef,
        () => dispatch(toggleBurger(false)))



    return (

        <div style={isBurgerOpen ?
            { transform: `translate(0px)`, padding: '50px' } :
            { transform: 'translate(-100%)', padding: '50px 0px', boxShadow: 'none' }}
            className={styles['burger-menu']}
            ref={menuRef}
            onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} onTouchMove={handleTouchMove}>
            <ThemeToggle className={styles['burger-menu__theme-toggle']} mode={localStorage.getItem('theme') || null} />

            <div className={styles.box}>
                <img className={styles['bg-avatar-blur-img']} src={userData?.avatar?.url} />
                <ul className={styles.links}>
                    <Link className={styles['profile-link']}
                        to='/profile'
                        onClick={() => dispatch(toggleBurger())}
                    >
                        {userData?.avatar?.url ? <img src={userData.avatar.url} alt="avatar" /> : <AvatarIcon />}
                        <p>{userData?.fio ? userData?.fio.split(' ').slice(0, 2).join(' ') : 'Личный кабинет'}</p>

                    </Link>
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
                <BorderedButton title='+380 (965) 237-44-49' onClick={() => {
                    window.location.href = "tel:+3809652374449"
                    dispatch(closeBurger())
                }} />
            </div>
        </div >
    )
}
