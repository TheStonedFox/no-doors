import React, { useEffect, useState } from 'react'
import { apiRequest, getProducts } from '../api/api'


export default function useProducts() {
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [products, setProducts] = useState([])

    const getProductsList = async () => {
        setIsLoading(true)
        setError(null)
        await getProducts().then(data => setProducts(data)).catch(error => setError(error)).finally(() => setIsLoading(false))
    }

    useEffect(() => {
        getProductsList()
    }, [])

    return [products, isLoading, error]
}
