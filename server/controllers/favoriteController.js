import UserModel from '../models/UserModel.js'

export const toggleFavoriteItem = async (req, res) => {

    try {
        const productId = req.params.productId
        const user = await UserModel.findOneAndUpdate(
            { _id: req.body.id }, // Условие поиска
            { $pull: { favoriteItems: productId } }, // Что обновляем
        )

        if (!user)
            return res.status(404).json({ message: 'Не удалось обновить данные.' })

        if (user.favoriteItems.includes(productId)) {
            const user = await UserModel.findOneAndUpdate(
                { _id: req.body.id },
                { $pull: { favoriteItems: productId } })

            if (!user)
                return res.status(404).json({ message: 'Не удалось обновить данные.' })

            res.status(200).json({ message: 'Товар удален.', isInFavorite: false })
        } else {
            const user = await UserModel.findOneAndUpdate(
                { _id: req.body.id },
                { $push: { favoriteItems: productId } })

            if (!user)
                return res.status(404).json({ message: 'Не удалось обновить данные.' })
            res.status(200).json({ message: 'Товар добавлен.', isInFavorite: true })
        }

    } catch (error) {
        res.status(500).json({ error: 'Ошибка на сервере.', details: error.message })
    }

}

export const clearFavorites = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.userId)
        if (!user)
            return res.status(404).json({ message: 'Пользователь не найден.' })

        user.favoriteItems = []

        await user.save()

        res.status(200).json({ message: 'Список избранного очищен.' })
    } catch (error) {
        res.status(500).json({ error: 'Ошибка на сервере.', details: error.message })
    }
}

