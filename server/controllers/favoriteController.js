import UserModel from '../models/UserModel.js'

export const addFavoriteItem = async (req, res) => {
    try {
        const user = await UserModel.findOneAndUpdate(
            { _id: req.body.id }, // Условие поиска
            { $push: { favoriteItems: req.params.productId } }, // Что обновляем
        )

        if (!user)
            return res.status(404).json({ msg: 'user not found!' })

        res.status(200).json({ msg: 'item added!' })
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
            return res.staus(404).json({ msg: 'user not found!' })

        res.staus(200).json({ msg: 'item removed!' })
    } catch (error) {
        res.status(500).json({ error: 'Ошибка на сервере.', details: error.message })
    }

}

