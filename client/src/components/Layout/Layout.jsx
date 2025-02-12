import React from 'react'
import styles from './Layout.module.css'

import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import BurgerMenu from '../BurgerMenu/BurgerMenu'
import CatalogMenu from '../CatalogMenu/CatalogMenu'

export default function Layout({ children }) {
    return (
        <div className={styles.layout}>

            <div className={styles.layout__content}>
                <Header></Header>
                <main className={styles.main}>{children}</main>
                <Footer></Footer>
            </div>
        </div>
    )
}
