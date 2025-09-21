import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import styles from './OrderCard.module.css'

import Field from '@components/Field/Field'

import getWordEnding from '@utils/getWordEnding'
import { statusColors, statusTitles } from '@utils/statusHelper'

import Spinner from '../Spinner/Spinner'

import { togglePopup } from '../../redux/features/uiSlice'

import { getOrder } from '@api/api'
import EmptyPlaceholder from '../EmptyPlaceholder/EmptyPlaceholder'

export default function OrderCard({ orderId, orderNumber }) {
    // const [status, sum, date] = orderInfo
    const dispatch = useDispatch()

    const [order, setOrder] = useState()
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    const [paymentStatus, setPaymentStatus] = useState('')

    const date = new Date(order?.createdAt)

    useEffect(() => {
        setError(null)
        setIsLoading(true)
        getOrder(orderId)
            .then(res => setOrder(res.order))
            .catch(error => setError(error))
            .finally(() => setIsLoading(false))
    }, [])

    const onOrderCardClick = () => !error && dispatch(togglePopup({ type: 'order-card', data: orderId }))

    return (
        <div className={styles['order-card']} onClick={onOrderCardClick}>
            {!isLoading && !error ? <section className={styles['order-card__top-section']}>
                <div>
                    <Link className={styles['order-card__order-id']}>{`Заказ #${orderNumber}`}</Link>
                    ·
                    <p className={styles['order-card__order-status']} style={{ color: statusColors[order?.status] }}>{statusTitles[order?.status]}</p>
                </div>
                <p className={styles['order-card__order-date']}>{date.toLocaleDateString('ru-RU')}</p>
            </section> : null}
            {!isLoading && !error && <section className={styles['order-card__order-info']}>
                <Field title='Описание' value={`${order?.products?.length} товар${getWordEnding(order?.products.length)} на сумму ${order?.sum} ₴`} />
                <Field title='Скидка' value='10%' />
                <Field title={<span className={styles['order-info__bold-p']}>Итого к оплате:</span>} value={<span className={styles['order-info__bold-p']}>{order?.deliveryMethod === 'delivery' ? order?.sum + 100 : order?.sum} ₴</span>} />
            </section>}
            {isLoading && <Spinner />}
            {error && !isLoading && <EmptyPlaceholder title='Не удалось загрузить данные' />}
        </div>
    )
}
