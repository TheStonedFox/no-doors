import { useEffect, useMemo, useRef, useState } from 'react'

import styles from './SuggestionInput.module.css'
import Input from '../Input/Input'

export default function SuggestionInput({ placeholder, optionsList, value, onValueSelect, errorFrame }) {

    const [inputValue, setInputValue] = useState(value || '')
    const [isFocus, setIsFocus] = useState(false)
    const [activeItem, setActiveItem] = useState(-1)

    const [visibleItems, setVisibleItems] = useState(20)
    const [scrollTop, setScrollTop] = useState(0)

    const optionsListRef = useRef(null)
    const lastSelectedValueRef = useRef(value)

    useEffect(() => {
        lastSelectedValueRef.current = value || ''
    }, [value])

    // useEffect(() => { lastSelectedValueRef.current = inputValue }, [inputValue])

    const scrollHandler = () => setScrollTop(optionsListRef.current.scrollTop)
    useEffect(() => {
        if (!optionsListRef.current) return

        if (visibleItems >= optionsList.length)
            return setVisibleItems(optionsList?.length)

        if (optionsListRef.current.scrollTop + optionsListRef.current.clientHeight >= optionsListRef.current.scrollHeight * 0.8)
            setVisibleItems(prev => prev + 20)

    }, [scrollTop, optionsList.length, optionsListRef])

    useEffect(() => {
        setVisibleItems(20)
        optionsListRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }, [optionsList])

    const onOptionSelect = (option) => {
        setInputValue(option)
        setIsFocus(false)
        onValueSelect(option)
        lastSelectedValueRef.current = option
    }

    const onInputTextChange = (val) => {
        setInputValue(val)
        setIsFocus(true)
    }

    const onListKeyDownPress = (e) => {
        if (e.key === 'ArrowDown')
            activeItem < optionsList.length && setActiveItem(prev => prev + 1)

        if (e.key === 'ArrowUp')
            activeItem > 0 && setActiveItem(prev => prev - 1)

        if (e.key === 'Enter') {
            const child = optionsListRef.current?.children[activeItem]
            child && onOptionSelect(child.innerText)
            setActiveItem(-1)
        }
    }

    useEffect(() => {
        for (let i = 0; i < optionsList.length; i++) {
            const child = optionsListRef.current?.children[i]
            if (child) {
                if (activeItem === i) {
                    child.style.backgroundColor = 'var(--ui---main)'
                    child.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
                }
                else {
                    child.style.backgroundColor = ''
                }
            }
        }
    }, [activeItem, optionsList?.length])

    const filteredList = useMemo(() => {
        const val = inputValue?.toLowerCase()
        const list = (optionsList ?? []).filter(o => o?.toLowerCase().includes(val))
        return list.sort((a, b) => {
            const aStarts = a.toLowerCase().startsWith(val)
            const bStarts = b.toLowerCase().startsWith(val)
            if (aStarts !== bStarts) return aStarts ? -1 : 1
            const ai = a.toLowerCase().indexOf(val)
            const bi = b.toLowerCase().indexOf(val)
            if (ai !== bi) return ai - bi
            return a.localeCompare(b)
        })
    }, [optionsList, inputValue])

    const onBlurHandle = () => {
        setIsFocus(false)
        setInputValue(lastSelectedValueRef.current)
    }

    return (
        <div className={styles['suggestion-input']} onClick={() => setIsFocus(true)} onBlur={onBlurHandle} onKeyDown={onListKeyDownPress} >
            <Input onChange={onInputTextChange} autocomplete={false} errorFrame={errorFrame} placeholder={placeholder} value={inputValue}
                className={isFocus && optionsList?.length && !optionsList?.includes(inputValue) && `${styles['border']}`} />

            <div className={styles['suggestion-input__options-box']} style={{ display: isFocus ? 'flex' : 'none' }}>
                <ul className={styles['suggestion-input__options']} ref={optionsListRef} onScroll={scrollHandler}>
                    {!optionsList.length && <li style={{ padding: '5px 15px' }}>Нет результатов</li>}

                    {filteredList.map((option, index) => {
                        return index < visibleItems &&
                            <li className={styles['suggestion-input__option']}
                                key={index}
                                id={index}
                                onMouseDown={() => onOptionSelect(option)}>{option}</li>
                    })}
                </ul>
            </div>
        </div>
    )
}
