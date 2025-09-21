import { useEffect, useRef } from 'react'
import styles from './Layout.module.css'

import { useDispatch, useSelector } from 'react-redux'

import Header from '../Header/Header'
import Footer from '../Footer/Footer'
import Popup from '../Popup/Popup'

import { toggleSearchResults } from '../../redux/features/uiSlice'
import NotificationToast from '../NotificationToast/NotificationToast'
import ScrollUpButton from '../ScrollUpButton/ScrollUpButton'
import { useLocation } from 'react-router-dom'


export default function Layout({ children }) {

    const isPopupOpen = useSelector((state) => state.ui.isPopupOpen)
    const notificationsRef = useRef(null)
    const { pathname } = useLocation()

    useEffect(() => { document.querySelector('html').style = `${isPopupOpen ? 'overflow-y: hidden' : ''}` }, [isPopupOpen])
    useEffect(() => window.scrollTo(0, 0), [pathname])

    const notificationList = useSelector((state) => state.ui.notificationList)

    const dispatch = useDispatch()

    const onLayoutClick = () => {
        if (!document.querySelector('#search-result').contains(event.target)
            && event.target.id !== 'search-input'
            && event.target.id !== 'popup' && event.target.id !== 'mobile-search-input') {
            dispatch(toggleSearchResults(false))
        }
    }


    return (
        <div className={styles['layout']} onClick={onLayoutClick}>
            <div className={styles['header']}><Header></Header></div>
            <main className={styles['main']}>{children}</main>
            <div className={styles['footer']}><Footer></Footer></div>
            <Popup />
            <ScrollUpButton />
            <section
                className={`${styles['notifications-list']} ${notificationList.length > 3 ? styles['fade'] : null}`} ref={notificationsRef}
                style={!notificationList.length ? { padding: '0' } : {}}>
                {notificationList ? notificationList.map(notification => <NotificationToast
                    key={notification.id}
                    id={notification.id}
                    text={notification.text}
                    type={notification.type}
                    route={notification.route} />) : null}
            </section>
        </div >
    )
}
