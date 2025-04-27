import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import style from './Popup.module.css'

import { togglePopup } from '../../features/uiSlice'
import CartPopup from './PopupCases/CartPopup/CartPopup'
import OrderDetailsPopup from './PopupCases/OrderDetailsPopup/OrderDetailsPopup'
import OrderPlacedPopup from './PopupCases/OrderPlacedPopup/OrderPlacedPopup'

export default function Popup({ children }) {
    const isPopupOpen = useSelector((state) => state.ui.isPopupOpen)
    const popup = useSelector(state => state.ui.popup)
    const dispatch = useDispatch()
    const negative = useNavigate()
    // useEffect(() => console.log(`popup ${isPopupOpen}`), [isPopupOpen])


    return (
        <div
            className={style['popup']}
            style={isPopupOpen ? {
                opacity: '1',
                height: '100%',
                backdropFilter: 'blur(5px)',
                // WebkitBackdropFilter: 'blur(5px);'
            } : {
                opacity: '0',
                height: '0px',
                backdropFilter: 'blur(0px)',
                // WebkitBackdropFilter: 'blur(0px);'
            }}
            onClick={(e) => {
                e.target === e.currentTarget && dispatch(togglePopup())
            }}
        >
            <div className={style['popup__content']}>
                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" className={style['popup__close-button']} onClick={() => dispatch(togglePopup())}>
                    <g clipPath="url(#clip0_77_1539)">
                        <path d="M17.233 15.001L29.5376 2.6964C30.1542 2.07976 30.1542 1.08004 29.5376 0.463457C28.9209 -0.153183 27.9212 -0.153183 27.3046 0.463457L15 12.768L2.69542 0.463457C2.07878 -0.153183 1.07906 -0.153183 0.46248 0.463457C-0.154101 1.0801 -0.15416 2.07982 0.46248 2.6964L12.767 15.001L0.46248 27.3055C-0.15416 27.9222 -0.15416 28.9219 0.46248 29.5385C1.07912 30.1551 2.07884 30.155 2.69542 29.5385L15 17.2339L27.3045 29.5385C27.9211 30.1551 28.9209 30.155 29.5375 29.5385C30.154 28.9218 30.154 27.9221 29.5375 27.3055L17.233 15.001Z" fill="white" />
                    </g>
                    <defs>
                        <clipPath id="clip0_77_1539">
                            <rect width="30" height="30" fill="white" />
                        </clipPath>
                    </defs>
                </svg>
                {popup?.type === 'product-card' && <CartPopup text={popup?.message} />}
                {popup?.type === 'order-card' && <OrderDetailsPopup orderId={popup?.data} />}
                {popup?.type === 'order-placed' && <OrderPlacedPopup data={popup?.data} />}
                {popup?.type === 'remove-cart-item' && <CartPopup text={popup?.message} />}
            </div>
        </div>
    )
}
