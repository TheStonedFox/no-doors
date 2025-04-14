import React, { useEffect, useState } from 'react'
import { data, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'


import Field from '../../components/Field/Field'

import styles from './OrderCard.module.css'
import getWordEnding from '../../utils/getWordEnding'

import { togglePopup } from '../../features/uiSlice'

import { statusColors, statusTitles } from '../../utils/orderStatus'
export default function OrderCard({ orderId, orderNumber }) {
    // const [status, sum, date] = orderInfo
    const dispactch = useDispatch()

    const [order, setOrder] = useState()

    const [paymentStatus, setPaymentStatus] = useState('')
    const date = new Date(order?.createdAt)

    useEffect(() => {
        fetch(`http://localhost:3001/orders/${orderId}`, {
            headers: { 'Authorization': localStorage.getItem('token') }
        })
            .then(res => res.json())
            .then(order => setOrder(order))

    }, [])

    return (
        <div className={styles['order-card']} onClick={() => {
            dispactch(togglePopup({ type: 'order-card', data: orderId }))
        }}>
            <section className={styles['order-card__top-section']}>
                <div>
                    <Link className={styles['order-card__order-id']}>{`Заказ #${orderNumber}`}</Link>
                    ·
                    <p className={styles['order-card__order-status']} style={{ color: statusColors[order?.status] }}>{statusTitles[order?.status]}</p>
                </div>
                <p className={styles['order-card__order-date']}>{date.toLocaleDateString('ru-RU')}</p>
            </section>
            <section className={styles['order-card__order-info']}>
                <Field title='Описание' value={`${order?.products.length} товар${getWordEnding(order?.products.length)} на сумму ${order?.sum} ₴`} />
                <Field title='Скидка' value='10%' />
                <Field title={<p className={styles['rder-info__bold-p']}>Итого к оплате:</p>} value={<p className={styles['rder-info__bold-p']}>{order?.deliveryMethod === 'delivery' ? order?.sum + 100 : order?.sum} ₴</p>} />
            </section>
        </div>
    )
}
