import { useEffect, useState } from 'react'

import styles from './SearchPage.module.css'

import { useSearchParams } from 'react-router-dom'

import ItemsList from '@components/ItemsList/ItemsList'
import Spinner from '@components/Spinner/Spinner'
import ProductCard from '@components/ProductCard/ProductCard'
import FilterItem from './FilterItem/FilterItem'
import EmptyPlaceholder from '@components/EmptyPlaceholder/EmptyPlaceholder'
import FiltersPanel from '@components/FiltersPanel/FiltersPanel'


import getWordEnding from '@utils/getWordEnding'

import { getStepChoices, searchProducts } from '@api/api'

import { FaFilter } from "react-icons/fa"
import { useDispatch, useSelector } from 'react-redux'
import { toggleFiltersPanel } from '../../redux/features/uiSlice'
import Button from '../../components/Button/Button'
import Location from '../../components/Location/Location'

export default function SearchPage() {
    const dispatch = useDispatch()

    const [searchParams, setSearchParams] = useSearchParams()
    document.querySelector('title').innerHTML = searchParams.getAll('word').length ? `Поиск товаров "${searchParams.getAll('word')[0]}"` : 'Поиск товаров'
    const models = searchParams.getAll('model')
    const categories = searchParams.getAll('category')

    const isFiltersPanelOpen = useSelector(state => state.ui.isFiltersPanelOpen)

    const [filterOptions, setFilterOptions] = useState({ brands: null, categories: null })
    const [isLoading, setIsLoading] = useState(true)
    const [productsList, setProductsList] = useState([])
    const [loadedItemsCount, setLoadedItemsCount] = useState(6)

    const appliedFiltersOrder = {
        minPrice: 1,
        maxPrice: 2,
        brand: 3,
        deviceType: 4,
        model: 5,
        category: 6
    }

    useEffect(() => {
        searchProducts(`${searchParams.toString()}`)
            .then(res => setProductsList(res.products))
            .catch(error => {
                console.log(error)
                setProductsList([])
            })
            .finally(() => setIsLoading(false))
    }, [searchParams])

    useEffect(() => {
        getStepChoices()
            .then(res => {
                setFilterOptions({ brands: res.options?.brands, categories: res.options.categories })
            })
            .catch(error => console.log(error))
    }, [])

    const hideUncheckBrandModels = (brandTile, params) => {
        if (searchParams.getAll(`brand`).includes(brandTile))
            filterOptions.brands?.map(brand => brand.title === brandTile && Object.entries(brand).map(([key]) => {
                key !== 'title' && [key].map(m => params.delete('model', m.title))
            }))
    }

    const deleteParamValue = (params, key, value) => {
        const values = params.getAll(key).filter(v => v !== value)
        params.delete(key)
        values.forEach(v => params.append(key, v))
    }

    const hasAppliedFilters = (searchParams) => {
        const paramsArray = Array.from(searchParams).filter(
            ([key]) => key !== 'sortType'
        )

        if (paramsArray.length === 0) return false

        const isOnlyDefaultPrice =
            paramsArray.length === 2 &&
            searchParams.get('minPrice') === '0' &&
            searchParams.get('maxPrice') === '10000'

        return !isOnlyDefaultPrice
    }

    const showMoreButtonClick = () => {
        if (loadedItemsCount !== productsList.length)
            setLoadedItemsCount(prev => prev + 6 <= productsList.length - 6 ? prev + 6 : productsList.length)
        else
            setLoadedItemsCount(6)
    }
    return (
        <div className={`${styles['search-page']} container`}>

            <Location path='search' />
            <h2 className={`section-title ${styles['search-page__title']}`}>{categories.length === 1 ? categories : 'Комплектующие'} {models.length === 1 && `для ${models}`}</h2>

            <section className={styles['search-page__applied-filters-box']}>
                {hasAppliedFilters(searchParams) && <section className={styles['search-page__applied-filters']}>
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
                                deleteParamValue(newParams, 'brand', param[1])
                                deleteParamValue(newParams, 'category', param[1])
                                deleteParamValue(newParams, 'model', param[1])
                                deleteParamValue(newParams, 'minPrice', param[1])
                                deleteParamValue(newParams, 'word', param[1])
                                deleteParamValue(newParams, 'deviceType', param[1])

                                if (param[0] === 'maxPrice') newParams.set('maxPrice', 10000)
                                if (param[0] === 'minPrice') newParams.set('minPrice', 0)

                                param[0] === 'brand' && hideUncheckBrandModels(param[1], newParams)
                                setSearchParams(newParams)

                            }} />)}
                </section>}
            </section>
            <button className={styles['search-page__filters-button']} onClick={() => dispatch(toggleFiltersPanel())}>
                <FaFilter color='#ffff' />
                <p>Фильтры и сортировка</p>
            </button>
            <p className={styles['applied-filters__found-counter']}>Найдено {productsList?.length} товар{getWordEnding(productsList?.length)}</p>

            <div className={styles['search-page__layout']}>
                <FiltersPanel isOpen={isFiltersPanelOpen} />

                {!isLoading && <ItemsList className={styles['search-page__search-items']}>
                    {productsList?.map((product, index) => index < loadedItemsCount && <ProductCard productData={product} key={product._id} />)}

                    {productsList?.length > 6 && loadedItemsCount !== productsList.length && !isLoading && <Button
                        className={styles['search-page__more-button']}
                        title={loadedItemsCount !== productsList.length ? 'Показать еще' : 'Скрыть'}
                        onClick={showMoreButtonClick}
                    />}
                </ItemsList>}

                {!productsList.length && !isLoading && <EmptyPlaceholder title='Товаров не найдено.' />}

                {isLoading && <Spinner />}
            </div>

        </div >
    )
}
