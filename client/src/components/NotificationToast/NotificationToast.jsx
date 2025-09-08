import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

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
        setHide(true)
        dispatch(removeNotification(id))
        route && redirect && navigate(`/${route}`)
    }

    return (
        <aside className={`${styles['notification-toast']} ${type === 'info' && styles['info-type-colors']}`}
            id={`${id}`}
            style={{ opacity: hide ? '0' : '1', transition: '0.5s' }}
            onClick={() => onNotificationClick(false)}>
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
