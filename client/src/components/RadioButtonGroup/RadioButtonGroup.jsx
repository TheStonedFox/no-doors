import { useEffect } from 'react'
import { useState } from 'react'

import styles from './RadioButtonGroup.module.css'


export default function RadioButtonGroup({ options, className, onSelect }) {
    const [selectedOption, setSelectedOption] = useState(0)

    useEffect(() => onSelect && onSelect(selectedOption), [selectedOption])
    return (
        <div className={`${styles['radio-buttons-group']} ${className ? className : null}`}>
            {options.map((option, index) => <div id={index} className={styles['radio-buttons-group__option']} key={index} onClick={() => {
                setSelectedOption(index)

            }}>
                <div className={`${styles['option__check']} ${index === selectedOption ? styles['active'] : null}`}></div>
                <p className={styles['option__title']}>{option}</p>
                <div className={styles.class__name}></div>
            </div>)}
        </div>
    )
}


