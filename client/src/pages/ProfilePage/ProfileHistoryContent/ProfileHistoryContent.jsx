import { Link } from 'react-router-dom'
import styles from './ProfileHistoryContent.module.css'
import { useDispatch, useSelector } from 'react-redux'

import OrderCard from '../../../components/OrderCard/OrderCard.jsx'

import EmptyPlaceholder from '../../../components/EmptyPlaceholder/EmptyPlaceholder.jsx'
import { getUserOrders } from '../../../api/api.js'
import { addNotification } from '../../../redux/features/uiSlice.js'
import { useEffect, useState } from 'react'

export default function ProfileHistoryContent() {
    const dispatch = useDispatch()
    const userData = useSelector((state => state.user.userData))
    const [orders, setOrders] = useState([])
    const [isLoading, setIsLoading] = useState()

    useEffect(() => {
        setIsLoading(true)
        getUserOrders(userData?._id).then(res => setOrders(res.orders))
            .catch((error) => dispatch(addNotification({ type: 'error', text: error.message })))
            .finally(() => setIsLoading(false))
    }, [userData?._id, dispatch])

    return (
        <section className={styles['orders-history']}>
            <section className={styles['orders-history__header']}>
                <h3 className={styles['orders-history__header-title']}>История заказов:</h3>
            </section>
            <div className={styles['orders-history__list']}>
                {Boolean(!orders?.length && !isLoading) && < EmptyPlaceholder title='Список заказов пуст.' />}
                {orders && orders.map((order, index) => <OrderCard key={order._id} orderId={order._id} orderNumber={index + 1} />)}
            </div>
        </section>
    )
}
