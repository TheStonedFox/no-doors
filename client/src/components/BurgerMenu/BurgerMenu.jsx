import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import BorderedButton from '../BorderedButton/BorderedButton'
import ThemeToggle from '../ThemeToggle/ThemeToggle'
import { toggleBurger } from '../../redux/features/uiSlice'
import { useDispatch } from 'react-redux'

import styles from './BurgerMenu.module.css'

export default function BurgerMenu() {

    const dispatch = useDispatch()
    const isOpen = useSelector((state) => state.ui.isBurgerOpen)
    return (
        <div style={isOpen ?
            { transform: 'translate(0px)', padding: '50px' } :
            { transform: 'translate(-100%)', padding: '50px 0px', boxShadow: 'none' }}
            className={styles['burger-menu']} onTouchMove={(e) => {
                const touch = e.touches[0]
                // if (touch.clientX > 250)
                e.currentTarget.style = `transform: translate(${touch.clientX - 320}px)`
            }} onTouchEnd={(e) => {
                const touch = e.changedTouches[0]
                console.log(touch.pageX)
                if (touch.pageX < 320 / 2) {
                    e.currentTarget.style = `transform: translate(-320px)`

                    dispatch(toggleBurger())
                }
                else {
                    e.currentTarget.style = `transform: translate(0px)`
                }
            }}>
            <ThemeToggle className={styles['burger-menu__theme-toggle']} mode={localStorage.getItem('theme') || null} />
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
