import React, { useState } from 'react'

import styles from './Input.module.css'

export default function Input({ value, placeholder, type, onChange, id, className }) {

    const [active, setActive] = useState(false)

    return (
        <input id={id}
            className={`${styles['input']} ${className && className} ${active && styles['active']}`}
            value={value}
            placeholder={placeholder}
            type={type}
            onChange={(event) => {
                // onChange(event.target.value)

                // const digitsOnly = event.target.value.replace(/\D/g, '');
                // console.log(digitsOnly)
                onChange(event.target.value)
            }}
            onBlur={() => setActive(false)}
            onFocus={() => setActive(true)} />
    )
}
