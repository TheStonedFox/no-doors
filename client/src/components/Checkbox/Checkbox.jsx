import React, { useEffect } from 'react'

import styles from './Checkbox.module.css'

import { useState } from 'react'

export default function Checkbox({ onClick, isChecked, title }) {
    const [checked, setChecked] = useState(false)

    useEffect(() => {
        setChecked(isChecked ? true : false)
    }, [isChecked])
    return (
        <div className={styles['check-box']}
            onClick={() => setChecked(!checked)}>
            <div className={`${styles['check-box__indicator']} ${checked ? styles['active'] : null}`}>
                <svg width={checked ? 8 : 0} height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.85358 0.47458C9.65832 0.279307 9.34176 0.279307 9.14647 0.47458L3.15615 6.46495L0.853566 4.16237C0.658311 3.9671 0.341749 3.96712 0.146455 4.16237C-0.0488184 4.35763 -0.0488184 4.67419 0.146455 4.86946L2.80259 7.52556C2.99779 7.72081 3.31458 7.72067 3.5097 7.52556L9.85358 1.18169C10.0489 0.986435 10.0488 0.669853 9.85358 0.47458Z" fill="white" />
                </svg>
            </div>
            <p className={styles['check-box__title']}>{title}</p>
        </div>
    )
}
