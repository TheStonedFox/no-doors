import styles from './AddToCartButton.module.css'
import { BsCartPlusFill } from "react-icons/bs"
import { BsCartCheck } from "react-icons/bs"

export default function AddToCartButton({ inCart, onClick, disabled }) {
    return (
        <button disabled={disabled}
            className={styles['add-to-cart-button']}
            onClick={onClick}>
            {inCart ? <BsCartCheck /> : <BsCartPlusFill />}
            {/* <p>{inCart ? 'В корзине' : 'Добавить в корзину'}</p> */}
        </button>
    )
}
