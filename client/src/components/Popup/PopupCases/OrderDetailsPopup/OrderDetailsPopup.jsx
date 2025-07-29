import React, { useEffect, useState } from 'react'

import Field from '../../../Field/Field'
import CartItems from '../../../CartItems/CartItems'
import Button from '../../../Button/Button'

import styles from './OrderDetailsPopup.module.css'

import { statusColors, statusTitles } from '../../../../utils/orderStatus'

import { useDispatch, useSelector } from 'react-redux'
import { createPayment } from '../../../../api/api'
import { togglePopup } from '../../../../features/uiSlice'

export default function OrderDetailsPopup({ orderId }) {

    const dispatch = useDispatch()
    const userData = useSelector(state => state.user.userData)
    const [order, setOrder] = useState()
    const [payData, setPayData] = useState()
    const date = new Date(order?.createdAt)

    const [paymentStatus, setPaymentStatus] = useState()

    useEffect(() => {
        if (orderId) {
            fetch(`${import.meta.env.VITE_API_URL}/orders/${orderId}`, {
                headers: { 'Authorization': localStorage.getItem('token') }
            })
                .then(res => res.json())
                .then(order => setOrder(order.order))
        }
    }, [orderId])


    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL}/create-payment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify({ amount: order?.sum, orderId: order?._id })
        })
            .then(res => res.json())
            .then(data => setPayData(data))


        if (order?.paymentMethod === 'online') {

            fetch(`${import.meta.env.VITE_API_URL}/payment-status/${orderId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                }
            })
                .then(res => res.json())
                .then(data => {
                    if (data?.status === 'sandbox' | data?.status === 'success') {
                        fetch(`${import.meta.env.VITE_API_URL}/orders/${orderId}`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json', 'Authorization': localStorage.getItem('token') },
                            body: JSON.stringify({ status: 'paid' })
                        })
                    }
                })
        }
    }, [order])

    return (
        <div className={styles['order-details-popup']}>
            <section className={styles['order-details-popup__header']}>
                <div>
                    <h3 className={styles['order-details-popup__id']}>{`Заказ #${userData?.orders.findIndex(order => order === orderId) + 1}`}</h3>
                    ·
                    <p className={styles['order-details-popup__status']} style={{ color: statusColors[order?.status] }}>{statusTitles[order?.status]}</p>
                </div>
                <p className={styles['order-details-popup__date']}>{`Заказ от ${date.toLocaleDateString('ru-RU')}`}</p>
            </section>
            <CartItems orderId={orderId} />
            <section className={styles['order-details-popup__result']}>
                <Field title='Общая скидка:' value={<p className={styles['field-value']}>10%</p>} />
                <Field title='Итого:' value={<p className={styles['field-value']}>{order?.sum} ₴</p>} />

                {order?.paymentMethod === 'online' && order?.status === 'pending' && <form id='liqpay-form' action="https://www.liqpay.ua/api/3/checkout" target='_blank' method='POST'
                    onSubmit={async (event) => {
                        event.preventDefault() // сначала всегда отменяем
                        const res = await fetch(`http://localhost:3001/orders/${orderId}`, {
                            headers: { 'Authorization': localStorage.getItem('token') }
                        })
                        const actualOrder = await res.json()
                        setOrder(actualOrder.order)
                        console.log(actualOrder)

                        if (actualOrder.status === 'paid') {
                            alert('Этот заказ уже оплачен')
                            return
                        }

                        // если всё ок — сабмитим вручную
                        event.target.submit()
                        dispatch(togglePopup())
                    }}>
                    <input type="hidden" name="data" value={payData?.data} />
                    <input type="hidden" name="signature" value={payData?.signature} />
                    <Button title='Оплатить' />
                </form>}
            </section>
        </div>
    )
}
