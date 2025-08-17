import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import styles from './CatalogMenu.module.css'
import { useSelector } from 'react-redux'

export default function CatalogMenu() {
    const isOpen = useSelector((state) => state.ui.isCatalogOpen)

    const [fixedMobileInput, setFixedMobileInput] = useState(false)

    const userData = useSelector((state) => state.user.userData)

    const scrollHandler = () => setFixedMobileInput(window.scrollY > 160 ? true : false)

    useEffect(() => {
        window.addEventListener('scroll', scrollHandler)

        return () => removeEventListener('scroll', scrollHandler)
    }, [])

    return (
        <div style={isOpen ? { width: '320px', top: fixedMobileInput ? 0 : '126px' } : { width: '0', padding: '0px', top: fixedMobileInput ? 0 : '126px' }} className={styles['catalog-menu']} >
            <div className={styles.box}>
                <ul className={styles.links}>
                    <li>
                        <p>Apple</p>
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.05666 1.52835L4 4.58501L0.943344 1.52835L0 2.47166L4 6.47167L8 2.47166L7.05666 1.52835Z" fill="#181818" />
                        </svg>
                    </li>
                    <li>
                        <p>Huawei</p>
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.05666 1.52835L4 4.58501L0.943344 1.52835L0 2.47166L4 6.47167L8 2.47166L7.05666 1.52835Z" fill="#181818" />
                        </svg>
                    </li>
                    <li>
                        <p>Xiaomi</p>
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.05666 1.52835L4 4.58501L0.943344 1.52835L0 2.47166L4 6.47167L8 2.47166L7.05666 1.52835Z" fill="#181818" />
                        </svg>
                    </li>
                    <li>
                        <p>Samsung</p>
                        <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.05666 1.52835L4 4.58501L0.943344 1.52835L0 2.47166L4 6.47167L8 2.47166L7.05666 1.52835Z" fill="#181818" />
                        </svg>
                    </li>

                    <Link>Питание и кабели</Link>
                    <Link>Powerbank</Link>
                    <Link>Акции</Link>
                    <Link className={styles['price-link']}>Прайс-лист</Link>
                </ul>
            </div>

        </div >

    )
}
