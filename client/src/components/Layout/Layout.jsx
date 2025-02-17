import React from 'react'
import styles from './Layout.module.css'

import Header from '../Header/Header'
import Footer from '../Footer/Footer'

import { useDispatch } from 'react-redux'
import { closeAll } from '../../features/ui/uiSlice'

export default function Layout({ children }) {
    return (
        <div className={styles.layout}
            onClick={(e) => console.log(e.parentNode)}>
            <div className={styles.header}><Header></Header></div>
            <main className={styles.main}>{children}</main>
            <div className={styles.footer}><Footer></Footer></div>
        </div>
    )
}
