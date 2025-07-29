import React, { useCallback, useEffect, useRef, useState } from 'react'

import styles from './SearchPage.module.css'

import { useNavigate, useSearchParams } from 'react-router-dom'

import ItemsList from '../../components/ItemsList/ItemsList'
import useProducts from '../../hooks/useProducts'
import Spinner from '../../components/Spinner/Spinner'
import ProductCard from '../../components/ProductCard/ProductCard'
import FilterItem from './FilterItem/FilterItem'
import Checkbox from '../../components/Checkbox/Checkbox'
import Button from '../../components/Button/Button'
import CustomRangeSelector from '../../components/CustomRangeSelector/CustomRangeSelector'

import MoreArrowIcon from '../../svgIcons/MoreArrowIcon'
import getWordEnding from '../../utils/getWordEnding'

import { getStepChoices, searchProducts } from '../../api/api'

import { FaFilter } from "react-icons/fa"
import { FaSortAmountDown } from "react-icons/fa"
import { FaSortAmountUp } from "react-icons/fa"


export default function SearchPage() {
    // const [products, isLoading, error] = useProducts()

    const [searchParams, setSearchParams] = useSearchParams()

    const brands = searchParams.getAll('brand')
    const models = searchParams.getAll('model')
    const categories = searchParams.getAll('category')

    const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 })
    const [filterOptions, setFilterOptions] = useState({ brands: null, categories: null })
    const [isFiltersPanelOpen, setIsFiltersPanelOpen] = useState(false)
    const [isFiltersLoading, setIsFiltersLoading] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isSortListOpen, setIsSortListOpen] = useState(false)
    const [sortType, setSortType] = useState('decreasingPrice')

    const [productsList, setProductsList] = useState([])

    const appliedFiltersOrder = {
        minPrice: 1,
        maxPrice: 2,
        brand: 3,
        model: 4,
        category: 5
    }

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

    useEffect(() => {
        !searchParams.get('sortType') && searchParams.set('sortType', 'decreasingPrice')
        setSortType(searchParams.get('sortType'))
        getStepChoices()
            .then(res => {
                setIsFiltersLoading(true)
                setFilterOptions({ brands: res.options?.brands.map(brand => brand), categories: res.options.categories })
            })
            .catch(error => alert(error))
            .finally(() => setIsFiltersLoading(false))
    }, [])

    useEffect(() => {
        const newParams = new URLSearchParams(searchParams.toString())
        newParams.set('minPrice', priceRange.min)
        newParams.set('maxPrice', priceRange.max)

        setSearchParams(newParams)
    }, [priceRange])

    useEffect(() => {
        // console.log(searchParams.toString())
        searchProducts(`${searchParams.toString()}`)
            .then(res => setProductsList(res.products))
            .catch(error => {
                console.log(error)
                setProductsList([])
            })
            .finally(() => setIsLoading(false))
    }, [searchParams, sortType])

    useEffect(() => {
        setIsSortListOpen(false)

        const newParams = new URLSearchParams(searchParams.toString())
        newParams.set('sortType', sortType)
        setSearchParams(newParams)
    }, [sortType])

    const onCheckBoxClick = (type, paramStr) => {
        const newParams = new URLSearchParams(searchParams)
        if (searchParams.getAll(`${paramStr}`).includes(paramStr !== 'category' ? type.title : type))
            newParams.delete(`${paramStr}`, paramStr !== 'category' ? type.title : type)
        else
            newParams.append(`${paramStr}`, paramStr !== 'category' ? type.title : type)

        paramStr === 'brand' && hideUncheckBrandModels(type.title, newParams)

        setSearchParams(newParams)
    }

    const hideUncheckBrandModels = (brandTile, params) => {
        if (searchParams.getAll(`brand`).includes(brandTile))
            filterOptions.brands?.map(brand => brand.title === brandTile && brand.models?.map(m => params.delete('model', m.title)))
    }

    return (
        <div className={`${styles['search-page']} container`}>
            <h2 className={`section-title ${styles['search-page__title']}`}>{categories.length === 1 ? categories : 'Комплектующие'} {models.length === 1 && `для ${models}`}</h2>

            <section className={styles['search-page__applied-filters-box']}>
                {searchParams.size ? <section className={styles['search-page__applied-filters']}>
                    <FilterItem onClick={() => setSearchParams('')} />

                    {Array.from(searchParams).map(param =>
                        param[1] !== '0' && param[1] !== '10000' && param[0] !== 'sortType' &&
                        <FilterItem
                            key={param[1]}
                            style={{ order: appliedFiltersOrder[param[0]] }}
                            title={
                                param[0] === 'minPrice' || param[0] === 'maxPrice' ?
                                    param[0] === 'minPrice' ? `от ${param[1]} ₴` : `до ${param[1]} ₴`
                                    : param[1]
                            }
                            onClick={() => {
                                const newParams = new URLSearchParams(searchParams)

                                newParams.delete('brand', param[1])
                                newParams.delete('category', param[1])
                                newParams.delete('model', param[1])
                                newParams.delete('minPrice', param[1])
                                newParams.delete('word', param[1])


                                if (param[0] === 'maxPrice') {
                                    setPriceRange(prev => ({ ...prev, max: 10000 }))
                                }

                                if (param[0] === 'minPrice') {
                                    setPriceRange(prev => ({ ...prev, min: 0 }))
                                }

                                param[0] === 'brand' && hideUncheckBrandModels(param[1], newParams)
                                setSearchParams(newParams)

                            }} />)}
                </section> : null}
            </section>
            <section className={styles['search-page__mobile-buttons']}>
                <button className={styles['mobile-buttons__button']} onClick={() => setIsFiltersPanelOpen(!isFiltersPanelOpen)}>
                    <FaFilter color='#ffff' />
                    <p>Фильтры и сортировка</p>
                </button>
            </section>
            <p className={styles['applied-filters__found-counter']}>Найдено {productsList?.length} товар{getWordEnding(productsList?.length)}</p>

            <div className={styles['search-page__layout']}>
                <section className={`${styles['search-page__filters-panel']} ${isFiltersPanelOpen ? styles['open-panel'] : null}`}>
                    {!isFiltersLoading ? <section className={styles['filters-panel__filter']}>
                        <h3 className={styles['filter__title']}>Сортировка:</h3>
                        <button className={styles['mobile-buttons__button']}
                            style={{ borderRadius: isSortListOpen ? '4px 4px 0 0' : '', transition: '0.2s' }}
                            onClick={() => setIsSortListOpen(!isSortListOpen)}>
                            <p>{sortTitles[sortType]}</p>
                            <MoreArrowIcon color='#ffff' style={{ transform: isSortListOpen ? 'rotateX(-180deg)' : '', transition: '0.2s' }} />
                        </button>
                        <div className={styles['sort__options']} style={{ maxHeight: isSortListOpen ? '300px' : '0px', transition: '0.2s' }}>
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

                    {!isFiltersLoading ? <section className={styles['filters-panel__filter']}>
                        <h3 className={styles['filter__title']}>Бренд</h3>
                        <div className={styles['filter__options']}>
                            {filterOptions.brands?.map(brand => <Checkbox
                                key={brand.title}
                                title={brand.title}
                                isChecked={brands.includes(brand.title)}
                                onClick={() => onCheckBoxClick(brand, 'brand')} />)}
                        </div>
                    </section> : null}

                    {brands.length && !isFiltersLoading ? <section className={styles['filters-panel__filter']}>
                        <h3 className={styles['filter__title']}>Модель</h3>
                        <div className={styles['filter__options']}>

                            {filterOptions.brands?.map(brand => brands.includes(brand.title) &&
                                brand.models?.map(model => <Checkbox
                                    title={model.title}
                                    key={model.title}
                                    isChecked={models.includes(model.title)}
                                    onClick={() => onCheckBoxClick(model, 'model')} />))}
                        </div>
                    </section> : null}

                    {!isFiltersLoading ? <section className={styles['filters-panel__filter']}>
                        <h3 className={styles['filter__title']}>Категория</h3>
                        <div className={styles['filter__options']}>
                            {filterOptions.categories?.map(category => <Checkbox
                                key={category} title={category}
                                isChecked={categories.includes(category)}
                                onClick={() => onCheckBoxClick(category, 'category')} />)}
                        </div>
                    </section> : null}

                    {!isFiltersLoading ? <section className={`${styles['filters-panel__filter']} ${styles['filter__price']}`}>
                        <h3 className={styles['filter__title']}>Цена</h3>
                        <CustomRangeSelector
                            initialMax={Number(searchParams.get('maxPrice')) || priceRange.max}
                            initialMin={Number(searchParams.get('minPrice')) || priceRange.min}
                            onValuesChange={(range) => setPriceRange({ min: range.minValue, max: range.maxValue })} />
                    </section> : null}
                    {!isFiltersLoading ? <Button className={styles['filters-panel__close-button']} title='Закрыть' onClick={() => setIsFiltersPanelOpen(false)} /> : null}

                    {isFiltersLoading ? <Spinner /> : null}
                </section>
                {!isLoading ? <ItemsList className={styles['search-page__search-items']}>
                    {productsList?.map((product, index) => index < 20 && < ProductCard productData={product} key={product._id} />)}
                </ItemsList> : null}
                {!productsList.length ? <p>Товаров не найдено.</p> : null}
                {isLoading ? <Spinner /> : null}
            </div>
        </div >
    )
}
