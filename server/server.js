import express from 'express'
import mongoose from 'mongoose'
import UserModel from './models/UserModel.js'
import dotenv from 'dotenv'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import cors from 'cors'

dotenv.config()

mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qamea.mongodb.net/ficStash?retryWrites=true&w=majority&appName=Cluster0`)
    .then(() => console.log('DB ok'))
    .catch(() => console.log('DB err'))


const app = express()

app.use(cors())
app.use(express.json())


app.listen(process.env.PORT || 5000, () => console.log(`the server is running on the ${process.env.PORT || 5000} port!`))

