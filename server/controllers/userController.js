import UserModel from "../models/UserModel.js"
import OrderModel from "../models/OrderModel.js"
import { validationResult } from "express-validator"

export const profile = async (req, res) => {
    try {
        const user = await UserModel.findById({ _id: req.id })

        if (!user)
            return res.status(404).json({ message: 'Пользователь не найден!', code: 404 })

        res.status(200).json({ user, code: 200 })
    } catch (error) {
        res.status(500).json({ error: 'Ошибка на сервере.', details: error.message })
    }
}


export const orders = async (req, res) => {

    try {
        const orders = await OrderModel.find(({ userId: req.id }))

        if (!orders)
            return res.status(200).json({ message: 'Заказов нет.' })

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
                return res.status(200).json({ message: 'Данные обновлены', code: 200, user })
            }

            await user.updateOne({ $pull: { viewedProducts: { productId: req.body.productId } } })
            await user.updateOne({ $push: { viewedProducts: { productId: req.body.productId } } })

            return res.status(200).json({ message: 'Данные обновлены', code: 200, user })
        }

        const errors = validationResult(req)

        if (!errors.isEmpty())
            return res.status(400).json({ message: 'Ошибка валидации, проверьте указанные поля.', code: 400, validationErrors: errors.errors })


        if (!user)
            return res.status(404).json({ message: 'Пользователь не найден', code: 404 })

        user.phone = req.body.phone || user.phone
        user.email = req.body.email || user.email
        user.city = req.body.city || user.city
        user.postOffice = req.body.postOffice || user.postOffice

        await user.save()

        return res.status(200).json({ message: 'Данные обновлены', code: 200, user })
    } catch (error) {
        res.status(500).json({ error: 'Ошибка на сервере.', details: error.message })
    }
}
