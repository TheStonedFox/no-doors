import { useEffect, useRef, useState } from 'react'
import styles from './MainPage.module.css'
import 'swiper/css/bundle'

import { Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useDispatch, useSelector } from 'react-redux'


import ChooseCard from '@components/ChooseCard/ChooseCard'
import ItemsList from '@components/ItemsList/ItemsList'
import ProductCard from '@components/ProductCard/ProductCard'
import Advantages from '@components/Advantages/Advantages'
import Gallery from '@components/Gallery/Gallery'
import Button from '@components/Button/Button'



import { categoryImages } from '@utils/categoryImages'
import { brandsImages } from '@utils/brandsImages'
import { useNavigate, useSearchParams } from 'react-router-dom'

import deviceTypesEnTitles from '@utils/deviceTypeEnTitle'
import PopularProductsList from '../../components/PopularProductsList/PopularProductsList'
import EmptyPlaceholder from '../../components/EmptyPlaceholder/EmptyPlaceholder'
import { getChooseValues } from '../../redux/features/sharedSlice'


export default function MainPage() {
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [choosesStep, setChoosesStep] = useState('brand')
    const [choosesValues, setChoosesValues] = useState({ brand: null, model: null, category: null })
    const [chooseOptions, setChooseOptions] = useState({ brands: null, categories: null })
    const [filterValue, setFilterValue] = useState('phones')

    const { brands, categories, error: chooseValuesError, isLoading: chooseValuesIsLoading } = useSelector(state => state.shared.chooseValues)

    useEffect(() => {
        document.querySelector('title').innerHTML = 'No Doors'
        if (chooseValuesError)
            return alert(chooseValuesError)
    }, [])

    useEffect(() => { !chooseValuesIsLoading && setChooseOptions({ brands, categories }) }, [chooseValuesIsLoading])

    useEffect(() => {
        choosesValues.category && navigate(`/search?brand=${choosesValues.brand}&model=${choosesValues.model}&category=${choosesValues.category}&deviceType=${deviceTypesEnTitles[filterValue]}`)
    }, [choosesValues.category, navigate, choosesValues, filterValue])

    const paginationRef = useRef(null)
    const swiperRef = useRef(null)

    const onChooseCardClick = (value) => {
        if (choosesStep === 'brand') {
            setChoosesValues(prev => ({ ...prev, brand: value }))
            setChoosesStep('model')
        }

        if (choosesStep === 'model') {
            setChoosesValues(prev => ({ ...prev, model: value }))
            setChoosesStep('category')
        }

        if (choosesStep === 'category') {
            setChoosesStep('result')
            setChoosesValues(prev => ({ ...prev, category: value }))
        }
    }



    return (
        <div className={`${styles['main-page']} container`} >
            {choosesStep !== 'result' && <section className={styles['main-page__intro-section']}>
                <Swiper
                    modules={[Pagination]}
                    className={styles['intro-section__slider']}
                    spaceBetween={50}
                    slidesPerView={1}
                    autoplay={{ delay: 1000 }}
                    loop={true}
                    onSwiper={(swiper) => swiperRef.current = swiper}
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
            </section>}

            <section className={styles['main-page__find-item-section']}>
                <section className={styles['find-item__header']}>
                    <h2 className='section-title'>{choosesStep === 'brand' ? 'Выберите бренд' : choosesStep === 'model' ? 'Выберите модель' : choosesStep === 'category' ? 'Выберите категорию' : `${choosesValues.category} для ${choosesValues.model}`}</h2>
                    {choosesStep === 'category' && <div className={styles['find-item__header-path']}>
                        <p onClick={() => setChoosesStep('brand')}>Главная</p>
                        /
                        <p onClick={() => setChoosesStep('model')}>{choosesValues.brand}</p>
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

                {!chooseValuesError ? <ItemsList className={styles['find-item__categories']}>
                    {choosesStep === 'brand' && chooseOptions.brands?.map(brand =>
                        <ChooseCard title={brand.title} key={brand.title}
                            picture={`/images/brands/${brandsImages[brand.title]}`}
                            onClick={() => onChooseCardClick(brand.title)} />)}

                    {choosesStep === 'model' && chooseOptions.brands?.find(brand => brand.title === choosesValues.brand)[filterValue].map(model => <ChooseCard key={model.title} title={model.title}
                        picture='https://placehold.co/165x165/transparent/black/png'
                        onClick={() => onChooseCardClick(model.title)} />)}

                    {choosesStep === 'category' && chooseOptions.categories.map(category =>
                        <ChooseCard title={category} key={category} picture={`/images/categories/${categoryImages[category]}`} onClick={() => onChooseCardClick(category)} />)}

                </ItemsList> : <EmptyPlaceholder
                    title='Не удалось получить данные.'
                    actionTitle='Попробовать еще раз.'
                    action={() => dispatch(getChooseValues())} />}
            </section >
            {choosesStep !== 'result' && <PopularProductsList />}

            <Advantages />
            <section className={styles['main-page__about-section']}>
                <h2>No Doors Technology - продажа аксессуаров и запчастей для мобильных телефонов оптом</h2>
                <p>Товарищи! постоянное информационно-пропагандистское обеспечение нашей деятельности представляет собой интересный эксперимент проверки существенных финансовых и административных условий. С другой стороны укрепление и развитие структуры требуют от нас анализа новых предложений. Таким образом рамки и место обучения кадров позволяет оценить значение системы обучения кадров, соответствует насущным потребностям. </p>
                <p>Товарищи! дальнейшее развитие различных форм деятельности играет важную роль в формировании системы обучения кадров, соответствует насущным потребностям. Задача организации, в особенности же постоянный количественный рост и сфера нашей активности влечет за собой процесс внедрения и модернизации позиций, занимаемых участниками в отношении поставленных задач. Задача организации, в особенности же начало повседневной работы по формированию позиции в значительной степени обуславливает создание дальнейших направлений.</p>
            </section>
            <Gallery />
        </div >
    )
}
