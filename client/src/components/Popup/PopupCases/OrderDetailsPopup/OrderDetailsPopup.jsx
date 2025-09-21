import { useEffect, useState } from 'react'

import Field from '../../../Field/Field'
import CartItems from '../../../CartItems/CartItems'
import Button from '../../../Button/Button'

import styles from './OrderDetailsPopup.module.css'

import { statusColors, statusTitles } from '@utils/statusHelper'

import { useDispatch, useSelector } from 'react-redux'
import * as api from '@api/api'

import { addNotification, togglePopup } from '../../../../redux/features/uiSlice'
import { getOrder } from '../../../../api/api'


export default function OrderDetailsPopup({ orderId }) {

    const dispatch = useDispatch()
    const userData = useSelector(state => state.user.userData)
    const [order, setOrder] = useState()
    const [payData, setPayData] = useState()
    const date = new Date(order?.createdAt)
    const [paymentStatus, setPaymentStatus] = useState()

    useEffect(() => {
        api.getOrder(orderId)
            .then(res => setOrder(res.order))
            .catch(error => dispatch(addNotification({ type: 'error', text: error.message })))
    }, [orderId, dispatch])

    useEffect(() => {
        api.createPayment(order?.sum, order?._id)
            .then(res => setPayData(res))
            .catch(error => dispatch(addNotification({ type: 'error', text: error.message })))

        if (order?.paymentMethod === 'online') {
            api.getPaymentStatus(orderId)
                .then(res => {
                    if (res?.status === 'sandbox' | res?.status === 'success') {
                        api.updatePaymentStatus(orderId, { status: 'paid' })
                            .then(() => setPaymentStatus('paid'))
                            .catch(error => dispatch(addNotification({ type: 'error', text: error.message })))
                    }
                }).catch(error => dispatch(addNotification({ type: 'error', text: error.message })))
        }
        setPaymentStatus(order?.status)
    }, [order, orderId, dispatch])

    return (
        <div className={styles['order-details-popup']}>
            <section className={styles['order-details-popup__header']}>
                <div>
                    <h3 className={styles['order-details-popup__id']}>{`Заказ #${userData?.orders.findIndex(order => order === orderId) + 1}`}  ·</h3>

                    <p className={styles['order-details-popup__status']} style={{ color: statusColors[paymentStatus] }}>{statusTitles[paymentStatus]}</p>
                </div>
                <p className={styles['order-details-popup__date']}>{`Заказ от ${date.toLocaleDateString('ru-RU')}`}</p>
            </section>
            <CartItems orderId={orderId} viewOnly={true} />
            <section className={styles['order-details-popup__result']}>
                <Field title='Общая скидка:' value={<p className={styles['field-value']}>10%</p>} />
                <Field title='Итого:' value={<p className={styles['field-value']}>{order?.sum} ₴</p>} />

                {order?.paymentMethod === 'online' && paymentStatus === 'pending' && <form id='liqpay-form' action="https://www.liqpay.ua/api/3/checkout" target='_blank' method='POST'
                    onSubmit={async (event) => {
                        event.preventDefault()

                        const actualOrder =
                            await getOrder(orderId).catch((error) => dispatch(addNotification({ type: 'error', text: error.message })))

                        setOrder(actualOrder?.order)

                        if (actualOrder?.status === 'paid') return

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
