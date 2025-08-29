import CommentModel from "../models/CommentModel.js"
import ProductModel from "../models/ProductModel.js"
import UserModel from "../models/UserModel.js"
import OrderModel from "../models/OrderModel.js"


export const getProducts = async (req, res) => {
    try {
        const products = await ProductModel.find()
        return res.status(200).json({ products, code: 200 })
    } catch (error) {
        res.status(500).json({ error: 'Ошибка на сервере.', details: error.message })
    }
}

export const getProduct = async (req, res) => {
    try {
        const product = await ProductModel.findOne({ _id: req.params.id })

        if (!product)
            return res.status(404).json({ message: 'Продукт не найден.', code: 404 })

        res.status(200).json({ product, code: 200 })
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
    const comments = await CommentModel.find({ productId: req.params.id, type: req.query.type })

    if (!comments)
        return res.status(404).json({ message: 'Комментариев к этому товару не найдено', code: 404 })

    const sorted = comments.sort((a, b) => b.createdAt - a.createdAt)

    res.status(200).json({ message: 'Комментарии к товару получены.', code: 200, comments: sorted })
}

export const checkReviewEligibility = async (req, res) => {

    try {
        const { userId, productId } = req.query

        const user = await UserModel.findById(userId)
        if (!user) return res.status(404).json({ message: 'Пользователь не найден.', code: 404 })

        const orders = await OrderModel.find({ userId })

        if (!orders.length) return res.status(404).json({ message: 'Заказов нет.', code: 404 })

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

export const addAllComments = async (req, res) => { }

