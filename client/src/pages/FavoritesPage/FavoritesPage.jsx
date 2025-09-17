import { useState, useEffect } from 'react'
import ItemsList from '@components/ItemsList/ItemsList'
import { useDispatch, useSelector } from 'react-redux'

import ProductCard from '@components/ProductCard/ProductCard'
import Button from '@components/Button/Button'
import EmptyPlaceholder from '@components/EmptyPlaceholder/EmptyPlaceholder'

import styles from './FavoritesPage.module.css'
import Spinner from '@components/Spinner/Spinner'
import { getProducts } from '@api/api'
import { clearFavorites } from '../../api/api'
import { setUserData } from '../../redux/features/userSlice'
import { addNotification } from '../../redux/features/uiSlice'

export default function FavoritesPage() {

    const dispatch = useDispatch()
    document.querySelector('title').innerHTML = 'Избранные товары'

    const userData = useSelector((state) => state.user.userData)
    const [products, setProducts] = useState([])
    const [loadedItemsCount, setLoadedItemsCount] = useState(4)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchProducts = () => {
        setError(null)
        setIsLoading(true)
        getProducts().then(res => setProducts(res.products)).catch(error => setError(error))
            .finally(() => setIsLoading(false))
    }
    useEffect(() => {
        fetchProducts()
    }, [])

    const onFavoritesClearButtonClick = () => {
        if (!userData) return
        clearFavorites(userData?._id).then(res => {
            dispatch(setUserData())
            dispatch(addNotification({ type: 'info', text: res.message }))
        })
            .catch(error => dispatch(addNotification({ type: 'error', text: error.message })))
    }

    return (
        <div className={`${styles['favorites-page']} container`}>
            <section className={styles['favorites-page__header']}>
                <h2 className={`${'section-title'} ${styles['favorites-page__title']}`}>Избранное</h2>
                {Boolean(userData?.favoriteItems?.length) && <a href='#' className='header-link header-link_clear' onClick={onFavoritesClearButtonClick}>Очистить корзину</a>}
            </section>
            {!userData?.favoriteItems && <div>Загрузка...</div>}
            {userData?.favoriteItems.length === 0 && !isLoading ? <EmptyPlaceholder title='Список избранного пуст.' /> : null}


            {Boolean(!isLoading && !error) && <ItemsList className={styles['favorites-page__items-list']}
                moreButton={true} dataLength={userData?.favoriteItems.length}>
                {
                    products?.filter(product => userData.favoriteItems.includes(product._id))
                        .filter((favoriteItem, index) => index < loadedItemsCount && favoriteItem)
                        .map(favoriteItem => <ProductCard productData={favoriteItem} key={favoriteItem._id} />)
                }
            </ItemsList>}
            {isLoading && <Spinner />}
            {error && <EmptyPlaceholder title='Не удалось загрузить список избранного.' actionTitle='Попробовать еще раз.' action={fetchProducts}></EmptyPlaceholder>}
            {userData?.favoriteItems.length > 4 && !isLoading && <Button
                className={styles['favorites-page__more-button']}
                title={loadedItemsCount !== userData.favoriteItems.length ? 'Показать еще' : 'Скрыть'}
                onClick={() => {
                    if (loadedItemsCount !== userData.favoriteItems.length)
                        setLoadedItemsCount(prev => prev + 4 <= userData.favoriteItems.length - 4 ? prev + 4 : userData.favoriteItems.length)
                    else
                        setLoadedItemsCount(4)
                }}
            />}
        </div >
    )
}
