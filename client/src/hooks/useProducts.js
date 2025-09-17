import { useEffect, useState } from 'react'
import { getProducts } from '@api/api'



export default function useProducts() {
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [products, setProducts] = useState([])

    const getProductsList = async () => {
        setIsLoading(true)
        setError(null)
        await getProducts().then(res => setProducts(res.products)).catch(error => setError(error)).finally(() => setIsLoading(false))
    }

    useEffect(() => {
        getProductsList()
    }, [])

    return { products, isLoading, error, refetch: getProductsList }
}
