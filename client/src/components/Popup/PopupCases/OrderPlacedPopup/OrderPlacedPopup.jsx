

import styles from './OrderPlacedPopup.module.css'

import Button from '../../../Button/Button'

import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { togglePopup } from '../../../../redux/features/uiSlice'

export default function OrderPlacedPopup({ data }) {
    const negative = useNavigate()
    const dispatch = useDispatch()

    return (
        <div className={styles['order-placed']}>
            <svg width="70" height="70" viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_37_3024)">
                    <path d="M59.7487 10.2512C53.1381 3.64068 44.3488 0 35 0C25.651 0 16.8617 3.64068 10.2512 10.2512C3.64055 16.8618 0 25.6512 0 35C0 44.3488 3.64055 53.1381 10.2512 59.7487C16.8618 66.3593 25.651 70 35 70C44.3488 70 53.1381 66.3593 59.7487 59.7487C66.3593 53.1381 70 44.3488 70 35C70 25.6512 66.3593 16.8619 59.7487 10.2512ZM35 65.8984C17.9625 65.8984 4.10156 52.0375 4.10156 35C4.10156 17.9625 17.9625 4.10156 35 4.10156C52.0375 4.10156 65.8984 17.9625 65.8984 35C65.8984 52.0375 52.0375 65.8984 35 65.8984Z" fill="#399A3A" />
                    <path d="M51.7213 23.7698C50.9205 22.9691 49.622 22.9691 48.8212 23.7699L30.7116 41.8795L21.1786 32.3465C20.3779 31.5458 19.0793 31.5458 18.2784 32.3465C17.4775 33.1473 17.4775 34.4459 18.2784 35.2468L29.2614 46.2298C29.6619 46.6302 30.1867 46.8304 30.7115 46.8304C31.2362 46.8304 31.7612 46.6301 32.1615 46.2298L51.7213 26.67C52.5222 25.8692 52.5222 24.5707 51.7213 23.7698Z" fill="#399A3A" />
                </g>
                <defs>
                    <clipPath id="clip0_37_3024">
                        <rect width="70" height="70" fill="white" />
                    </clipPath>
                </defs>
            </svg>
            <div className={styles['order-placed__text']}>
                <h3 className={styles['order-placed__title']}>{`Заказ #${data} оформлен!`}</h3>
                <p className={styles['order-placed__message']}>Скоро с Вами свяжется наш менеджер.</p>
            </div>
            <Button title='Посмотреть заказ' onClick={() => {
                dispatch(togglePopup())
                negative('/profile')
            }} />
        </div>
    )
}
