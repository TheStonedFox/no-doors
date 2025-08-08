import ProductModel from "../models/ProductModel.js"

export const getProducts = async (req, res) => {
    try {
        const products = await ProductModel.find()
        return res.status(200).json({ products, code: 200 })
    } catch (error) {
        res.status(500).json({ error: 'Ошибка на сервере.', details: error.message })
    }
}

export const getProduct = async (req, res) => {
    try {
        const product = await ProductModel.findOne({ _id: req.params.id })

        if (!product)
            return res.status(404).json({ message: 'Продукт не найден.', code: 404 })

        res.status(200).json({ product, code: 200 })
    } catch (error) {
        res.status(500).json({ error: 'Ошибка на сервере.', details: error.message })
    }
}


export const addProduct = async (req, res) => {
    try {
        const doc = await ProductModel.create({
            title: req.body.title,
            price: req.body.price,
            wholesalePrice: req.body.wholesalePrice,
            inStock: req.body.inStock,
            discount: req.body.discount,
        })

        const product = await doc.save()
        res.status(200).json(product)

    } catch (error) {
        res.status(500).json({ error: 'Ошибка на сервере.', details: error.message })
    }
}