import CommentModel from "../models/CommentModel.js"
import ProductModel from "../models/ProductModel.js"
import UserModel from "../models/UserModel.js"
import OrderModel from "../models/OrderModel.js"


export const getProducts = async (req, res) => {
    try {
        const products = await ProductModel.find()
        return res.status(200).json({ products })
    } catch (error) {
        res.status(500).json({ error: 'Ошибка на сервере.', details: error.message })
    }
}

export const getProduct = async (req, res) => {
    try {
        const product = await ProductModel.findOne({ _id: req.params.id })

        if (!product)
            return res.status(404).json({ message: 'Продукт не найден.' })

        res.status(200).json({ product })
    } catch (error) {
        res.status(500).json({ error: 'Ошибка на сервере.', details: error.message })
    }
}

export const addProduct = async (req, res) => {
    try {
        const doc = await ProductModel.create({
            title: req.body.title,
            price: req.body.price,
            wholesalePrice: req.body.wholesalePrice,
            inStock: req.body.inStock,
            discount: req.body.discount,
        })

        const product = await doc.save()
        res.status(200).json(product)

    } catch (error) {
        res.status(500).json({ error: 'Ошибка на сервере.', details: error.message })
    }
}

export const getAllComments = async (req, res) => {

    try {
        const comments = await CommentModel.find({ productId: req.params.id, type: req.query.type }).sort({ createdAt: -1 })

        if (!comments.length)
            return res.status(200).json({ message: 'Комментариев к этому товару не найдено', comments })

        res.status(200).json({ message: 'Комментарии к товару получены.', comments })
    } catch (error) {
        res.status(500).json({ error: 'Ошибка на сервере.', details: error.message })
    }

}

export const checkReviewEligibility = async (req, res) => {

    try {
        const { userId, productId } = req.query

        const user = await UserModel.findById(userId)
        if (!user) return res.status(404).json({ message: 'Пользователь не найден.' })

        const orders = await OrderModel.find({ userId })

        if (!orders.length) return res.status(404).json({ message: 'Заказов нет.' })

        const isProductPurchased = orders.some(order =>
            order.status === 'paid' &&
            order.products.some(product => product.productId === productId)
        )

        const isUserCommented = await CommentModel.exists({ userId, productId, type: 'review' })

        res.status(200).json({ isProductPurchased, isUserCommented })
    } catch (error) {
        res.status(500).json({ error: 'Ошибка на сервере.', details: error.message })
    }

}


export const searchProducts = async (req, res) => {
    try {
        const filters = {
            brand: req.query.brand || '',
            model: req.query.model || '',
            category: req.query.category || '',
            word: req.query.word || '',
            minPrice: Number(req.query.minPrice) || 0,
            maxPrice: Number(req.query.maxPrice) || 10000
        }

        const query = {}

        if (filters.category) query.category = filters.category
        if (filters.brand) query.brand = filters.brand
        if (filters.model) query.model = filters.model


        const list = await ProductModel.find(query)
        if (!list.length)
            return res.status(404).json({ message: 'Не найдено ни одного товара.', filters })

        const finalList =
            list.filter(item => {
                if (filters.word)
                    return item.price > filters.minPrice && item.price <= filters.maxPrice &&
                        item.title.toLocaleLowerCase().includes(filters.word.toLocaleLowerCase())

                return item.price > filters.minPrice && item.price <= filters.maxPrice
            }).sort((a, b) => {
                const aFinal = a.price - (a.discount ? (a.price * a.discount) / 100 : 0)
                const bFinal = b.price - (b.discount ? (b.price * b.discount) / 100 : 0)
                if (req.query.sortType === 'increasingPrice') return aFinal - bFinal
                if (req.query.sortType === 'decreasingPrice') return bFinal - aFinal
                if (req.query.sortType === 'increasingBrand') return a.brand.localeCompare(b.brand)
                if (req.query.sortType === 'decreasingBrand') return b.brand.localeCompare(a.brand)
                if (req.query.sortType === 'increasingDiscount') return a.discount - b.discount
                if (req.query.sortType === 'decreasingDiscount') return b.discount - a.discount
                if (req.query.sortType === 'decreasingModel') return b.model.localeCompare(a.model)
                if (req.query.sortType === 'increasingModel') return a.model.localeCompare(b.model)

            })

        if (!finalList.length)
            return res.status(404).json({ message: 'Не найдено ни одного товара.1', filters })

        res.status(200).json({ filters, products: finalList, message: 'Товары найдены.' })
    } catch (error) {
        res.status(500).json({ error: 'Ошибка на сервере.', details: error.message })
    }

}
