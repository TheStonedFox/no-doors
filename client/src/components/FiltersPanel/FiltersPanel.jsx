import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import styles from './FiltersPanel.module.css'

import deviceTypesEnTitles from '../../utils/deviceTypeEnTitle'
import { getStepChoices, searchProducts } from '../../api/api'


import { FaSortAmountDown } from "react-icons/fa"
import { FaSortAmountUp } from "react-icons/fa"
import MoreArrowIcon from '../../svgIcons/MoreArrowIcon'

import Checkbox from '../Checkbox/Checkbox'
import CustomRangeSelector from '../CustomRangeSelector/CustomRangeSelector'
import Spinner from '../Spinner/Spinner'
import Button from '../Button/Button'
import { useDispatch, useSelector } from 'react-redux'
import { toggleFiltersPanel } from '../../features/uiSlice'

export default function FiltersPanel({ isOpen }) {

    const [searchParams, setSearchParams] = useSearchParams()

    const params = {
        brands: searchParams.getAll('brand'),
        deviceTypes: searchParams.getAll('deviceType'),
        models: searchParams.getAll('model'),
        categories: searchParams.getAll('category')
    }

    const [isSortListOpen, setIsSortListOpen] = useState(false)
    const [sortType, setSortType] = useState('decreasingPrice')
    const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 })

    const isFiltersPanelOpen = useSelector(state => state.ui.isFiltersPanelOpen)
    const dispatch = useDispatch()

    const sortTitles = {
        decreasingPrice: 'по цене (по убыв.)',
        increasingPrice: 'по цене (по возраст.)',
        decreasingDate: 'по дате (от новых)',
        increasingDate: 'по дате (от старых)',
        decreasingBrand: 'по бренду (а-я)',
        increasingBrand: 'по бренду (я-а)',
        decreasingDiscount: 'по скидке',
        increasingDiscount: 'по скидке',
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
        !searchParams.get('sortType') && searchParams.set('sortType', 'decreasingPrice')
        setSortType(searchParams.get('sortType'))

        isFiltersError && alert(isFiltersError)
    }, [])
    return (
        <section className={`${styles['filters-panel']} ${isFiltersPanelOpen ? styles['open'] : null}`}>
            {!isFiltersLoading ? <section className={styles['filter']}>
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
                        {sortType === 'increasingDate' ? <FaSortAmountUp color='var(--ui---bg-main)' /> : null}
                        {sortType === 'decreasingDate' ? <FaSortAmountDown color='var(--ui---bg-main)' /> : null}
                    </div>
                    <div className={styles['sort__option']}
                        onClick={() => setSortType(sortType === 'decreasingPrice' ? 'increasingPrice' : 'decreasingPrice')}
                        style={['decreasingPrice', 'increasingPrice'].includes(sortType) ?
                            { backgroundColor: 'var(--ui---main)', color: 'var(--ui---bg-main)' } : {}}>
                        <p>По цене</p>
                        {sortType === 'increasingPrice' ? <FaSortAmountUp color='var(--ui---bg-main)' /> : null}
                        {sortType === 'decreasingPrice' ? <FaSortAmountDown color='var(--ui---bg-main)' /> : null}
                    </div>
                    <div className={styles['sort__option']}
                        onClick={() => setSortType(sortType === 'decreasingBrand' ? 'increasingBrand' : 'decreasingBrand')}
                        style={['decreasingBrand', 'increasingBrand'].includes(sortType) ?
                            { backgroundColor: 'var(--ui---main)', color: 'var(--ui---bg-main)' } : {}}>
                        <p>По бренду</p>
                        {sortType === 'increasingBrand' ? <FaSortAmountUp color='var(--ui---bg-main)' /> : null}
                        {sortType === 'decreasingBrand' ? <FaSortAmountDown color='var(--ui---bg-main)' /> : null}
                    </div>
                    <div className={styles['sort__option']}>
                        <p>По модели</p>
                        {sortType === 'increasingModel' ? <FaSortAmountUp color='var(--ui---bg-main)' /> : null}
                        {sortType === 'decreasingModel' ? <FaSortAmountDown color='var(--ui---bg-main)' /> : null}
                    </div>
                    <div className={styles['sort__option']}
                        onClick={() => setSortType(sortType === 'decreasingDiscount' ? 'increasingDiscount' : 'decreasingDiscount')}
                        style={['decreasingDiscount', 'increasingDiscount'].includes(sortType) ?
                            { backgroundColor: 'var(--ui---main)', color: 'var(--ui---bg-main)' } : {}}>
                        <p>По Скидке</p>
                        {sortType === 'increasingDiscount' ? <FaSortAmountUp color='var(--ui---bg-main)' /> : null}
                        {sortType === 'decreasingDiscount' ? <FaSortAmountDown color='var(--ui---bg-main)' /> : null}
                    </div>
                </div>
            </section> : null}

            {!isFiltersLoading ? <section className={styles['filter']}>
                <h3 className={styles['filter__title']}>Бренд</h3>
                <div className={styles['filter__options']}>
                    {brands?.map(brand => <Checkbox
                        key={brand.title}
                        title={brand.title}
                        isChecked={params.brands.includes(brand.title)}
                        onClick={() => onCheckBoxClick(brand, 'brand')} />)}
                </div>
            </section> : null}

            {!isFiltersLoading && params.brands.length ? <section className={styles['filter']}>
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
            </section> : null}

            {params.brands.length && !isFiltersLoading ? <section className={styles['filter']}>
                <h3 className={styles['filter__title']}>Модель</h3>
                <div className={styles['filter__options']}>
                    {brands?.map(brand => params.brands.includes(brand.title)
                        && Object.entries(brand).map(([key]) => key !== 'title' && (params.deviceTypes.length ? params.deviceTypes.includes(deviceTypesEnTitles[key]) : true) && brand[key]?.map(model => <Checkbox
                            title={model.title}
                            key={model.title}
                            isChecked={params.models.includes(model.title)}
                            onClick={() => onCheckBoxClick(model, 'model')} />)))}
                </div>
            </section> : null}


            {!isFiltersLoading ? <section className={styles['filter']}>
                <h3 className={styles['filter__title']}>Категория</h3>
                <div className={styles['filter__options']}>
                    {categories?.map(category => <Checkbox
                        key={category} title={category}
                        isChecked={params.categories.includes(category)}
                        onClick={() => onCheckBoxClick(category, 'category')} />)}
                </div>
            </section> : null}

            {!isFiltersLoading ? <section className={`${styles['filter']} ${styles['filter__price']}`}>
                <h3 className={styles['filter__title']}>Цена</h3>
                <CustomRangeSelector
                    initialMax={Number(searchParams.get('maxPrice')) || priceRange.max}
                    initialMin={Number(searchParams.get('minPrice')) || priceRange.min}
                    onValuesChange={(range) => setPriceRange({ min: range.minValue, max: range.maxValue })} />
            </section> : null}
            {!isFiltersLoading ? <Button className={styles['filters-panel__close-button']} title='Закрыть'
                onClick={() => dispatch(toggleFiltersPanel())} /> : null}

            {isFiltersLoading ? <Spinner /> : null}
        </section>
    )
}
