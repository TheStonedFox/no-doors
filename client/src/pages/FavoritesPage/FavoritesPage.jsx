import React, { useState, useEffect } from 'react'
import ItemsList from '../../components/ItemsList/ItemsList'
import { useSelector } from 'react-redux'

import ProductCard from '../../components/ProductCard/ProductCard'
import Button from '../../components/Button/Button'

import styles from './FavoritesPage.module.css'
import Spinner from '../../components/Spinner/Spinner'

export default function FavoritesPage() {
    const userData = useSelector((state) => state.user.userData)
    const [products, setProducts] = useState([])
    const [loadedItemsCount, setLoadedItemsCount] = useState(4)
    const [loadingStatus, setLadingStatus] = useState(true)
    useEffect(() => {
        fetch('http://192.168.1.105:3001/products')
            .then(res => res.json())
            .then(json => {
                setProducts(json)
                setLadingStatus(false)
            }).catch(error => {
                setLadingStatus(false)
                console.log(error)
            })
    }, [])


    return (
        <div className={styles['favorites-page']}>
            <h2 className={`${'section-title'} ${styles['favorites-page__title']}`}>Избранное</h2>
            {!userData?.favoriteItems && <div>Загруpка...</div>}
            {userData?.favoriteItems.length === 0 && <div>Ваш список избранного пока пуст.</div>}
            {!loadingStatus ? <ItemsList className={styles['favorites-page__items-list']}>
                {
                    products?.filter(product => userData.favoriteItems.includes(product._id))
                        .filter((favoriteItem, index) => index < loadedItemsCount + 4 && favoriteItem)
                        .map(favoriteItem => <ProductCard productData={favoriteItem} key={favoriteItem._id} />)
                }
            </ItemsList> : <Spinner />}
            {userData?.favoriteItems.length > 8 && <Button
                className={styles['favorites-page__more-button']}
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
