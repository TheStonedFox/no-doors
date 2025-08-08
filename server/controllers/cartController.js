import ProductModel from '../models/ProductModel.js'
import UserModel from '../models/UserModel.js'

export const addCartItem = async (req, res) => {
    try {
        const user = await UserModel.findOneAndUpdate(
            { _id: req.body.userId }, // Условие поиска
            { $push: { cartItems: { productId: req.params.productId, quantity: req.body.quantity } } }, // Что обновляем
        )

        if (!user)
            return res.status(404).json({ message: 'Не удалось обновить данные.', code: 404 })

        const product = await ProductModel.findById(req.params.productId)

        if (!product)
            return res.status(404).json({ message: 'Товар не найден.', code: 404 })

        res.status(200).json({ message: 'Товар добавлен в корзину.', code: 200, ID: req.params.productId })
    } catch (error) {
        res.status(500).json({ error: 'Ошибка на сервере.', details: error.message })
    }

}

export const removeCartItem = async (req, res) => {
    try {
        const user = await UserModel.findOneAndUpdate(
            { _id: req.body.userId }, // Условие поиска
            { $pull: { cartItems: { productId: req.params.productId } } }, // Что обновляем
        )

        if (!user)
            return res.status(404).json({ message: 'Не удалось обновить данные.', code: 404 })

        res.status(200).json({ message: 'Товар удален из корзины.', code: 200 })
    } catch (error) {
        res.status(500).json({ error: 'Ошибка на сервере.', details: error.message })
    }

}

export const updateCartItem = async (req, res) => {
    try {
        const user = await UserModel.findById(req.body.id)

        if (!user)
            return res.status(404).json({ msg: 'user not found!' })

        user.cartItems[user.cartItems.findIndex(item => item.productId === req.params.id)].quantity = req.body.quantity
        await user.save()

        res.status(200).json({ msg: 'item update!' })
    } catch (error) {
        res.status(500).json({ error: 'Ошибка на сервере.', details: error.message })
    }


}
