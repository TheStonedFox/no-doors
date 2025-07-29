import React, { useEffect, useRef, useState } from 'react'
import styles from './Range.module.css'

import Input from '../../components/Input/Input'
import Button from '../../components/Button/Button'
export default function Range({ range, initValues }) {

    const isMousePressed = useRef(false)
    const activeController = useRef(null)

    const minController = document.querySelector('#min-controller')
    const maxController = document.querySelector('#max-controller')
    const selectedRange = document.querySelector('#selected-range')

    const componentWidth = selectedRange?.parentElement.clientWidth - 20
    const containerWidth = 1100

    const [min, setMin] = useState(0)
    const [max, setMax] = useState(componentWidth)

    const minPosition = useRef(0)
    const maxPosition = useRef(230)


    const [resultValues, setResultValues] = useState({ min: initValues?.min, max: initValues?.max })


    useEffect(() => {
        minPosition.current = componentWidth * (initValues?.min / range.max)
        maxPosition.current = componentWidth * (initValues?.max / range.max)

        setMin(componentWidth * (initValues?.min / range.max))
        setMax(componentWidth * (initValues?.max / range.max))
    }, [])


    useEffect(() => {
        setResultValues({
            min: Math.floor(((range.max - range.min) * ((minPosition.current / componentWidth * 100) / 100)) + range.min),
            max: Math.floor(((range.max - range.min) * ((maxPosition.current / componentWidth * 100) / 100)) + range.min),
        })
        // setResultValues({
        //     min: initValues.min,
        //     max: initValues.max
        // })
    }, [max, min])

    const onMouseDown = (e) => {
        isMousePressed.current = true

        if (e.target === minController)
            activeController.current = 'min'

        if (e.target === maxController)
            activeController.current = 'max'
    }

    const onMouseUp = () => {
        isMousePressed.current = false
        activeController.current = null
        selectedRange.style = `width: ${maxPosition - minPosition}px; left: ${minPosition}px`
    }

    const onMouseMove = (e) => {
        if (isMousePressed.current && e.clientX - (window.innerWidth - containerWidth) / 2 > 0 && activeController.current === 'min') {
            minPosition.current = e.clientX - (window.innerWidth - containerWidth) / 2
        }

        if (isMousePressed.current && e.clientX - (window.innerWidth - containerWidth) / 2 <= 230 && activeController.current === 'max') {
            maxPosition.current = e.clientX - (window.innerWidth - containerWidth) / 2
        }

        selectedRange.style = `width: ${maxPosition.current - minPosition.current}px; left: ${minPosition.current}px`

        if (isMousePressed) {
            setMax(maxPosition.current)
            setMin(minPosition.current)
        }

    }

    return (
        <div className={styles['range']} onMouseMove={(e) => onMouseMove(e)} onMouseLeave={() => isMousePressed.current = false}>
            <section className={styles['range__main-section']}>
                <span className={styles['range__line']}></span>
                <span id='selected-range' className={styles['range__selected-range']} style={{ width: max - min, left: `${min}px` }}></span>
                <span id='min-controller' className={`${styles['range__controller']} ${styles['range__min-controller']}`}
                    style={{ left: min }}
                    onMouseDown={(e) => onMouseDown(e)}
                    onMouseUp={(e) => onMouseUp(e)}>
                </span>
                <span id='max-controller' className={`${styles['range__controller']} ${styles['range__max-controller']}`}
                    style={{ left: max }}
                    onMouseDown={(e) => onMouseDown(e)}
                    onMouseUp={(e) => onMouseUp(e)}>
                </span>
            </section>
            <section className={styles['range__top-section']}>
                <Input className={styles['range__input']} value={resultValues.min} /> -
                <Input className={styles['range__input']} value={resultValues.max} />
                <Button className={styles['range__button']} title='ok' />
            </section>
        </div>
    )
}
