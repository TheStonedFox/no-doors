import React, { useCallback, useEffect, useRef, useState } from 'react'

import styles from './SearchPage.module.css'

import { useNavigate, useSearchParams } from 'react-router-dom'

import ItemsList from '../../components/ItemsList/ItemsList'
import Spinner from '../../components/Spinner/Spinner'
import ProductCard from '../../components/ProductCard/ProductCard'
import FilterItem from './FilterItem/FilterItem'
import EmptyPlaceholder from '../../components/EmptyPlaceholder/EmptyPlaceholder'


import getWordEnding from '../../utils/getWordEnding'

import { getStepChoices, searchProducts } from '../../api/api'

import { FaFilter } from "react-icons/fa"
import FiltersPanel from '../../components/FiltersPanel/FiltersPanel'
import { useDispatch, useSelector } from 'react-redux'
import { toggleFiltersPanel } from '../../features/uiSlice'

export default function SearchPage() {

    // const [products, isLoading, error] = useProducts()
    const [searchParams, setSearchParams] = useSearchParams()
    document.querySelector('title').innerHTML = searchParams.getAll('word').length ? `Поиск товаров "${searchParams.getAll('word')[0]}"` : 'Поиск товаров'
    const models = searchParams.getAll('model')
    const categories = searchParams.getAll('category')

    const isFiltersPanelOpen = useSelector(state => state.ui.isFiltersPanelOpen)

    const dispatch = useDispatch()

    const [filterOptions, setFilterOptions] = useState({ brands: null, categories: null })
    const [isLoading, setIsLoading] = useState(true)
    const [productsList, setProductsList] = useState([])
    const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 })
    const [isFiltersLoading, setIsFiltersLoading] = useState(false)

    const appliedFiltersOrder = {
        minPrice: 1,
        maxPrice: 2,
        brand: 3,
        deviceType: 4,
        model: 5,
        category: 6
    }

    const hideUncheckBrandModels = (brandTile, params) => {
        if (searchParams.getAll(`brand`).includes(brandTile))
            filterOptions.brands?.map(brand => brand.title === brandTile && Object.entries(brand).map(([key]) => {
                key !== 'title' && [key].map(m => params.delete('model', m.title))
            }))
    }

    useEffect(() => { console.log(isLoading) }, [isLoading])

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
        // !searchParams.get('sortType') && searchParams.set('sortType', 'decreasingPrice')
        // setSortType(searchParams.get('sortType'))
        getStepChoices()
            .then(res => {
                setIsFiltersLoading(true)
                setFilterOptions({ brands: res.options?.brands, categories: res.options.categories })
            })
            .catch(error => alert(error))
            .finally(() => setIsFiltersLoading(false))
    }, [])

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
                                newParams.delete('deviceType', param[1])

                                if (param[0] === 'maxPrice') setPriceRange(prev => ({ ...prev, max: 10000 }))

                                if (param[0] === 'minPrice') setPriceRange(prev => ({ ...prev, min: 0 }))

                                param[0] === 'brand' && hideUncheckBrandModels(param[1], newParams)
                                setSearchParams(newParams)

                            }} />)}
                </section> : null}
            </section>
            <button className={styles['search-page__filters-button']} onClick={() => dispatch(toggleFiltersPanel())}>
                <FaFilter color='#ffff' />
                <p>Фильтры и сортировка</p>
            </button>
            <p className={styles['applied-filters__found-counter']}>Найдено {productsList?.length} товар{getWordEnding(productsList?.length)}</p>

            <div className={styles['search-page__layout']}>
                <FiltersPanel isOpen={isFiltersPanelOpen} />

                {!isLoading ? <ItemsList className={styles['search-page__search-items']}>
                    {productsList?.map((product, index) => index < 20 && < ProductCard productData={product} key={product._id} />)}
                </ItemsList> : null}

                {!productsList.length && !isLoading ? <EmptyPlaceholder title='Товаров не найдено.' /> : null}

                {isLoading ? <Spinner /> : null}
            </div>
        </div >
    )
}
