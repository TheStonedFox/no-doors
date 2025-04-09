import ProductModel from "../models/ProductModel.js"

export const getProducts = async (req, res) => {
    try {
        const products = await ProductModel.find()
        return res.json(products)
    } catch (error) {
        res.json({ msg: error })
    }
}

export const getProduct = async (req, res) => {
    const product = await ProductModel.findOne({ _id: req.params.id })

    if (!product)
        return res.json({ msg: 'product not found!' })

    res.json(product)

}

export const addProduct = async (req, res) => {
    const doc = await ProductModel.create({
        title: req.body.title,
        price: req.body.price,
        wholesalePrice: req.body.wholesalePrice,
        inStock: req.body.inStock,
        discount: req.body.discount,
    })

    const product = await doc.save()

    res.json(product)

}