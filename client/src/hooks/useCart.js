import { useEffect, useState } from "react"
import { getProducts } from "@api/api"
import { useSelector } from "react-redux"

export const useCart = () => {

    const userData = useSelector((state) => state.user.userData)

    const [products, setProducts] = useState([])
    const [sum, setSum] = useState(0)
    const [loadingStatus, setLoadingStatus] = useState(true)

    // const [order, setOrder] = useState()

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

    useEffect(() => {
        getProducts().then(res => setProducts(res.products)).catch(error => alert(error))
            .finally(() => setLoadingStatus(false))
    }, [])

    useEffect(() => {
        setSum(getSum())
    }, [products, userData?.cartItems])

    return [products, userData, sum, loadingStatus]
}