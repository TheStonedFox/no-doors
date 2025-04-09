import UserModel from '../models/UserModel.js'

export const add = async (req, res) => {
    const user = await UserModel.findOneAndUpdate(
        { _id: req.body.userId }, // Условие поиска
        { $push: { cartItems: { productId: req.params.productId, quantity: req.body.quantity } } }, // Что обновляем
    )

    if (!user)
        return res.json({ msg: 'user not found!' })

    res.json({ msg: 'item added!', ID: req.params.productId })
}

export const remove = async (req, res) => {
    const user = await UserModel.findOneAndUpdate(
        { _id: req.body.userId }, // Условие поиска
        { $pull: { cartItems: { productId: req.params.productId } } }, // Что обновляем
    )

    if (!user)
        return res.json({ msg: 'user not found!' })

    res.json({ msg: 'item removed!' })
}

export const update = async (req, res) => {

    const user = await UserModel.findById(req.body.id)

    if (!user)
        return res.json({ msg: 'user not found!' })

    user.cartItems[user.cartItems.findIndex(item => item.productId === req.params.id)].quantity = req.body.quantity
    await user.save()

    res.json({ msg: 'item update!' })

}
