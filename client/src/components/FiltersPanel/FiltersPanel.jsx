import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import styles from './FiltersPanel.module.css'

import deviceTypesEnTitles from '@utils/deviceTypeEnTitle'

import { FaSortAmountDown } from "react-icons/fa"
import { FaSortAmountUp } from "react-icons/fa"
import MoreArrowIcon from '@/svg/MoreArrowIcon'

import Checkbox from '../Checkbox/Checkbox'
import CustomRangeSelector from '../CustomRangeSelector/CustomRangeSelector'
import Spinner from '../Spinner/Spinner'
import Button from '../Button/Button'
import { useDispatch, useSelector } from 'react-redux'
import { toggleFiltersPanel } from '../../redux/features/uiSlice'
import useSwipe from '../../hooks/useSwipe'
import { generateId } from '../../utils/generateId'

export default function FiltersPanel({ isOpen }) {

    const [searchParams, setSearchParams] = useSearchParams()

    const params = {
        brands: searchParams.getAll('brand'),
        deviceTypes: searchParams.getAll('deviceType'),
        models: searchParams.getAll('model'),
        categories: searchParams.getAll('category')
    }

    const panelRef = useRef(null)

    const [isSortListOpen, setIsSortListOpen] = useState(false)
    const [sortType, setSortType] = useState('decreasingPrice')
    const [priceRange, setPriceRange] = useState({ min: searchParams.get('minPrice'), max: searchParams.get('maxPrice') })
    const [disableSwipe, setDisableSwipe] = useState(false)
    const [viewportWidth, setViewportWidth] = useState(window.innerWidth)


    const isFiltersPanelOpen = useSelector(state => state.ui.isFiltersPanelOpen)
    const dispatch = useDispatch()

    const { handleTouchStart, handleTouchMove, handleTouchEnd } = useSwipe(
        isFiltersPanelOpen,
        panelRef,
        () => !disableSwipe && dispatch(toggleFiltersPanel(false))
    )


    const sortTitles = {
        decreasingPrice: 'по цене (по убыв.)',
        increasingPrice: 'по цене (по возраст.)',
        decreasingDate: 'по дате (от новых)',
        increasingDate: 'по дате (от старых)',
        decreasingBrand: 'по бренду (а-я)',
        increasingBrand: 'по бренду (я-а)',
        decreasingDiscount: 'по скидке',
        increasingDiscount: 'по скидке',
        increasingModel: 'по модели (я-а)',
        decreasingModel: 'по модели (а-я)',
    }

    const hideUncheckBrandModels = (brandTile, params) => {
        if (searchParams.getAll(`brand`).includes(brandTile))
            brands?.map(brand => brand.title === brandTile && brand.models?.map(m => params.delete('model', m.title)))
    }

    const onCheckBoxClick = (type, paramStr) => {
        const newParams = new URLSearchParams(searchParams)
        const checkParam = paramStr !== 'category' && paramStr !== 'deviceType'
        if (searchParams.getAll(`${paramStr}`).includes(checkParam ? type.title : type))
            newParams.delete(`${paramStr}`, checkParam ? type.title : type)
        else
            newParams.append(`${paramStr}`, checkParam ? type.title : type)

        paramStr === 'brand' && hideUncheckBrandModels(type.title, newParams)

        setSearchParams(newParams)
    }

    const { brands, categories, error: isFiltersError, isLoading: isFiltersLoading } = useSelector(state => state.shared.chooseValues)

    useEffect(() => {
        const newParams = new URLSearchParams(searchParams.toString())
        newParams.set('minPrice', priceRange.min)
        newParams.set('maxPrice', priceRange.max)

        setSearchParams(newParams)
    }, [priceRange])


    useEffect(() => {
        setIsSortListOpen(false)

        const newParams = new URLSearchParams(searchParams.toString())
        newParams.set('sortType', sortType)
        setSearchParams(newParams)
    }, [sortType])


    useEffect(() => {
        const scrollHandler = () => setIsSortListOpen(false)
        const link = panelRef.current
        link.addEventListener('scroll', scrollHandler)
        return () => link.removeEventListener('scroll', scrollHandler)
    }, [])


    useEffect(() => {
        !searchParams.get('sortType') && searchParams.set('sortType', 'decreasingPrice')
        setSortType(searchParams.get('sortType'))

        isFiltersError && alert(isFiltersError)

    }, [])

    useEffect(() => {
        const handleResize = () => setViewportWidth(window.innerWidth)
        window.addEventListener('resize', handleResize)

        return () => window.removeEventListener('resize', handleResize)
    }, [])



    return (
        <section
            className={`${styles['filters-panel']}`}
            ref={panelRef}
            style={viewportWidth <= 550 ? isFiltersPanelOpen ? { transform: `translateX(0px)` } :
                { transform: 'translate(-101%)', boxShadow: 'none' } : {}}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onTouchMove={handleTouchMove}>
            {!isFiltersLoading && <section className={styles['filter']}>
                <h3 className={styles['filter__title']}>Сортировка:</h3>
                <button className={styles['filters-panel__sort-dropdown']}
                    style={{ borderRadius: isSortListOpen ? '4px 4px 0 0' : '', transition: '0.2s' }}
                    onClick={() => setIsSortListOpen(!isSortListOpen)}>
                    <p>{sortTitles[sortType]}</p>
                    <MoreArrowIcon color='#ffff' style={{ transform: isSortListOpen ? 'rotateX(-180deg)' : '', transition: '0.2s' }} />
                </button>

                <div className={styles['filter__sort-options']} style={{ maxHeight: isSortListOpen ? '300px' : '0px', transition: '0.2s' }}>
                    <div className={styles['sort__option']}
                        onClick={() => setSortType(sortType === 'decreasingDate' ? 'increasingDate' : 'decreasingDate')}
                        style={['decreasingDate', 'increasingDate'].includes(sortType) ?
                            { backgroundColor: 'var(--ui---main)', color: 'var(--ui---bg-main)' } : {}}>
                        <p>Новинки</p>
                        {sortType === 'increasingDate' && <FaSortAmountUp color='var(--ui---bg-main)' />}
                        {sortType === 'decreasingDate' && <FaSortAmountDown color='var(--ui---bg-main)' />}
                    </div>
                    <div className={styles['sort__option']}
                        onClick={() => setSortType(sortType === 'decreasingPrice' ? 'increasingPrice' : 'decreasingPrice')}
                        style={['decreasingPrice', 'increasingPrice'].includes(sortType) ?
                            { backgroundColor: 'var(--ui---main)', color: 'var(--ui---bg-main)' } : {}}>
                        <p>По цене</p>
                        {sortType === 'increasingPrice' && <FaSortAmountUp color='var(--ui---bg-main)' />}
                        {sortType === 'decreasingPrice' && <FaSortAmountDown color='var(--ui---bg-main)' />}
                    </div>
                    <div className={styles['sort__option']}
                        onClick={() => setSortType(sortType === 'decreasingBrand' ? 'increasingBrand' : 'decreasingBrand')}
                        style={['decreasingBrand', 'increasingBrand'].includes(sortType) ?
                            { backgroundColor: 'var(--ui---main)', color: 'var(--ui---bg-main)' } : {}}>
                        <p>По бренду</p>
                        {sortType === 'increasingBrand' && <FaSortAmountUp color='var(--ui---bg-main)' />}
                        {sortType === 'decreasingBrand' && <FaSortAmountDown color='var(--ui---bg-main)' />}
                    </div>
                    <div className={styles['sort__option']}
                        onClick={() => setSortType(sortType === 'decreasingModel' ? 'increasingModel' : 'decreasingModel')}
                        style={['decreasingModel', 'increasingModel'].includes(sortType) ?
                            { backgroundColor: 'var(--ui---main)', color: 'var(--ui---bg-main)' } : {}}>
                        <p>По модели</p>
                        {sortType === 'increasingModel' && <FaSortAmountUp color='var(--ui---bg-main)' />}
                        {sortType === 'decreasingModel' && <FaSortAmountDown color='var(--ui---bg-main)' />}
                    </div>

                    <div className={styles['sort__option']}
                        onClick={() => setSortType(sortType === 'decreasingDiscount' ? 'increasingDiscount' : 'decreasingDiscount')}
                        style={['decreasingDiscount', 'increasingDiscount'].includes(sortType) ?
                            { backgroundColor: 'var(--ui---main)', color: 'var(--ui---bg-main)' } : {}}>
                        <p>По Скидке</p>
                        {sortType === 'increasingDiscount' && <FaSortAmountUp color='var(--ui---bg-main)' />}
                        {sortType === 'decreasingDiscount' && <FaSortAmountDown color='var(--ui---bg-main)' />}
                    </div>
                </div>
            </section>}

            {!isFiltersLoading && <section className={styles['filter']}>
                <h3 className={styles['filter__title']}>Бренд</h3>
                <div className={styles['filter__options']}>
                    {brands?.map((brand) => <Checkbox
                        key={brand.title}
                        title={brand.title}
                        isChecked={params.brands.includes(brand.title)}
                        onClick={() => onCheckBoxClick(brand, 'brand')} />)}
                </div>
            </section>}

            {!isFiltersLoading && Boolean(params.brands.length) && <section className={styles['filter']}>
                <h3 className={styles['filter__title']}>Тип устройства</h3>
                <div className={styles['filter__options']}>
                    <Checkbox
                        title='Телефоны'
                        isChecked={params.deviceTypes.includes('Телефоны')}
                        onClick={() => onCheckBoxClick('Телефоны', 'deviceType')} />
                    <Checkbox
                        title='Планшеты'
                        isChecked={params.deviceTypes.includes('Планшеты')}
                        onClick={() => onCheckBoxClick('Планшеты', 'deviceType')} />
                    <Checkbox
                        title='Часы'
                        isChecked={params.deviceTypes.includes('Часы')}
                        onClick={() => onCheckBoxClick('Часы', 'deviceType')} />
                </div>
            </section>}

            {Boolean(params.brands.length) && !isFiltersLoading && <section className={styles['filter']}>
                <h3 className={styles['filter__title']}>Модель</h3>
                <div className={styles['filter__options']}>
                    {brands?.map(brand => params.brands.includes(brand.title)
                        && Object.entries(brand).map(([key]) => key !== 'title' && (params.deviceTypes.length ? params.deviceTypes.includes(deviceTypesEnTitles[key]) : true) && brand[key]?.map(model => <Checkbox
                            title={model.title}
                            key={model.title}
                            isChecked={params.models.includes(model.title)}
                            onClick={() => onCheckBoxClick(model, 'model')} />)))}
                </div>
            </section>}


            {!isFiltersLoading && <section className={styles['filter']}>
                <h3 className={styles['filter__title']}>Категория</h3>
                <div className={styles['filter__options']}>
                    {categories?.map(category => <Checkbox
                        key={category} title={category}
                        isChecked={params.categories.includes(category)}
                        onClick={() => onCheckBoxClick(category, 'category')} />)}
                </div>
            </section>}

            {!isFiltersLoading && <section className={`${styles['filter']} ${styles['filter__price']}`}
                onTouchStart={() => setDisableSwipe(true)} onTouchEnd={() => setDisableSwipe(false)}>
                <h3 className={styles['filter__title']}>Цена</h3>
                <CustomRangeSelector
                    initialMax={Number(searchParams.get('maxPrice')) || 10000}
                    initialMin={Number(searchParams.get('minPrice')) || 0}
                    onValuesChange={(range) => setPriceRange({ min: range.minValue, max: range.maxValue })} />
            </section>}
            {!isFiltersLoading && <Button className={styles['filters-panel__close-button']} title='Закрыть'
                onClick={() => dispatch(toggleFiltersPanel())} />}

            {isFiltersLoading && <Spinner />}
        </section>
    )
}
