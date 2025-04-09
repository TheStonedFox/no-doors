import UserModel from '../models/UserModel.js'

export const add = async (req, res) => {
    const user = await UserModel.findOneAndUpdate(
        { _id: req.body.id }, // Условие поиска
        { $push: { favoriteItems: req.params.productId } }, // Что обновляем
    )

    if (!user)
        return res.json({ msg: 'user not found!' })

    res.json({ msg: 'item added!' })
}

export const remove = async (req, res) => {
    const user = await UserModel.findOneAndUpdate(
        { _id: req.body.id }, // Условие поиска
        { $pull: { favoriteItems: req.params.productId } }, // Что обновляем
    )

    if (!user)
        return res.json({ msg: 'user not found!' })

    res.json({ msg: 'item removed!' })
}

