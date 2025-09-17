import { useEffect, useState } from "react"
import { getProducts } from "@api/api"
import { useSelector } from "react-redux"

export const useCart = () => {

    const userData = useSelector((state) => state.user.userData)

    const [products, setProducts] = useState([])
    const [sum, setSum] = useState(0)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    const getSum = () => {
        return userData?.cartItems.reduce((result, cartItem) => {
            const product = products?.find(product => product._id === cartItem.productId)

            if (!product) return

            const price = cartItem.quantity < 5 ? product.price : product.wholesalePrice

            if (!product.discount)
                return (result + price) * cartItem.quantity
            else
                return (result + price - price / 100 * product.discount) * cartItem.quantity
        }, 0)
    }

    const fetchProducts = () => {
        setIsLoading(true)
        setError(null)
        getProducts().then(res => setProducts(res.products)).catch(error => setError(error))
            .finally(() => setIsLoading(false))
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    useEffect(() => {
        setSum(getSum())
    }, [products, userData?.cartItems])

    return { products, userData, sum, isLoading, error, refetch: fetchProducts }
}