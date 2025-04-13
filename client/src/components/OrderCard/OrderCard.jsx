import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'


import Field from '../../components/Field/Field'
import styles from './OrderCard.module.css'
import { togglePopup } from '../../features/uiSlice'
import CartItems from '../CartItems/CartItems'

export default function OrderCard({ orderId, orderNumber }) {
    // const [status, sum, date] = orderInfo
    const dispactch = useDispatch()

    const [order, setOrder] = useState()
    const date = new Date()
    useEffect(() => {
        fetch(`http://localhost:3001/order/${orderId}`)
            .then(res => res.json())
            .then(order => setOrder(order))

        // console.log(orderInfo)
    }, [])

    const statusColors = {
        new: 'var(--typography---second)',
        pending: '#ed5f00',
        delivered: 'var(--ui---blue)',
        rejected: 'var(--ui---red)',
        completed: 'var(--ui---main)',
    }

    const statusTitles = {
        new: 'Новый заказ',
        pending: 'Ожидает оплаты',
        delivered: 'Доставлен',
        rejected: 'Отменен',
        completed: 'Выполнен',
    }

    return (
        <div className={styles['order-card']} onClick={() => {
            dispactch(togglePopup(<CartItems orderId={orderId} />))
        }}>
            <section className={styles['order-card__top-section']}>
                <div>
                    <Link className={styles['order-card__order-id']}>{`Заказ #${orderNumber}`}</Link>
                    ·
                    <p className={styles['order-card__order-status']} style={{ color: statusColors[order?.status] }}>{statusTitles[order?.status]}</p>
                </div>
                <p className={styles['order-card__order-date']}>{`${date.getUTCDate(order?.createdAt)}.${date.getMonth(order?.createdAt) <= 9 ? '0' + date.getMonth(order?.createdAt) : date.getMonth(order?.createdAt)}.${date.getFullYear(order?.createdAt)}`}</p>
            </section>
            <section className={styles['order-card__order-info']}>
                <Field title='Описание' value={`${order?.products.length} товара на сумму ${order?.sum} ₴`} />
                <Field title='Скидка' value='10%' />
                <Field title={<p className={styles['rder-info__bold-p']}>Итого к оплате:</p>} value={<p className={styles['rder-info__bold-p']}>{order?.deliveryMethod === 'delivery' ? order?.sum + 100 : order?.sum} ₴</p>} />
            </section>
        </div>
    )
}
