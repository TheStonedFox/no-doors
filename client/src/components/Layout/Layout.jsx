import React, { useEffect, useState } from 'react'
import styles from './Layout.module.css'

import { useDispatch, useSelector } from 'react-redux'

import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import Popup from '../Popup/Popup'
import { toggleSearchResults } from '../../features/uiSlice'

import { FaChevronUp } from "react-icons/fa"


export default function Layout({ children }) {

    const isPopupOpen = useSelector((state) => state.ui.isPopupOpen)

    useEffect(() => { document.querySelector('html').style = `${isPopupOpen ? 'overflow-y: hidden' : ''}` }, [isPopupOpen])

    const scrollHandler = () => setScrollTop(document.documentElement.scrollTop)
    useEffect(() => {
        window.addEventListener('scroll', scrollHandler)
        return () => window.removeEventListener('scroll', scrollHandler)
    }, [])
    const [scrollTop, setScrollTop] = useState(0)

    const dispatch = useDispatch()
    return (
        <div className={styles.layout} onClick={(event) => {
            if (!document.querySelector('#search-result').contains(event.target)
                && event.target.id !== 'search-input'
                && event.target.id !== 'popup' && event.target.id !== 'mobile-search-input') {
                dispatch(toggleSearchResults(false))
            }
        }}>
            <div className={styles.header}><Header></Header></div>
            <main className={styles.main}>{children}</main>
            <div className={styles.footer}><Footer></Footer></div>
            <Popup />
            <div className={styles['scroll-up-button']}
                style={{ opacity: document.documentElement.scrollHeight / scrollTop < 5 ? '1' : '0', transition: '0.2s' }}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <FaChevronUp color='var( --ui---bg-main)' />
            </div>
        </div>
    )
}
