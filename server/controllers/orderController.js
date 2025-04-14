import OrderModel from '../models/OrderModel.js'
import UserModel from '../models/UserModel.js'

export const createOrder = async (req, res) => {
    try {
        // const errors = validationResult(req)

        // if (!errors.isEmpty())
        //     return res.json({ errors: errors.errors })

        const order = new OrderModel({
            userId: req.id,
            deliveryMethod: req.body.deliveryMethod,
            paymentMethod: req.body.paymentMethod,
            adress: req.body.adress,
            products: req.body.products,
            userData: { fio: req.body.fio, phone: req.body.phone, email: req.body.email },
            sum: req.body.sum,
        })

        // res.json({ msg: 'item added!' })

        const doc = await order.save()

        const user = await UserModel.findOneAndUpdate(
            { _id: req.id }, // Условие поиска
            { $push: { orders: doc._id } }, // Что обновляем
        )

        if (!user)
            return res.json({ msg: 'user not found!' })

        res.json({ status: 'ok', order: doc })
    } catch (error) {
        res.status(500).json({ error: 'Ошибка на сервере.', details: error.message })
    }
}


export const updateOrderStatus = async (req, res) => {
    try {
        const order = await OrderModel.findById({ _id: req.params.id })
        if (!order)
            return res.status(404).json({ mag: 'Заказ не найден!' })

        await OrderModel.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        )

        res.status(200).json({ msg: 'Статус обновлен!' })

    } catch (error) {
        res.status(500).json({ error: 'Ошибка на сервере.', details: error.message })
    }
}

export const getOrder = async (req, res) => {
    try {
        const order = await OrderModel.findById(req.params.id)

        if (!order)
            return res.status(404).json({ mag: 'Заказ не найден!' })

        res.json(order)
    } catch (error) {
        res.status(500).json({ error: 'Ошибка на сервере.', details: error.message })
    }
}




