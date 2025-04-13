import React, { useEffect, useReducer, useState } from 'react'
import Slider from '../../components/Slider/Slider'
import styles from './MainPage.module.css'

import { Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css/bundle'

import ChooseCard from '../../components/ChooseCard/ChooseCard'
import ItemsList from '../../components/ItemsList/ItemsList'
import ProductCard from '../../components/ProductCard/ProductCard'
import Advantages from '../../components/Advantages/Advantages'
import Gallery from '../../components/Gallery/gallery'
import Button from '../../components/Button/Button'
import Spinner from '../../components/Spinner/Spinner'

import { setUserData } from '../../features/userSlice'
import { getProducts } from '../../api/api';

export default function MainPage() {
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
        <div className={styles['main-page']}>
            <section className={styles['main-page__intro-section']}>
                <Swiper
                    modules={[Pagination]}
                    className={styles['intro-section__slider']}
                    spaceBetween={50}
                    slidesPerView={1}
                    loop={true}
                    pagination={{ clickable: true, el: `.${styles.pagination}` }}>
                    <SwiperSlide className={styles.slide}>
                        <h2>Защитное стекло на
                            iPhone 11 Pro
                            по лучшей цене!</h2>
                        <Button className={styles['slide__button']} title='Подробнее' />
                        <img src="../../../public/images/intro-slider/01.png" alt="slider image" />
                    </SwiperSlide>
                    <SwiperSlide className={styles.slide}>
                        <h2>Защитное стекло на
                            iPhone 11 Pro
                            по лучшей цене!</h2>
                        <Button className={styles['slide__button']} title='Подробнее' />
                        <img src="../../../public/images/intro-slider/01.png" alt="slider image" />
                    </SwiperSlide>
                    <SwiperSlide className={styles.slide}>
                        <h2>Защитное стекло на
                            iPhone 11 Pro
                            по лучшей цене!</h2>
                        <Button className={styles['slide__button']} title='Подробнее' />
                        <img src="../../../public/images/intro-slider/01.png" alt="slider image" />
                    </SwiperSlide>

                    <div className={styles.pagination}></div>
                </Swiper>
                <div className={styles['into-section__products']}>
                    <div className={styles['into-section__product']}>
                        <h2>Silicone Case
                            для iPhone Xr</h2>
                        <Button className={styles['product__more-button']} title='Подробнее'>
                            <p>Подробнее</p>
                            <svg width="25" height="12" viewBox="0 0 25 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M24.5303 6.53033C24.8232 6.23744 24.8232 5.76256 24.5303 5.46967L19.7574 0.696699C19.4645 0.403806 18.9896 0.403806 18.6967 0.696699C18.4038 0.989593 18.4038 1.46447 18.6967 1.75736L22.9393 6L18.6967 10.2426C18.4038 10.5355 18.4038 11.0104 18.6967 11.3033C18.9896 11.5962 19.4645 11.5962 19.7574 11.3033L24.5303 6.53033ZM0 6.75H24V5.25H0V6.75Z" fill="#399A3A" />
                            </svg>
                        </Button>
                        <img src="../../../public/images/intro-slider/02.png" alt="product image" />
                    </div>

                    <div className={styles['into-section__product']}>
                        <h2>Silicone Case
                            для iPhone Xr</h2>
                        <Button className={styles['product__more-button']} title='Подробнее'>
                            <p>Подробнее</p>
                            <svg width="25" height="12" viewBox="0 0 25 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M24.5303 6.53033C24.8232 6.23744 24.8232 5.76256 24.5303 5.46967L19.7574 0.696699C19.4645 0.403806 18.9896 0.403806 18.6967 0.696699C18.4038 0.989593 18.4038 1.46447 18.6967 1.75736L22.9393 6L18.6967 10.2426C18.4038 10.5355 18.4038 11.0104 18.6967 11.3033C18.9896 11.5962 19.4645 11.5962 19.7574 11.3033L24.5303 6.53033ZM0 6.75H24V5.25H0V6.75Z" fill="#399A3A" />
                            </svg>
                        </Button>
                        <img src="../../../public/images/intro-slider/03.png" alt="product image" />
                    </div>
                </div>
            </section>
            <section className={styles['main-page__find-item-section']}>
                <h2 className='section-title'>Выберите бренд</h2>
                <ItemsList className={styles['find-item__categories']}>
                    <ChooseCard title='Apple' picture={'../../../public/images/brands/01.png'} />
                    <ChooseCard title='Huawei' picture={'../../../public/images/brands/02.png'} />
                    <ChooseCard title='Xiaomi' picture={'../../../public/images/brands/03.png'} />
                    <ChooseCard title='Samsung' picture={'../../../public/images/brands/04.png'} />
                </ItemsList>
            </section >
            <section className={styles['main-page__popular-products-section']}>
                <h2 className='section-title'>Популярные товары</h2>
                {!loadingStatus ? <ItemsList>
                    {products?.map((product, index) => index < 20 && < ProductCard productData={product} key={product._id} />)}
                </ItemsList> : <Spinner />}
            </section>
            <section className={styles['main-page__advantages-section']}>
                <Advantages />
            </section>
            <section className={styles['main-page__about-section']}>
                <h2>No Doors Technology - продажа аксессуаров и запчастей для мобильных телефонов оптом</h2>
                <p>Товарищи! постоянное информационно-пропагандистское обеспечение нашей деятельности представляет собой интересный эксперимент проверки существенных финансовых и административных условий. С другой стороны укрепление и развитие структуры требуют от нас анализа новых предложений. Таким образом рамки и место обучения кадров позволяет оценить значение системы обучения кадров, соответствует насущным потребностям. </p>
                <p>Товарищи! дальнейшее развитие различных форм деятельности играет важную роль в формировании системы обучения кадров, соответствует насущным потребностям. Задача организации, в особенности же постоянный количественный рост и сфера нашей активности влечет за собой процесс внедрения и модернизации позиций, занимаемых участниками в отношении поставленных задач. Задача организации, в особенности же начало повседневной работы по формированию позиции в значительной степени обуславливает создание дальнейших направлений.</p>
            </section>
            <section className={styles['main-page__gallery-section']}>
                <Gallery />
            </section>
        </div>
    )
}
