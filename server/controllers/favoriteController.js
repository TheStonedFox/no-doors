import UserModel from '../models/UserModel.js'

export const addFavoriteItem = async (req, res) => {
    try {
        const user = await UserModel.findOneAndUpdate(
            { _id: req.body.id }, // Условие поиска
            { $push: { favoriteItems: req.params.productId } }, // Что обновляем
        )

        if (!user)
            return res.status(404).json({ message: 'Не удалось обновить данные.', code: 404 })

        res.status(200).json({ message: 'Товар добавлен.', code: 200 })
    } catch (error) {
        res.status(500).json({ error: 'Ошибка на сервере.', details: error.message })
    }


}

export const removeFavoriteItem = async (req, res) => {

    try {
        const user = await UserModel.findOneAndUpdate(
            { _id: req.body.id }, // Условие поиска
            { $pull: { favoriteItems: req.params.productId } }, // Что обновляем
        )

        if (!user)
            return res.status(404).json({ message: 'Не удалось обновить данные.', code: 404 })

        res.status(200).json({ msg: 'Товар удален.', code: 200 })
    } catch (error) {
        res.status(500).json({ error: 'Ошибка на сервере.', details: error.message })
    }

}

