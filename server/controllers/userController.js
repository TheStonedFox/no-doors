import UserModel from "../models/UserModel.js"
import OrderModel from "../models/OrderModel.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const register = async (req, res) => {
    const isUser = await UserModel.findOne({ email: req.body.email })

    if (isUser)
        return res.json({ msg: 'email already used' })

    const slat = await bcrypt.genSalt(10)
    const psswordHash = await bcrypt.hash(req.body.password, slat)

    const doc = await new UserModel({ email: req.body.email, password: psswordHash })
    const user = await doc.save()
    const token = await jwt.sign({ id: user._id }, process.env.JWT_WORD)

    res.json({ msg: 'succses!' })
}

export const login = async (req, res) => {
    const user = await UserModel.findOne({ email: req.body.email })

    if (!user)
        return res.json({ msg: 'invalid data' })

    const isValidPassword = await bcrypt.compare(req.body.password, user.password)

    if (!isValidPassword)
        return res.json({ msg: 'invalid data' })

    const token = await jwt.sign({ id: user._id }, process.env.JWT_WORD)

    res.json({ token })
}

export const profile = async (req, res) => {
    const user = await UserModel.findById({ _id: req.id })

    if (!user)
        return res.json({ msg: 'user not found' })

    res.json({ user })
}


export const orders = async (req, res) => {
    const orders = await OrderModel.find(({ userId: req.id }))

    if (!orders)
        return res.json({ msg: 'заказов нет' })

    return res.json(orders)

}