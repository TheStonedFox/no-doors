import React, { useEffect, useState } from 'react'
import { data, Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'


import Field from '../../components/Field/Field'

import styles from './OrderCard.module.css'
import getWordEnding from '../../utils/getWordEnding'

import { togglePopup } from '../../features/uiSlice'

import { statusColors, statusTitles } from '../../utils/orderStatus'
import { getOrder } from '../../api/api'
export default function OrderCard({ orderId, orderNumber }) {
    // const [status, sum, date] = orderInfo
    const dispatch = useDispatch()

    const [order, setOrder] = useState()

    const [paymentStatus, setPaymentStatus] = useState('')

    const date = new Date(order?.createdAt)

    useEffect(() => {

        getOrder(orderId)
            .then(res => setOrder(res.order))
            .catch(error => alert(error))
    }, [])

    return (
        <div className={styles['order-card']} onClick={() => dispatch(togglePopup({ type: 'order-card', data: orderId }))}>
            <section className={styles['order-card__top-section']}>
                <div>
                    <Link className={styles['order-card__order-id']}>{`Заказ #${orderNumber}`}</Link>
                    ·
                    <p className={styles['order-card__order-status']} style={{ color: statusColors[order?.status] }}>{statusTitles[order?.status]}</p>
                </div>
                <p className={styles['order-card__order-date']}>{date.toLocaleDateString('ru-RU')}</p>
            </section>
            <section className={styles['order-card__order-info']}>
                <Field title='Описание' value={`${order?.products?.length} товар${getWordEnding(order?.products.length)} на сумму ${order?.sum} ₴`} />
                <Field title='Скидка' value='10%' />
                <Field title={<span className={styles['order-info__bold-p']}>Итого к оплате:</span>} value={<span className={styles['order-info__bold-p']}>{order?.deliveryMethod === 'delivery' ? order?.sum + 100 : order?.sum} ₴</span>} />
            </section>
        </div>
    )
}
