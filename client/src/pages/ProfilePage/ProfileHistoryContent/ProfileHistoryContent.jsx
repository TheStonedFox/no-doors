import { Link } from 'react-router-dom'
import styles from './ProfileHistoryContent.module.css'
import { useSelector } from 'react-redux'

import OrderCard from '../../../components/OrderCard/OrderCard.jsx'

import EmptyPlaceholder from '../../../components/EmptyPlaceholder/EmptyPlaceholder.jsx'

export default function ProfileHistoryContent() {
    const userData = useSelector((state => state.user.userData))
    return (
        <section className={styles['orders-history']}>
            <section className={styles['orders-history__header']}>
                <h3 className={styles['orders-history__header-title']}>История заказов:</h3>
                {Boolean(userData?.orders.length) && <Link className='header-link header-link_clear'>Очистить историю заказов</Link>}
            </section>
            <div className={styles['orders-history__list']}>
                {!userData?.orders.length && <EmptyPlaceholder title='Список заказов пуст.' />}
                {userData?.orders.map((order, index) => <OrderCard key={order} orderId={order} orderNumber={index + 1} />)}
            </div>
        </section>
    )
}
