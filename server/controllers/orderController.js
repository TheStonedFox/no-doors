import { validationResult } from 'express-validator'
import OrderModel from '../models/OrderModel.js'
import UserModel from '../models/UserModel.js'


export const createOrder = async (req, res) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty())
            return res.status(400).json({ message: 'Ошибка валидации, проверьте указанные поля.', code: 400, validationErrors: errors.errors })

        const order = new OrderModel({
            userId: req.id,
            deliveryMethod: req.body.deliveryMethod,
            paymentMethod: req.body.paymentMethod,
            address: req.body.address,
            products: req.body.products,
            userData: { fio: req.body.fio, phone: req.body.phone, email: req.body.email },
            sum: req.body.sum,
        })

        const doc = await order.save()

        const user = await UserModel.findOneAndUpdate(
            { _id: req.id }, // Условие поиска
            { $push: { orders: doc._id } }, // Что обновляем
        )

        if (!user)
            return res.status(404).json({ message: 'Не удалось создать заказ.', code: 404 })

        res.status(200).json({ message: 'Заказ создан.', status: 200, order: doc })
    } catch (error) {
        res.status(500).json({ error: 'Ошибка на сервере.', details: error.message })
    }
}


export const updateOrderStatus = async (req, res) => {
    try {
        const order = await OrderModel.findById({ _id: req.params.id })
        if (!order)
            return res.status(404).json({ message: 'Заказ не найден.', code: 404 })

        await OrderModel.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        )

        res.status(200).json({ message: 'Статус обновлен.', code: 200 })

    } catch (error) {
        res.status(500).json({ error: 'Ошибка на сервере.', details: error.message })
    }
}

export const getOrder = async (req, res) => {
    try {
        const order = await OrderModel.findById(req.params.id)

        if (!order)
            return res.status(404).json({ message: 'Заказ не найден.', code: 404 })

        res.status(200).json({ order, code: 200 })
    } catch (error) {
        res.status(500).json({ error: 'Ошибка на сервере.', details: error.message })
    }
}




