import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'

import ItemsList from '../../components/ItemsList/ItemsList'
import Spinner from '../../components/Spinner/Spinner'
import ProductCard from '../../components/ProductCard/ProductCard'

import styles from './ProductPage.module.css'
import { useParams } from 'react-router-dom'
import { updateUserInfo } from '../../api/api'


export default function ProductPage() {
    const [loadingStatus, setLadingStatus] = useState(true)
    const [products, setProducts] = useState([])
    const [product, setProduct] = useState()

    const dispatch = useDispatch()

    const { id } = useParams()
    useEffect(() => {
        fetch('http://localhost:3001/products')
            .then(res => res.json())
            .then(json => {
                setProducts(json)
                setLadingStatus(false)
            }).catch(error => {
                setLadingStatus(false)
            })

        updateUserInfo({ productId: id })

    }, [dispatch])

    useEffect(() => setProduct(products?.find(product => product?._id === id)), [products, id])


    return (
        <div className={styles['product-page']}>
            <section className={styles['product-page__popular-products']}>
                <h2 className='section-title'>Популярные товары</h2>
                {!loadingStatus ? <ItemsList>
                    {products?.map((product, index) => index < 20 && < ProductCard productData={product} key={product._id} />)}
                </ItemsList> : <Spinner />}
            </section>
            <p>{`product ${product?.title}`}</p>
        </div>
    )
}
