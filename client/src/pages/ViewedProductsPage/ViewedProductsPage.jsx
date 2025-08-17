import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'


import ItemsList from '@components/ItemsList/ItemsList'
import ProductCard from '@components/ProductCard/ProductCard'
import Spinner from '@components/Spinner/Spinner'
import Button from '@components/Button/Button'

import styles from './ViewedProductsPage.module.css'

import { getProducts } from '@api/api'

export default function ViewedProductsPage() {
    const userData = useSelector((state) => state.user.userData)

    const [products, setProducts] = useState([])
    const [loadedItemsCount, setLoadedItemsCount] = useState(4)
    const [loadingStatus, setLoadingStatus] = useState(true)

    const getData = async () => {
        try {
            setProducts(await getProducts(() => setLoadingStatus(false)))
        } catch (error) {
            console.error(`не удалось загрузить товары! ${error}`)
            setLoadingStatus(false)
        }
    }

    useEffect(() => {
        getData()
    }, [])


    return (
        <div className={styles['viewed-products-page']}>
            <section className='page-title-section'>
                <h1 className='section-title'>Просмотренные товары</h1>
                <Link className='header-link' to='/clear-viewed-history'>Очистить историю просмотров</Link>
            </section>

            {!loadingStatus ? <ItemsList>
                {products?.map(product => < ProductCard productData={product} key={product._id} />)}
            </ItemsList> : <Spinner />}
            {userData?.favoriteItems.length > 8 && <Button
                className={styles['viewed-products-page__more-button']}
                title={loadedItemsCount !== userData.favoriteItems.length ? 'Показать еще' : 'Показать меньше'}
                onClick={() => {

                    if (loadedItemsCount !== userData.favoriteItems.length)
                        setLoadedItemsCount(prev => prev + 4 <= userData.favoriteItems.length - 4 ? prev + 4 : userData.favoriteItems.length)
                    else
                        setLoadedItemsCount(4)
                }
                }
            />}
        </div>
    )
}
