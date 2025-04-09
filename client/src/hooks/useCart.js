import { useEffect, useState } from "react"
import { getProducts } from "../api/api"
import { useSelector } from "react-redux"

export const useCart = () => {
    const userData = useSelector((state) => state.user.userData)

    const [products, setProducts] = useState([])
    const [sum, setSum] = useState(0)
    const [loadingStatus, setLoadingStatus] = useState(true)

    const getData = async () => {
        try {
            setProducts(await getProducts(() => setLoadingStatus(false)))
        } catch (error) {
            console.error(`не удалось загрузить товары! ${error}`)
            setLoadingStatus(false)
        }
    }

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
        getData()
    }, [])

    useEffect(() => {
        setSum(getSum())
    }, [products, userData?.cartItems])

    return [products, userData, sum, loadingStatus]
}