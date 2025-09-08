import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { redirect, useNavigate } from 'react-router-dom'

import styles from './NotificationToast.module.css'

import ArrowIcon from '@/svg/ArrowIcon'

import { GoXCircle } from 'react-icons/go'
import { GoCheckCircle } from 'react-icons/go'
import { GoInfo } from "react-icons/go"

import { removeNotification } from '../../redux/features/uiSlice'
import { statusColors } from '@utils/statusHelper'

export default function NotificationToast({ id, text, type, route }) {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const [hide, setHide] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => {
            dispatch(removeNotification(id))
        }, 6000)

        return () => {
            clearTimeout(timer)
        }
    }, [hide, dispatch, id])

    const onNotificationClick = (redirect) => {
        setX(1000)
        setHide(true)
        dispatch(removeNotification(id))
        route && redirect && navigate(`/${route}`)
    }

    const startCordsRef = useRef({ x: null, y: null })
    const isTouchRef = useRef(false)
    const notificationRef = useRef(null)
    const [x, setX] = useState(null)

    const onTouchStart = (e) => {
        startCordsRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
        isTouchRef.current = true

    }

    const closeNotification = (isSwipeToRight) => {
        setX(isSwipeToRight ? 1000 : -1000)
        isSwipeToRight && route && redirect && navigate(`/${route}`)
        dispatch(removeNotification(id))
        setHide(true)
        console.log('ccll')
    }

    const onTouchEnd = () => {
        if (!notificationRef.current) return
        if (x < 0 && Math.abs(x) > notificationRef.current.clientWidth / 3)
            closeNotification(false)
        else
            setX(0)

        if (x > 0 && x > notificationRef.current.clientWidth / 3 && route)
            closeNotification(true)
        else
            setX(0)

        isTouchRef.current = false
    }

    const onTouchMove = (e) => {
        if (Math.abs(e.touches[0].clientY) > Math.abs(startCordsRef.current.y) + 60)
            return onTouchEnd()
        setX((e.touches[0].clientX - startCordsRef.current.x).toFixed(0))
    }

    return (
        <aside className={`${styles['notification-toast']} ${type === 'info' && styles['info-type-colors']}`}
            ref={notificationRef}
            id={`${id}`}
            style={{ opacity: hide ? '0' : '1', transition: '0.5s  ease-out', transform: `translateX(${x}px)` }}
            onClick={() => onNotificationClick(false)}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            onTouchMove={onTouchMove}>
            {type === 'success' && <GoCheckCircle color='var(--ui---main)' />}
            {type === 'error' && <GoXCircle color='var(--ui---red)' />}
            {type === 'info' && <GoInfo color='var(--ui---blue)' />}
            <h3>{text}</h3>

            {route && <ArrowIcon onClick={() => onNotificationClick(true)} />}
            <span className={styles['notification-toast__countdown-line']}
                style={{ backgroundColor: statusColors[type] }}></span>
        </aside>
    )
}
