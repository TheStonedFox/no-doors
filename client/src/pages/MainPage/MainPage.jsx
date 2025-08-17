import { useEffect, useRef, useState } from 'react'
import styles from './MainPage.module.css'
import 'swiper/css/bundle'

import { Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useSelector } from 'react-redux'


import ChooseCard from '@components/ChooseCard/ChooseCard'
import ItemsList from '@components/ItemsList/ItemsList'
import ProductCard from '@components/ProductCard/ProductCard'
import Advantages from '@components/Advantages/Advantages'
import Gallery from '@components/Gallery/Gallery'
import Button from '@components/Button/Button'
import Spinner from '@components/Spinner/Spinner'

import useProducts from '@hooks/useProducts'

import { categoryImages } from '@utils/categoryImages'
import { brandsImages } from '@utils/brandsImages'
import { useNavigate } from 'react-router-dom'

import deviceTypesEnTitles from '@utils/deviceTypeEnTitle'


export default function MainPage() {
    const [loadedItemsCount, setLoadedItemsCount] = useState(4)
    // const [isLoading, setLoadingStatus] = useState(true)
    const negative = useNavigate()

    const [choosesStep, setChoosesStep] = useState('brand')
    const [choosesValues, setChoosesValues] = useState({ brand: null, model: null, category: null })
    const [chooseOptions, setChooseOptions] = useState({ brands: null, categories: null })
    const [filterValue, setFilterValue] = useState('phones')

    const [products, isLoading, error] = useProducts()

    const { brands, categories, error: chooseValuesError, isLoading: chooseValuesIsLoading } = useSelector(state => state.shared.chooseValues)

    useEffect(() => {
        document.querySelector('title').innerHTML = 'No Doors'
        if (chooseValuesError)
            return alert(chooseValuesError)
    }, [])

    useEffect(() => { !chooseValuesIsLoading && setChooseOptions({ brands, categories }) }, [chooseValuesIsLoading])

    useEffect(() => {
        choosesValues.category && negative(`/search?brand=${choosesValues.brand}&model=${choosesValues.model}&category=${choosesValues.category}&deviceType=${deviceTypesEnTitles[filterValue]}`)
    }, [choosesValues.category, negative, choosesValues, filterValue])

    const paginationRef = useRef(null)

    return (
        <div className={`${styles['main-page']} container`} onClick={() => console.log('asadsads')}>
            {choosesStep !== 'result' ? <section className={styles['main-page__intro-section']}>
                <Swiper
                    modules={[Pagination]}
                    className={styles['intro-section__slider']}
                    spaceBetween={50}
                    slidesPerView={1}
                    autoplay={{ delay: 1000 }}
                    loop={true}
                    pagination={{ clickable: true, el: paginationRef.current }}>
                    <SwiperSlide className={styles.slide}>
                        <h2>Защитное стекло на
                            iPhone 11 Pro
                            по лучшей цене!</h2>
                        <Button className={styles['slide__button']} title='Подробнее' />
                        <img src="/images/intro-slider/01.png" alt="slider image" />
                    </SwiperSlide>
                    <SwiperSlide className={styles.slide}>
                        <h2>Защитное стекло на
                            iPhone 11 Pro
                            по лучшей цене!</h2>
                        <Button className={styles['slide__button']} title='Подробнее' />
                        <img src="/images/intro-slider/01.png" alt="slider image" />
                    </SwiperSlide>
                    <SwiperSlide className={styles.slide}>
                        <h2>Защитное стекло на
                            iPhone 11 Pro
                            по лучшей цене!</h2>
                        <Button className={styles['slide__button']} title='Подробнее' />
                        <img src="/images/intro-slider/01.png" alt="slider image" />
                    </SwiperSlide>

                    <div className={styles.pagination} ref={paginationRef}></div>
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
                        <img src="/images/intro-slider/02.png" alt="product image" />
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
                        <img src="/images/intro-slider/03.png" alt="product image" />
                    </div>
                </div>
            </section> : null}

            <section className={styles['main-page__find-item-section']}>
                <section className={styles['find-item__header']}>
                    <h2 className='section-title'>{choosesStep === 'brand' ? 'Выберите бренд' : choosesStep === 'model' ? 'Выберите модель' : choosesStep === 'category' ? 'Выберите категорию' : `${choosesValues.category} для ${choosesValues.model}`}</h2>
                    {choosesStep === 'category' && <div className={styles['find-item__header-path']}>
                        <p onClick={() => setChoosesStep('brand')}>Главная</p>
                        /
                        <p onClick={() => {
                            setChoosesStep('model')
                        }}>{choosesValues.brand}</p>
                        /
                        <p>{choosesValues.model}</p>
                    </div>}
                    {choosesStep === 'model' && <ul className={styles['find-item__header-filters']}>
                        <li className={`${styles['find-item__header-filter']} ${filterValue === 'phones' && styles['active']}`}
                            onClick={() => setFilterValue('phones')}>Смартфоны</li>

                        <li className={`${styles['find-item__header-filter']} ${filterValue === 'tablets' && styles['active']}`}
                            onClick={() => setFilterValue('tablets')}>Планшеты</li>

                        <li className={`${styles['find-item__header-filter']} ${filterValue === 'watches' && styles['active']}`}
                            onClick={() => setFilterValue('watches')}>Часы</li>
                    </ul>}
                </section>

                <ItemsList className={styles['find-item__categories']}>
                    {choosesStep === 'brand' && chooseOptions.brands?.map(brand => <ChooseCard title={brand.title} key={brand.title} picture={`/images/brands/${brandsImages[brand.title]}`} onClick={async () => {
                        setChoosesValues(prev => ({ ...prev, brand: brand.title }))
                        setChoosesStep('model')
                    }} />)}

                    {choosesStep === 'model' && chooseOptions.brands.find(brand => brand.title === choosesValues.brand)[filterValue].map(model => <ChooseCard key={model.title} title={model.title} picture='https://placehold.co/165x165/transparent/black/png' onClick={() => {
                        setChoosesValues(prev => ({ ...prev, model: model.title }))
                        setChoosesStep('category')
                    }} />)}

                    {choosesStep === 'category' && chooseOptions.categories.map(category => <ChooseCard title={category} key={category} picture={`/images/categories/${categoryImages[category]}`} onClick={() => {
                        setChoosesStep('result')
                        setChoosesValues(prev => ({ ...prev, category: category }))
                    }} />)}
                    {choosesStep === 'result' && products?.map((product, index) => index < loadedItemsCount && <ProductCard productData={product} key={product._id} />)}

                </ItemsList>
                {choosesStep === 'result' && products?.length > 8 && <Button
                    className={styles['find-item__more-button']}
                    title={loadedItemsCount !== products?.length ? 'Показать еще' : 'Показать меньше'}
                    onClick={() => {
                        if (loadedItemsCount !== products?.length)
                            setLoadedItemsCount(prev => prev + 4 <= products?.length - 4 ? prev + 4 : products?.length)
                        else
                            setLoadedItemsCount(4)
                    }}
                />}
            </section >
            {choosesStep !== 'result' && <section className={styles['main-page__popular-products-section']}>
                <h2 className='section-title'>Популярные товары</h2>
                {!isLoading ? <ItemsList>
                    {!error && products?.map((product, index) => index < 4 && < ProductCard productData={product} key={product._id} />)}
                </ItemsList> : <Spinner />}
                {error && !isLoading ? <h2>Не удалось загрузить товары!</h2> : null}
            </section>}
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
