import React, { useState } from 'react'

import styles from './Input.module.css'

export default function Input({ value, placeholder, type, onChange, className }) {

    const [active, setActive] = useState(false)

    return (
        <input
            className={`${styles['input']} ${className && className} ${active && styles['active']}`}
            value={value}
            placeholder={placeholder}
            type={type}
            onChange={(event) => {
                // onChange(event.target.value)

                const digitsOnly = event.target.value.replace(/\D/g, '');
                console.log(digitsOnly)
                onChange(digitsOnly)
            }}
            onBlur={() => setActive(false)}
            onFocus={() => setActive(true)} />
    )
}
