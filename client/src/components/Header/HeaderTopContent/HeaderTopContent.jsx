import { Link } from 'react-router-dom'
import styles from './HeaderTopContent.module.css'
import { useSelector } from 'react-redux'

import PhoneIcon from '@/svg/PhoneIcon'
import ThemeToggle from '../../ThemeToggle/ThemeToggle'
import AvatarIcon from '../../../svg/AvatarIcon'


export default function HeaderTopContent() {
    const userData = useSelector(state => state.user.userData)
    return (
        <section className={styles['header__top-content']}>
            <ul className={styles['header__top-links']}>
                <Link to="/about">О компании</Link>
                <Link to="/delivery-and-pay">Доставка и оплата</Link>
                <Link to="/guarantees">Гарантии</Link>
                <Link to="/contacts">Контакты</Link>
            </ul>
            <div className={styles['header__top-buttons']}>
                <a className={styles['header__phone-number']} href="tel:+79652374449">
                    <PhoneIcon color='var(--typography---main)' />
                    +380 (965) 237-44-49
                </a>
                <ThemeToggle />
                <Link className={styles['header__top-buttons__profile']}
                    to={useSelector((state) => state.user.isTokenValid) ? '/profile' : '/auth'}>
                    Личный кабинет
                    <div>
                        {userData?.avatarUrl ? <img src={userData?.avatarUrl} alt='profile-image' /> : <AvatarIcon />}
                    </div>
                </Link>

            </div>
        </section>
    )
}
