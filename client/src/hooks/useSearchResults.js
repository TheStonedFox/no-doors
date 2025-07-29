import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import useProducts from './useProducts'

export default function useSearchResults(value) {
    const [searchList, setSearchList] = useState([])
    const location = useLocation()

    const [products, isLoading, error] = useProducts()

    useEffect(() => {
        setSearchList(() => products?.filter(item => item?.title.toLowerCase().includes(value.toLowerCase())))
    }, [value, products])

    useEffect(() => { setSearchList([]) }, [location])

    return [searchList, isLoading, error]
}
