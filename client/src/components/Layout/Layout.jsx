import React, { useEffect } from 'react'
import styles from './Layout.module.css'

import { useSelector } from 'react-redux'

import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import Popup from '../Popup/Popup'

export default function Layout({ children }) {
    const isPopupOpen = useSelector((state) => state.ui.isPopupOpen)
    const isCatalogOpen = useSelector((state) => state.ui.isCatalogOpen)

    return (
        <div className={styles.layout}>
            <div className={styles.header}><Header></Header></div>
            <main className={styles.main}>{children}</main>
            <div className={styles.footer}><Footer></Footer></div>
            <Popup>
                <div>123</div>
            </Popup>
        </div>
    )
}
