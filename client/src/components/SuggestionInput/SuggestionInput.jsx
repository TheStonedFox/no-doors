import React, { useEffect, useState } from 'react'

import styles from './SuggestionInput.module.css'
import Input from '../Input/Input'

export default function SuggestionInput({ placeholder, optionsList }) {
    const [inputValue, setInputValue] = useState('')
    const [isFocus, setIsFocus] = useState(false)

    const [activeItem, setActiveItem] = useState(0)

    const regex = new RegExp(`^${inputValue}\\w*`, 'i');

    return (
        <div className={styles['suggestion-input']} onClick={() => setIsFocus(true)} onBlur={() => setIsFocus(false)} onKeyDown={(event) => {

            event.currentTarget.querySelector('#list').querySelectorAll('li').forEach(li => {
                li.style = ''
            })

            const listItems = event.currentTarget.querySelector('#list').querySelectorAll('li');
            if (event.key === 'ArrowDown' && activeItem < event.currentTarget.querySelector('#list').querySelectorAll('li').length - 1) {
                setActiveItem(prevActiveItem => {
                    const newItem = prevActiveItem + 1;
                    // Не забывай проверку на границы, чтобы не выйти за пределы массива
                    // listItems[prevActiveItem].style.backgroundColor = ''; // Убираем старое выделение
                    listItems[newItem].style.backgroundColor = 'red'; // Подсвечиваем новый элемент
                    return newItem;
                });
            }

            if (event.key === 'ArrowUp' && activeItem !== 0) {
                setActiveItem(prevActiveItem => {
                    const newItem = prevActiveItem - 1;
                    // Проверяем, что не уходим за границу массива
                    if (newItem >= 0) {
                        // listItems[prevActiveItem].style.backgroundColor = ''; // Убираем старое выделение
                        listItems[newItem].style.backgroundColor = 'red'; // Подсвечиваем новый элемент
                    }
                    return newItem;
                });
            }

            console.log(activeItem)
            if (event.key === 'Enter')
                setInputValue(listItems[activeItem].innerText)

        }}>
            <Input placeholder={placeholder} onChange={(value) => setInputValue(value)} value={inputValue} />
            <div className={styles['suggestion-input__options-box']} style={{ display: isFocus ? 'flex' : 'none' }} id='box'>
                <ul className={styles['suggestion-input__options']} id='list'>
                    {optionsList?.filter(option => regex.test(option) && option !== inputValue).map((option, index) => {
                        return <li key={index} id={index} className={styles['suggestion-input__option']} onMouseDown={() => {
                            setInputValue(option)
                            setIsFocus(false)
                        }
                        }>{option}</li>
                    })}

                </ul>
            </div>
        </div>
    )
}
