import UserModel from '../models/UserModel.js'

export const toggleCartItem = async (req, res) => {
    try {
        const productId = req.params.productId
        const cartItem = await UserModel.findOne({ _id: req.body.userId, 'cartItems.productId': productId })

        if (cartItem) {
            const user = await UserModel.findOneAndUpdate(
                { _id: req.body.userId },
                { $pull: { cartItems: { productId: productId } } },
            )
            if (!user)
                return res.status(404).json({ message: 'Не удалось обновить данные.' })
            res.status(200).json({ message: 'Товар удален из корзины.' })
        } else {
            const user = await UserModel.findOneAndUpdate(
                { _id: req.body.userId },
                { $push: { cartItems: { productId: req.params.productId, quantity: req.body.quantity | 1 } } }
            )
            if (!user)
                return res.status(404).json({ message: 'Не удалось обновить данные.' })
            res.status(200).json({ message: 'Товар добавлен в корзину.' })
        }

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


export const clearCart = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.userId)

        if (!user)
            return res.status(404).json({ message: 'Пользователь не найден.' })

        user.cartItems = []
        await user.save()

        res.status(200).json({ message: 'Корзина очищена.' })
    } catch (error) {
        res.status(500).json({ error: 'Ошибка на сервере.', details: error.message })
    }
}


