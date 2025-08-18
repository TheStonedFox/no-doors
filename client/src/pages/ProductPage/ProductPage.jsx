import { useEffect, useRef, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import styles from './ProductPage.module.css'

import ItemsList from '@components/ItemsList/ItemsList'
import Spinner from '@components/Spinner/Spinner'
import ProductCard from '@components/ProductCard/ProductCard'
import Field from '@components/Field/Field'
import Counter from '@components/Counter/Counter'
import FavoriteButton from '@components/FavoriteButton/FavoriteButton'
import Slide from './Slide'

import { getProduct, getProducts } from '@api/api'
import getPrice from '@utils/getPrice'
import useProductActions from '@hooks/useProductActions'

import { GrFormNext } from "react-icons/gr"
import { GrFormPrevious } from "react-icons/gr"

import { BsCartPlusFill } from "react-icons/bs"
import { BsCartCheck } from "react-icons/bs"
import useScrollUpButton from '../../hooks/useScrollUpButton'


export default function ProductPage() {
    const dispatch = useDispatch()
    const negative = useNavigate()
    const { id } = useParams()
    const userData = useSelector((state => state.user.userData))



    const [isScrolled, setIsScrolled] = useState(false)
    const scrollUp = useScrollUpButton({ offset: isScrolled ? 85 : 15 })


    const swiperRef = useRef(null)
    const [favoriteItemAction, cartItemAction] = useProductActions()

    //#region useStates
    const [loadingStatus, setLadingStatus] = useState(true)
    const [products, setProducts] = useState([])
    const [product, setProduct] = useState()
    const [quantity, setQuantity] = useState(0)
    const [date, setDate] = useState()
    const [actionsPanelVisible, setActionsPanelVisible] = useState(false)
    const [inCart, setInCart] = useState(false)
    const [inFavorite, setInFavorite] = useState(false)
    const [zoomProperties, setZoomProperties] = useState({
        imageSize: { height: 0, width: 0 },
        shiftsValues: { top: 0, left: 0 },
        visible: false,
        fullScreenMode: false
    })
    //#endregion

    //#region useEffects

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

        onSlideChange(0)
    }, [dispatch, id, userData])

    useEffect(() => window.scrollTo({ top: 0, behavior: 'smooth' }), [id])

    useEffect(() => {
        window.addEventListener('scroll', scrollHandler)

        return () => removeEventListener('scroll', scrollHandler)
    }, [dispatch])

    useEffect(() => {
        // setProduct(products?.find(product => product?._id === id))
        setDate(new Date(product?.createdAt))
        setInFavorite(userData?.favoriteItems.includes(id))
        setInCart(userData?.cartItems?.map(item => item?.productId).includes(id))
    }, [products, id, product, userData])

    useEffect(() => {
        swiperRef.current?.slides.forEach(slide => {
            slide.querySelector('div').style.height = zoomProperties.fullScreenMode ? '100vh' : ''
        })
    }, [zoomProperties.fullScreenMode])
    //#endregion

    const { inStock, discount, title, model, price, wholesalePrice } = product || {}

    //#region handlers
    const scrollHandler = () => {
        const isScrollEnd = (window.scrollY > 300) &&
            (window.scrollY + window.innerHeight < document.documentElement.scrollHeight)

        setIsScrolled(isScrollEnd)

        // document.getElementById('#up-button').style = `${isScrolled ? 'bottom: 85px; opacity: 1' : 'bottom: 15px;'}`
        scrollUp
        setActionsPanelVisible(isScrollEnd)
    }

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

    const onSlideZoom = (e) => {
        setZoomProperties({ imageSize: e.imageSize, shiftsValues: e.shiftsValues, visible: e.visible, fullScreenMode: e.fullScreenMode })
    }

    const onSlideChange = (slideIndex) => {
        if (swiperRef.current) {
            swiperRef.current.slideTo(slideIndex, 400)
        }

        document.querySelector('#photos-list').querySelectorAll('div').forEach((photo, index) => {
            photo.setAttribute('style', 'border: solid 1px transparent; background-color: 0')
            if (index === slideIndex)
                photo.setAttribute('style', 'border: solid 1px var(--ui---main); background-color: var( --ui---bg-main-darker)')
        })
    }
    //#endregion

    const images = [
        '/images/categories/03.png',
        '/images/categories/03.png',
        '/images/categories/03.png',
        '/images/categories/03.png',
        '/images/categories/03.png',
    ]

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
                        className={styles['product-card__slider']}
                        onSwiper={(swiper) => swiperRef.current = swiper}
                        onSlideChange={(swiper) => onSlideChange(swiper.realIndex)}
                        spaceBetween={50}
                        slidesPerView={1}
                        pagination={{ clickable: true, el: `.${styles.pagination}` }}
                        style={zoomProperties.fullScreenMode ? {
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            maxWidth: '100vw',
                            zIndex: 1000
                        } : {}}>

                        {images && images.map((image, i) => <SwiperSlide key={i} className={`${styles['product-card__slide']}`} >
                            <Slide image={image} onZoom={onSlideZoom} />
                        </SwiperSlide>)}

                        <button className={`swiper-button-prev ${styles['swiper__prev-button']} ${styles['swiper__button']}`} onClick={() => swiperRef.current.slidePrev()}>
                            <GrFormPrevious />
                        </button>
                        <button className={`swiper-button-next ${styles['swiper__next-button']} ${styles['swiper__button']}`} onClick={() => swiperRef.current.slideNext()}>
                            <GrFormNext />
                        </button>
                    </Swiper>

                    <div className={styles['product-info__photos-list']} id='photos-list'>
                        {images && images.map((image, i) =>
                            <div key={i} className={styles['product-info__photos-item']} onClick={() => onSlideChange(i)}>
                                <img src={image} alt="product image" />
                            </div>)}
                    </div>
                    {zoomProperties.visible ? <section className={styles['product-page__zoom-image']}>
                        <img src={images[0]} alt="slider image"
                            style={{ transform: `translate(-${zoomProperties?.shiftsValues?.left}px, -${zoomProperties?.shiftsValues?.top}px)`, width: zoomProperties.imageSize.width }} />
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

                    {inStock ? <Counter onCounterChange={(value) => setQuantity(value)} /> : null}
                    <section className={styles['info__controls']}>

                        {inStock ? <button
                            className={styles['controls__add-to-cart-icon-button']}
                            onClick={onAddToCartButtonClick}>
                            {inCart ? <BsCartCheck /> : <BsCartPlusFill />}
                            <p>{inCart ? 'В корзине' : 'Добавить в корзину'}</p>
                        </button> : null}

                        <FavoriteButton
                            className={styles['controls__add-to-favorite-button']}
                            isInFavorite={inFavorite}
                            onClick={onAddToFavoriteButtonClick} />
                    </section>
                </section>
            </section >

            <section className={styles['product-page__comments']}>
                <h2 className='section-title'>Отзывы к товару</h2>
            </section>

            <section className={styles['product-page__popular-products']}>
                <h2 className='section-title'>Популярные товары</h2>
                {!loadingStatus ? <ItemsList>
                    {products?.map((product, index) => index < 4 && < ProductCard productData={product} key={product._id} />)}
                </ItemsList> : <Spinner />}
            </section>
            <section className={styles['product-page__actions-panel']}
                style={actionsPanelVisible ?
                    { transform: 'translateY(0%)', transition: '0.2s' } :
                    { transform: 'translateY(100%)', transition: '0.2s', boxShadow: 'none' }}>

                <section className={styles['actions-panel__left-box']}>
                    <img src={images[0]} alt="product-image" className={styles['actions-panel__image']} />
                    <h3 className={styles['actions-panel__title']} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>{title}</h3>
                </section>
                <section className={styles['actions-panel__right-box']}>
                    <p className={styles['actions-panel__price']}>{getPrice(discount, price)} ₴</p>
                    {inStock ? <button className={styles['controls__add-to-cart-icon-button']} onClick={onAddToCartButtonClick}>
                        {inCart ? <BsCartCheck /> : <BsCartPlusFill />}
                    </button> : null}

                    <FavoriteButton className={styles['controls__add-to-favorite-button']}
                        isInFavorite={inFavorite}
                        onClick={onAddToFavoriteButtonClick} />
                </section>
            </section>
        </div >
    )
}
