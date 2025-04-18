import UserModel from "../models/UserModel.js"
import OrderModel from "../models/OrderModel.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const userRegister = async (req, res) => {
    try {
        const isUser = await UserModel.findOne({ email: req.body.email })

        if (isUser)
            return res.status(409).json({ msg: 'email already used' })

        const slat = await bcrypt.genSalt(10)
        const psswordHash = await bcrypt.hash(req.body.password, slat)

        const doc = await new UserModel({ fio: req.body.fio, email: req.body.email, password: psswordHash })
        const user = await doc.save()
        const token = await jwt.sign({ id: user._id }, process.env.JWT_WORD)

        res.status(200).json({ msg: 'succses!' })
    } catch (error) {
        res.status(500).json({ error: 'Ошибка на сервере.', details: error.message })
    }
}

export const userLogin = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email })

        if (!user)
            return res.status(400).json({ msg: 'Не верные данные' })

        const isValidPassword = await bcrypt.compare(req.body.password, user.password)

        if (!isValidPassword)
            return res.status(400).json({ msg: 'Не верные данные' })

        const token = await jwt.sign({ id: user._id }, process.env.JWT_WORD)

        res.json({ token })
    } catch (error) {
        res.status(500).json({ error: 'Ошибка на сервере.', details: error.message })
    }
}

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