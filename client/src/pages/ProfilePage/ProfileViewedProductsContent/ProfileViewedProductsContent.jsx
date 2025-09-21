
import styles from './ProfileViewedProductsContent.module.css'

import EmptyPlaceholder from '../../../components/EmptyPlaceholder/EmptyPlaceholder'
import { useDispatch, useSelector } from 'react-redux'
import ProductCard from '../../../components/ProductCard/ProductCard'
import { Link } from 'react-router-dom'
import { clearViewedProduct } from '../../../api/api'
import { addNotification } from '../../../redux/features/uiSlice'
import { setUserData } from '../../../redux/features/userSlice'

export default function ProfileViewedProducts() {
    const dispatch = useDispatch()
    const userData = useSelector((state => state.user.userData))

    const onClearButtonClick = (e) => {
        e.preventDefault()
        clearViewedProduct(userData?._id)
            .then((res) => {
                dispatch(addNotification({ type: 'info', text: res.message }))
                dispatch(setUserData())
            })
            .catch((error) => dispatch(addNotification({ type: 'error', text: error.message })))
    }
    return (
        <section className={styles['viewed-products']}>
            <section className={styles['viewed-products__header']}>
                <h3 className={styles['viewed-products__header-title']}>Просмотренные товары</h3>
                {Boolean(userData?.viewedProducts.length) && <Link className='header-link header-link_clear' onClick={onClearButtonClick}>Очистить историю заказов</Link>}
            </section>
            {!userData?.viewedProducts.length && <EmptyPlaceholder title='Список пуст.' />}
            <section className={styles['viewed-products__products']}>
                {userData?.viewedProducts.map((product, index) => <ProductCard key={product._id} productData={product} />)}
            </section>
        </section>
    )
}
