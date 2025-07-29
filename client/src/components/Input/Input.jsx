import React, { useEffect, useState } from 'react'

import styles from './Input.module.css'

export default function Input({ value, placeholder, type, onChange, id, className, errorFrame }) {
    const [active, setActive] = useState(false)
    const [validationError, setValidationError] = useState(errorFrame || false)

    useEffect(() => setValidationError(errorFrame), [errorFrame])

    return (
        <input id={id} style={{ borderColor: validationError ? 'red' : null }}
            className={`${styles['input']} ${className && className} ${active && styles['active']}`}
            value={value !== null ? value : ''}
            placeholder={placeholder}
            type={type}
            onChange={(event) => {
                onChange(event.target.value)
            }}
            onBlur={() => setActive(false)}
            onFocus={() => {
                setActive(true)
                setValidationError(false)
            }} />
    )
}

