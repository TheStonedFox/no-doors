import React from 'react'
import styles from './Counter.module.css'
import { useState } from 'react'

export default function Counter() {
    const [value, setValue] = useState(0)

    const handleInput = (e) => {
        if (Number(e.target.value) === 0) e.target.value = e.target.value.replace('0', '')

        e.target.value <= 99 ? setValue(e.target.value) : setValue(99)
        e.target.value < 0 && setValue(0)
    }

    const handleBlur = (e) => {
        e.target.parentElement.style = 'border: transparent 1px solid;'
        if (e.target.value === '') e.target.value = 0
    }

    const handleFocus = (e) => {
        e.target.parentElement.style = 'border: 1px solid var(--ui---main);'
        if (e.target.value === '0') e.target.value = ''
    }

    return (
        <div className={styles.div}>
            <button className={styles.counter__button} onClick={(e) => value > 0 && setValue(Number(e.target.parentElement.querySelector('input').value) - 1)}>-</button>
            <input className={styles.counter__input} type="number" value={value} onFocus={handleFocus} onBlur={handleBlur} onInput={handleInput} />
            <button className={styles.counter__button} onClick={(e) => value < 99 && setValue(Number(e.target.parentElement.querySelector('input').value) + 1)}>+</button>
        </div>
    )
}
