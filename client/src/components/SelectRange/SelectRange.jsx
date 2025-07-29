import React, { useEffect, useRef, useState } from 'react'
import styles from './SelectRange.module.css'

import Input from '../../components/Input/Input'
import Button from '../../components/Button/Button'

export default function SelectRange({ range, initValues }) {

    const { min: rangeMin, max: rangeMax } = range || {}
    const { min: initMin, max: intiMax } = initValues || {}
    const [width, setWidth] = useState(0)

    const isMousePressed = useRef(false)
    const minControllerPosition = useRef(initValues ? width * ((rangeMax / initMin) / 10) : 0)
    const maxControllerPosition = useRef(initValues ? width * ((rangeMax / intiMax) / 10) : width)
    const activeController = useRef(null)

    const container = useRef(null)
    useEffect(() => {
        if (!container.current) return

        const observer = new ResizeObserver(([entry]) => {
            setWidth(entry.contentRect.width)
        })

        observer.observe(container.current)

        // инициализация, если ResizeObserver не сработает мгновенно
        setWidth(container.current.offsetWidth)

        return () => observer.disconnect()
    }, [])


    useEffect(() => { console.log(width) }, [width])

    const [controllerPositions, setControllerPositions] = useState({ min: minControllerPosition.current, max: maxControllerPosition.current })
    const [inputValues, setInputValues] = useState({ min: initMin ? initMin : rangeMin, max: intiMax ? intiMax : rangeMax })

    const onMouseMove = (e) => {
        if (isMousePressed.current && activeController.current === 'min') {
            e.clientX - e.currentTarget.parentElement.offsetLeft - 10 >= 0 ? minControllerPosition.current = e.clientX - e.currentTarget.parentElement.offsetLeft - 10 : 0
            setControllerPositions(prev => ({ ...prev, min: minControllerPosition.current }))
        }

        if (isMousePressed.current && activeController.current === 'max') {
            e.clientX - e.currentTarget.parentElement.offsetLeft - 10 < width ? maxControllerPosition.current = e.clientX - e.currentTarget.parentElement.offsetLeft - 10 : width
            setControllerPositions(prev => ({ ...prev, max: maxControllerPosition.current }))
        }
    }

    useEffect(() => {
        setInputValues({
            min: Math.floor(rangeMin + (rangeMax - rangeMin) * (controllerPositions.min / width)),
            max: Math.floor(rangeMin + (rangeMax - rangeMin) * (controllerPositions.max / width))
        })
    }, [controllerPositions, rangeMin, rangeMax, width])

    useEffect(() => {
        minControllerPosition.current = (initMin / rangeMax) * width
        maxControllerPosition.current = (intiMax / rangeMax) * width
        setControllerPositions({ min: minControllerPosition.current, max: maxControllerPosition.current })
    }, [rangeMax, initMin, intiMax, width])

    return (
        <div className={styles['select-range']} onMouseMove={onMouseMove} onMouseLeave={() => isMousePressed.current = false} ref={container}>
            <section className={styles['select-range__main-section']}>
                <span className={styles['main-section__full-range']}></span>
                <span className={styles['main-section__selected-range']} style={{ left: controllerPositions.min, width: controllerPositions.max - controllerPositions.min }}></span>
                <span
                    className={`${styles['main-section__controller']} ${styles['main-section__min-controller']}`}
                    style={{ left: controllerPositions.min }}
                    onMouseDown={() => {
                        activeController.current = 'min'
                        isMousePressed.current = true
                    }}
                    onMouseUp={() => {
                        activeController.current = null
                        isMousePressed.current = false
                    }}
                ></span>
                <span
                    className={`${styles['main-section__controller']} ${styles['main-section__max-controller']}`}
                    style={{ left: controllerPositions.max }}
                    onMouseDown={(e) => {
                        activeController.current = 'max'
                        isMousePressed.current = true
                    }}
                    onMouseUp={() => {
                        activeController.current = null
                        isMousePressed.current = false
                    }}
                ></span>
            </section>
            <section className={styles['select-range__values-section']}>
                <div>
                    <input type="number" placeholder='От...' onBlur={(e) => {
                        // setControllerPositions(prev => ({ ...prev, max: width * ((e.target.value / (rangeMax - rangeMin))) }))
                    }} />
                    <input type="number" placeholder='До...' value={inputValues.max} onBlur={(e) => {
                        // setControllerPositions(prev => ({ ...prev, max: width * ((e.target.value / (rangeMax - rangeMin))) }))
                    }} />
                </div>
                <Button className={styles['values-section__button']} title='ок' />
            </section>
        </div>
    )
}
