import React from 'react'
import { Link } from 'react-router-dom'

import Logo from '@/SvgIcons/Logo'
import PhoneIcon from '@/SvgIcons/PhoneIcon'
import VkIcon from '@/SvgIcons/VkIcon'
import InstagramIcon from '@/SvgIcons/InstagramIcon'

import styles from './Footer.module.css'

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <Link to='/' className={styles.footer__logo} >
                <Logo color='#ffff' />
            </Link>

            <div className={styles.footer__navigation}>
                <h3>Навигация</h3>
                <ul>
                    <Link to='/about'>О компании</Link>
                    <Link to='/delivery-and-pay'>Доставка и оплата</Link>
                    <Link to='/guarantees'>Гарантии</Link>
                    <Link to='/contacts'>Контакты</Link>
                </ul>
            </div>
            <div className={styles.footer__contacts}>
                <h3>Контакты</h3>
                <ul>
                    <li>
                        <PhoneIcon color='#ffffff' />
                        <a href="tel:+3809652374449">+380 (965) 237-44-49</a>
                    </li>
                    <li>
                        <VkIcon />
                        <a href="vk.com/*long_link" target='_blank'>vk.com/long_link</a>
                    </li>
                    <li>
                        <InstagramIcon />
                        <a href="@long_nickname" target='_blank'>@long_nickname</a>
                    </li>
                </ul>
            </div>
            <div className={styles['footer__pay-methods']}>
                <h3>Способы оплаты</h3>
                <div className={styles['footer__pay-icons']}>
                    <img src="/images/footer/logo-visa.png" alt="visa" />
                    <img src="/images/footer/logo-mastercard.png" alt="mastercard" />
                    <img src="/images/footer/logo-maestro.png" alt="mastercard" />
                </div>
            </div>
            <div className={styles.footer__policy}>
                <a href="/#">Политика конфиденциальности</a>
                <p>No Doors Technology © 2020</p>
            </div>
        </footer>
    )
}
