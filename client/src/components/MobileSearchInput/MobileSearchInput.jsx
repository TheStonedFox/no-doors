import React from 'react'
import Burger from '../Burger/Burger'
import styles from './MobileSearchInput.module.css'

import { useDispatch } from 'react-redux'
import { toggleCatalog } from '../../features/ui/uiSlice'


export default function MobileSearchInput({ className }) {
    const dispatch = useDispatch()

    return (
        <div className={className}>
            <div className={styles['mobile-input']}>

                <div className={styles.input}>
                    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clipPath="url(#clip0_799_1592)">
                            <path d="M9.06789 18.1189C4.07248 18.1189 0.00842285 14.0549 0.00842285 9.05947C0.00842285 4.06405 4.07248 0 9.06789 0C14.0633 0 18.1274 4.06405 18.1274 9.05947C18.1274 14.0549 14.0633 18.1189 9.06789 18.1189ZM9.06789 1.71744C5.01947 1.71744 1.72586 5.01105 1.72586 9.05947C1.72586 13.1079 5.01947 16.4015 9.06789 16.4015C13.1163 16.4015 16.4099 13.1079 16.4099 9.05947C16.4099 5.01105 13.1163 1.71744 9.06789 1.71744ZM21.7401 21.7485C22.0754 21.4131 22.0754 20.8694 21.7401 20.534L17.8974 16.6913C17.562 16.3559 17.0182 16.3559 16.6829 16.6913C16.3476 17.0266 16.3476 17.5704 16.6829 17.9057L20.5257 21.7485C20.6933 21.9161 20.9131 22 21.1329 22C21.3527 22 21.5724 21.9161 21.7401 21.7485Z" fill="white" />
                        </g>
                        <defs>
                            <clipPath id="clip0_799_1592">
                                <rect width="22" height="22" fill="white" />
                            </clipPath>
                        </defs>
                    </svg>
                    <input placeholder='Поиск товара...' className={styles['mobile-input']} type="text" />
                </div>
            </div>
        </div>
    )
}
