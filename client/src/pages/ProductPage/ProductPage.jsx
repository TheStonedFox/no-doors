


import React, { useEffect, useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import styles from './ProductPage.module.css'

import ItemsList from '@components/ItemsList/ItemsList'
import Spinner from '@components/Spinner/Spinner'
import ProductCard from '@components/ProductCard/ProductCard'
import Field from '@components/Field/Field'
import Counter from '@components/Counter/Counter'
import Button from '@components/Button/Button'
import FavoriteButton from '@components/FavoriteButton/FavoriteButton'

import { getProduct, getProducts } from '@api/api'
import getPrice from '@utils/getPrice'
import useProductActions from '@hooks/useProductActions'

export default function ProductPage() {
    const dispatch = useDispatch()
    const { id } = useParams()

    const [loadingStatus, setLadingStatus] = useState(true)
    const [products, setProducts] = useState([])
    const [product, setProduct] = useState()
    const [quantity, setQuantity] = useState(0)
    const [date, setDate] = useState()
    const [activeSlide, setActiveSlide] = useState()
    const [inCart, setInCart] = useState(false)
    const [inFavorite, setInFavorite] = useState(false)

    const userData = useSelector((state => state.user.userData))

    const swiperRef = useRef(null)
    const [favoriteItemAction, cartItemAction] = useProductActions()

    const goToSlide = (index) => {
        setActiveSlide(index)
        if (swiperRef.current) {
            swiperRef.current.slideTo(index, 400)
        }
    }

    const negative = useNavigate()

    useEffect(() => { document.querySelector('title').innerHTML = product?.title || 'No Doors' }, [product])

    useEffect(() => {
        getProduct(id).then(res => setProduct(res.product))
            .catch(error => {
                alert(error)
            }).finally(() => setLadingStatus(false))

        getProducts().then(res => setProducts(res.products))
            .catch(error => {
                alert(error)
            }).finally(() => setLadingStatus(false))

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
        // setProduct(products?.find(product => product?._id === id))
        setDate(new Date(product?.createdAt))
        setInFavorite(userData?.favoriteItems.includes(id))
        setInCart(userData?.cartItems?.map(item => item?.productId).includes(id))
    }, [products, id])

    const onAddToFavoriteButtonClick = () => {
        favoriteItemAction(id)
        setInFavorite(!inFavorite)
    }

    const onAddToCartButtonClick = () => {
        cartItemAction(id, quantity)
        setInCart(!inCart)
    }

    const onModelFieldClick = () => {
        negative(`/search?model=${model}`)
    }

    const { inStock, discount, title, model, price, wholesalePrice } = product || {}

    const [position, setPosition] = useState({ x: 0, y: 0 })

    const [previewAreaShifts, setPreviewAreaShifts] = useState({ top: 0, left: 0 })

    const [imageSize, setImageSize] = useState({ height: 0, width: 0 })

    const [visible, setVisible] = useState(false)

    const ZOOM_BOX_SIZE = 130

    const slideWrapperRef = useRef(null)

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect()

        let x = e.clientX - rect.left - ZOOM_BOX_SIZE / 2
        let y = e.clientY - rect.top - ZOOM_BOX_SIZE / 2

        x = Math.max(0, Math.min(x, rect.width - ZOOM_BOX_SIZE))
        y = Math.max(0, Math.min(y, rect.height - ZOOM_BOX_SIZE))

        setPreviewAreaShifts({ top: y, left: x })

        setPosition({ x, y })
    }
    const imgLink = 'https://content.rozetka.com.ua/goods/images/big/492481090.jpg'

    return (
        <div className={`${styles['product-page']} container`}>
            <section className={styles['product-page__product-card']}>
                <section className={styles['product-card__photos']}>
                    {inStock ? <div className={styles['product-card__tags']}>
                        {new Date().getUTCDate() - date?.getDate() <= 7 && <div className={`${styles['product-card__tag']} ${styles['product-card__new-tag']}`}>Новинка</div>}

                        {product?.discount !== 0 && <div className={`${styles['product-card__tag']} ${styles['product-card__discount-tag']}`}>{`Скидка ${product?.discount}%`}</div>}

                        <div className={`${styles['product-card__tag']} ${styles['product-card__popular-tag']}`}>Популярное</div>
                    </div> : null}
                    <Swiper
                        onSwiper={(swiper) => swiperRef.current = swiper}
                        onSlideChange={(swiper) => setActiveSlide(swiper.realIndex)}
                        className={styles['product-card__slider']}
                        spaceBetween={50}
                        slidesPerView={1}
                        pagination={{ clickable: true, el: `.${styles.pagination}` }}>

                        <SwiperSlide className={styles['product-card__slide']} >
                            <div className={styles['product-card__slide-wrapper']}
                                ref={slideWrapperRef}
                                onMouseEnter={() => setVisible(true)}
                                onMouseMove={handleMouseMove}
                                onMouseLeave={() => setVisible(false)}
                            >
                                <img src={imgLink} alt="slider image" onLoad={(e) =>
                                    setImageSize({ height: e.currentTarget.clientHeight, width: e.currentTarget.clientWidth })} />

                                {visible ? <div className={styles['product-card__zoom-area']}
                                    style={{ top: position.y, left: position.x, width: ZOOM_BOX_SIZE, height: ZOOM_BOX_SIZE, }}></div> : null}
                            </div>
                        </SwiperSlide>

                        <SwiperSlide className={styles['product-card__slide']} >
                            <div className={styles['product-card__slide-wrapper']}
                                ref={slideWrapperRef}
                                onMouseEnter={() => setVisible(true)}
                                onMouseMove={handleMouseMove}
                                onMouseLeave={() => setVisible(false)}
                            >
                                <img src={imgLink} alt="slider image" onLoad={(e) =>
                                    setImageSize({ height: e.currentTarget.clientHeight, width: e.currentTarget.clientWidth })} />

                                {visible ? <div className={styles['product-card__zoom-area']}
                                    style={{ top: position.y, left: position.x, width: ZOOM_BOX_SIZE, height: ZOOM_BOX_SIZE, }}></div> : null}
                            </div>
                        </SwiperSlide>

                        <SwiperSlide className={styles['product-card__slide']} >
                            <div className={styles['product-card__slide-wrapper']}
                                ref={slideWrapperRef}
                                onMouseEnter={() => setVisible(true)}
                                onMouseMove={handleMouseMove}
                                onMouseLeave={() => setVisible(false)}
                            >
                                <img src={imgLink} alt="slider image" onLoad={(e) =>
                                    setImageSize({ height: e.currentTarget.clientHeight, width: e.currentTarget.clientWidth })} />

                                {visible ? <div className={styles['product-card__zoom-area']}
                                    style={{ top: position.y, left: position.x, width: ZOOM_BOX_SIZE, height: ZOOM_BOX_SIZE, }}></div> : null}
                            </div>
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
                    {visible ? <section className={styles['product-page__zoom-image']}>
                        <img src={imgLink} alt="slider image"
                            style={{ transform: `translate(-${previewAreaShifts.left}px, -${previewAreaShifts.top}px)`, width: imageSize.width }} />
                    </section> : null}
                </section>
                <section className={styles['product-card__info']}>
                    <h2 className={styles['info__title']}>{title}</h2>
                    <section className={styles['info__sub-title']}>
                        <p className={styles['sub-title__article']}>Артикул: 854236896ABC</p> ·
                        {inStock ? <p className={styles['sub-title__in-stock']}>{`В наличии: ${inStock} шт.`}</p> :
                            <p className={styles['sub-title__in-stock_no-in-stock']}>{`Нет в наличии.`}</p>}
                    </section>
                    <section className={styles['info__fields']}>
                        <Field className={styles['info__field']} title='Тип:' value='Оригинал' />
                        <Field className={styles['info__field']} title='Совместимость:' value={model} onClick={onModelFieldClick} />
                        <Field className={styles['info__field']} title='Розница: ' value={`${getPrice(discount, price)} ₴`} />
                        <Field className={styles['info__field']} title='Оптом (от 5 шт.): ' value={`${getPrice(discount, wholesalePrice)} ₴`} />
                    </section>

                    <section className={styles['info__controls']}>
                        {inStock ? < Counter onCounterChange={(value) => setQuantity(value)} /> : null}
                        {inStock ? <Button className={styles['controls__add-to-cart-button']}
                            title={`${inCart ? 'В корзине' : 'Добавить в корзину'}`}
                            onClick={onAddToCartButtonClick}></Button> : null}

                        <FavoriteButton className={styles['controls__add-to-favorite-button']}
                            isInFavorite={inFavorite}
                            onClick={onAddToFavoriteButtonClick} />
                    </section>
                </section>
            </section >
            <section className={styles['product-page__popular-products']}>
                <h2 className='section-title'>Популярные товары</h2>
                {!loadingStatus ? <ItemsList>
                    {products?.map((product, index) => index < 4 && < ProductCard productData={product} key={product._id} />)}
                </ItemsList> : <Spinner />}
            </section>
        </div >
    )
}
