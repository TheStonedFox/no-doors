import UserModel from "../models/UserModel.js"
import OrderModel from "../models/OrderModel.js"
import { validationResult } from "express-validator"

export const profile = async (req, res) => {
    try {
        const user = await UserModel.findById({ _id: req.id })

        if (!user)
            return res.status(404).json({ msg: 'user not found' })

        res.status(200).json({ user })
    } catch (error) {
        res.status(500).json({ error: 'Ошибка на сервере.', details: error.message })
    }
}


export const orders = async (req, res) => {

    try {
        const orders = await OrderModel.find(({ userId: req.id }))

        if (!orders)
            return res.status(200).json({ msg: 'заказов нет' })

        return res.status(200).json(orders)
    } catch (error) {
        res.status(500).json({ error: 'Ошибка на сервере.', details: error.message })
    }
}

export const update = async (req, res) => {
    try {
        const user = await UserModel.findById({ _id: req.id })

        if (req.body.productId) {
            if (!user.viewedProducts.some(product => product.productId === req.body.productId)) {
                await user.updateOne({ $push: { viewedProducts: { productId: req.body.productId } } })
                return res.status(200).json({ msg: 'Данные обновлены', user })
            }

            await user.updateOne({ $pull: { viewedProducts: { productId: req.body.productId } } })
            await user.updateOne({ $push: { viewedProducts: { productId: req.body.productId } } })

            return res.status(200).json({ msg: 'Данные обновлены', user })
        }

        const errors = validationResult(req)
        if (!errors.isEmpty())
            return res.status(400).json({ validationErrors: errors.errors })


        if (!user)
            return res.status(404).json({ msg: 'Пользователь не найден' })

        user.phone = req.body.phone || user.phone
        user.email = req.body.email || user.email
        user.city = req.body.city || user.city
        user.postOffice = req.body.postOffice || user.postOffice

        await user.save()

        return res.status(200).json({ msg: 'Данные обновлены', user })
    } catch (error) {
        res.status(500).json({ error: 'Ошибка на сервере.', details: error.message })
    }
}
