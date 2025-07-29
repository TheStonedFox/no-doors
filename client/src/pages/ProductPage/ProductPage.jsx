


import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import ItemsList from '../../components/ItemsList/ItemsList'
import Spinner from '../../components/Spinner/Spinner'
import ProductCard from '../../components/ProductCard/ProductCard'
import Field from '../../components/Field/Field'
import Counter from '../../components/Counter/Counter'
import Button from '../../components/Button/Button'
import FavoriteIcon from '../../SvgIcons/FavoriteIcon'
import CartIcon from '../../components/Header/CartIcon'
import FavoriteButton from '../../components/FavoriteButton/FavoriteButton'

import { Swiper, SwiperSlide } from 'swiper/react'


import styles from './ProductPage.module.css'
import { useParams } from 'react-router-dom'
import { addFavoriteItem, removeFavoriteItem, updateUserInfo } from '../../api/api'
import getPrice from '../../utils/getPrice'
import { setUserData } from '../../features/userSlice'
import { togglePopup, updateFavoriteCounter } from '../../features/uiSlice'


export default function ProductPage() {
    const dispatch = useDispatch()
    const { id } = useParams()

    const [loadingStatus, setLadingStatus] = useState(true)
    const [products, setProducts] = useState([])
    const [product, setProduct] = useState()
    const [quantity, setQuantity] = useState(0)
    const [date, setDate] = useState()
    const [activeSlide, setActiveSlide] = useState()
    const [isInFavorite, setIsInFavorite] = useState(false)

    const userData = useSelector((state => state.user.userData))
    const tokenStatus = useSelector((state) => state.user.isTokenValid)

    const swiperRef = useRef(null)

    const goToSlide = (index) => {
        setActiveSlide(index)
        if (swiperRef.current) {
            swiperRef.current.slideTo(index, 400)
        }
    }

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
        setActiveSlide(0)
    }, [dispatch, id, userData])

    useEffect(() => {
        document.querySelector('#photos-list').querySelectorAll('div').forEach((photo, index) => {
            photo.setAttribute('style', 'border: solid 1px transparent')
            if (activeSlide === index)
                photo.setAttribute('style', 'border: solid 1px var(--ui---main)')
        })
    }, [activeSlide])

    useEffect(() => window.scrollTo({ top: 0, behavior: 'smooth' }), [id])

    useEffect(() => {
        setProduct(products?.find(product => product?._id === id))
        setDate(new Date(product?.createdAt))
        setIsInFavorite(userData?.favoriteItems.includes(id))
    }, [products, id])


    const onFavoriteButtonClick = async () => {
        setIsInFavorite(!isInFavorite)

        if (!userData.favoriteItems?.includes(id) && tokenStatus) {
            await addFavoriteItem(userData._id, id).then(() => {
                dispatch(setUserData())
                dispatch(updateFavoriteCounter(userData.favoriteItems?.length + 1))
                dispatch(togglePopup({ type: 'product-card', message: 'Товар добавлен в избранное!' }))
            })
        } else {
            await removeFavoriteItem(userData._id, id).then(() => {
                dispatch(setUserData())
                dispatch(updateFavoriteCounter(userData.favoriteItems?.length - 1))
                dispatch(togglePopup({ type: 'product-card', message: 'Товар удален из избранного!' }))
            })
        }
    }

    return (
        <div className={`${styles['product-page']} container`}>
            <section className={styles['product-page__product-card']}>
                <section className={styles['product-card__photos']}>
                    <div className={styles['product-card__tags']}>
                        {new Date().getUTCDate() - date?.getDate() <= 7 && <div className={`${styles['product-card__tag']} ${styles['product-card__new-tag']}`}>Новинка</div>}

                        {product?.discount !== 0 && <div className={`${styles['product-card__tag']} ${styles['product-card__discount-tag']}`}>{`Скидка ${product?.discount}%`}</div>}

                        <div className={`${styles['product-card__tag']} ${styles['product-card__popular-tag']}`}>Популярное</div>
                    </div>
                    <Swiper
                        onSwiper={(swiper) => swiperRef.current = swiper}
                        onSlideChange={(swiper) => setActiveSlide(swiper.realIndex)}
                        className={styles['product-card__slider']}
                        spaceBetween={50}
                        slidesPerView={1}
                        pagination={{ clickable: true, el: `.${styles.pagination}` }}>
                        <SwiperSlide className={styles['product-card__slide']}>
                            <img src="/images/product-slide.png" alt="slider image" />
                        </SwiperSlide>
                        <SwiperSlide className={styles['product-card__slide']}>
                            <img src="/images/product-slide.png" alt="slider image" />
                        </SwiperSlide>
                        <SwiperSlide className={styles['product-card__slide']}>
                            <img src="/images/product-slide.png" alt="slider image" />
                        </SwiperSlide>
                    </Swiper>
                    <div className={styles['product-info__photos-list']} id='photos-list'>
                        <div className={styles['product-info__photos-item']} onClick={() => goToSlide(0)}>
                            <img src="/images/product-slide.png" alt="product image" />
                        </div>
                        <div className={styles['product-info__photos-item']} onClick={() => goToSlide(1)}>
                            <img src="/images/product-slide.png" alt="product image" />
                        </div>
                        <div className={styles['product-info__photos-item']} onClick={() => goToSlide(2)}>
                            <img src="/images/product-slide.png" alt="product image" />
                        </div>
                    </div>
                </section>
                <section className={styles['product-card__info']}>
                    <h2 className={styles['info__title']}>{product?.title}</h2>
                    <section className={styles['info__sub-title']}>
                        <p className={styles['sub-title__article']}>Артикул: 854236896ABC</p> ·
                        <p className={styles['sub-title__in-stock']}>{`В наличии: ${product?.inStock} шт.`}</p>
                    </section>
                    <section className={styles['info__fields']}>
                        <Field className={styles['info__field']} title='Тип:' value='Оригинал' />
                        <Field className={styles['info__field']} title='Совместимость:' value={product?.model} />
                        <Field className={styles['info__field']} title='Розница: ' value={`${getPrice(product?.discount, product?.price)} ₴`} />
                        <Field className={styles['info__field']} title='Оптом (от 5 шт.): ' value={`${getPrice(product?.discount, product?.wholesalePrice)} ₴`} />
                    </section>


                    <section className={styles['info__controls']}>
                        <Counter onCounterChange={(value) => setQuantity(value)} />
                        <Button className={styles['controls__add-to-cart-button']} title='Добавить в корзину'></Button>

                        <FavoriteButton className={styles['controls__add-to-favorite-button']} isInFavorite={isInFavorite} onClick={onFavoriteButtonClick} />
                    </section>
                </section>

            </section >
            <section className={styles['product-page__popular-products']}>
                <h2 className='section-title'>Популярные товары</h2>
                {!loadingStatus ? <ItemsList>
                    {products?.map((product, index) => index < 20 && < ProductCard productData={product} key={product._id} />)}
                </ItemsList> : <Spinner />}
            </section>
        </div >
    )
}
