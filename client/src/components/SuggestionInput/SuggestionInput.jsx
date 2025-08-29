import { useEffect, useRef, useState } from 'react'

import styles from './SuggestionInput.module.css'
import Input from '../Input/Input'

export default function SuggestionInput({ placeholder, optionsList, onChange, value, errorFrame }) {
    const [inputValue, setInputValue] = useState('')
    const [isFocus, setIsFocus] = useState(false)

    const [activeItem, setActiveItem] = useState(0)

    // useEffect(() => console.log(inputValue), [inputValue])

    const handleChange = (val) => {
        setInputValue(val)
        onChange?.(val) // пробрасываем наверх
    }

    //  const regex = new RegExp(`^${inputValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\w*`, 'i')

    const scrollHandler = () => setScrollTop(optionsListRef.current.scrollTop)
    const [scrollTop, setScrollTop] = useState(0)
    const [visibleItems, setVisibleItems] = useState(20)
    const optionsListRef = useRef(null)

    useEffect(() => {
        if (scrollTop / optionsListRef.current.scrollHeight > 0.8 && visibleItems < optionsList?.length)
            return setVisibleItems(prev => prev + 20)

        setVisibleItems(optionsList?.length)
    }, [scrollTop])

    useEffect(() => {
        setVisibleItems(20)
        optionsListRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }, [optionsList])

    return (
        <div
            className={styles['suggestion-input']}
            onClick={() => setIsFocus(true)}
            onBlur={() => setIsFocus(false)}
            onChange={() => inputValue}
        >
            <Input onChange={handleChange} errorFrame={errorFrame} placeholder={placeholder} value={inputValue || value}
                style={{ backgroundColor: 'red' }}
                className={isFocus && optionsList?.length && !optionsList?.includes(inputValue) && `${styles['border']}`}
            />
            <div className={styles['suggestion-input__options-box']} style={{ display: isFocus ? 'flex' : 'none' }} id='box'>
                <ul className={styles['suggestion-input__options']} id='list' ref={optionsListRef} onScroll={scrollHandler}>
                    {/* {optionsList?.filter(option => regex.test(option) && option !== inputValue).map((option, index) => { */}
                    {optionsList?.map((option, index) => {
                        return index < visibleItems && <li
                            className={styles['suggestion-input__option']}
                            key={index}
                            id={index}
                            onMouseDown={() => {
                                setInputValue(option)
                                onChange(option)
                                setIsFocus(false)
                            }
                            }>{option}</li>
                    })}
                </ul>
            </div>
        </div>
    )
}
