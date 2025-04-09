import jwt from 'jsonwebtoken'
import UserModel from '../models/UserModel.js'

export const CheckAuth = async (req, res, next) => {
    // const token = (req.headers.authorization || '').slice(7)
    const token = (req.headers.authorization || '')
    try {

        await jwt.verify(token, process.env.JWT_WORD)

        const decode = await jwt.decode(token)

        req.id = decode.id

        next()
    } catch (error) {
        res.json({ msg: 'invalid token!', token })
    }
}