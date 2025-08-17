import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import Counter from '../Counter/Counter'
import Field from '../Field/Field'
import styles from './CartItem.module.css'

import { updateCartItem } from '@api/api'
import { useDispatch, useSelector } from 'react-redux'
import { setUserData } from '../../redux/features/userSlice'

import Spinner from '../Spinner/Spinner'
import RemoveIcon from './RemoveIcon'

import getPrice from '@utils/getPrice'
import useProductActions from '@hooks/useProductActions'

export default function CartItem({ productData, initialQuantityValue, getTotalPriceValue, viewOnly, className }) {

    const { title, price, wholesalePrice, inStock, _id, discount } = productData || {}

    const negative = useNavigate()

    const [quantity, setQuantity] = useState(initialQuantityValue)
    const [imageLoading, setImageLoading] = useState(true)

    const userData = useSelector((state) => state.user.userData)
    const dispatch = useDispatch()

    const [, cartItemAction] = useProductActions()

    useEffect(() => {
        setQuantity(initialQuantityValue ? initialQuantityValue : 1)
        return () => dispatch(setUserData())
    }, [])

    return (
        <div className={styles['cart-item']} >
            <div className={styles['cart-item__img']}>
                <img style={{ display: imageLoading ? 'none' : 'flex' }} src="../../../public/images/categories/03.png" width='80%' alt="product image" onLoad={() => setImageLoading(false)} />
                {imageLoading && <Spinner />}
            </div>

            <div className={styles['cart-item__title']} onClick={() => negative(`/products/${_id}`)}>
                <h4>{title}</h4>
                <p>Артикул: 854236896ABC</p>
            </div>
            <div className={styles['cart-item__fields']}>
                <Field title='Цена (Розница)' value={`${getPrice(discount, price)} ₴`} />
                <Field title='Цена (Опт от 5)' value={`${getPrice(discount, wholesalePrice)} ₴`} />
                <Field title='Остаток' value={`${inStock} шт.`} />
                <Field title='Сумма' value={discount === 0 ?
                    quantity < 5 ?
                        price * quantity : wholesalePrice * quantity
                    : quantity < 5 ?
                        (price - price / 100 * discount) * quantity :
                        (wholesalePrice - wholesalePrice / 100 * discount) * quantity + '₴'} />
            </div>
            <p>{`${getPrice(discount, price)} ₴`}</p>
            <p>{`${getPrice(discount, wholesalePrice)} ₴`}</p>
            <p>{`${inStock} шт.`}</p>
            <div className={styles['cart-item__controls']}>
                {!viewOnly ? <Counter
                    className={styles['cart-item__counter']}
                    onCounterChange={(value) => {
                        setQuantity(value)
                        updateCartItem(userData._id, _id, value)
                            .then(() => dispatch(setUserData()))
                            .catch(error => alert(error))
                    }}
                    initialValue={initialQuantityValue} /> : <p>{quantity}</p>}
                <p>{discount === 0 ?
                    quantity < 5 ?
                        price * quantity : wholesalePrice * quantity
                    : quantity < 5 ?
                        (price - price / 100 * discount) * quantity :
                        (wholesalePrice - wholesalePrice / 100 * discount) * quantity} ₴
                </p>
                {!viewOnly && <RemoveIcon onClick={() => cartItemAction(_id)} />}
            </div>
        </div >
    )
}
