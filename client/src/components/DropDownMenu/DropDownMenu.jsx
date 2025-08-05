import React, { useEffect, useState } from 'react'
import styles from './DropDownMenu.module.css'
import { useNavigate } from 'react-router-dom'
import { IoChevronBackOutline } from "react-icons/io5"
import deviceTypesEnTitles from '../../utils/deviceTypeEnTitle'

export default function DropDownMenu({ title, deviceTypes, brandModels, categories, className }) {
    const [deviceType, setDeviceType] = useState()
    const [model, setModel] = useState()
    const [subtitle, setSubtitle] = useState(title)
    const [step, setStep] = useState('')

    const resetValues = () => {
        setStep('')
        setSubtitle(title)
        setModel()
        setDeviceType()
    }

    const onDropDownTitleClick = () => {

        if (step === 'model') {
            setDeviceType(null)
            setStep('type')
            setSubtitle(title)
        }

        if (step === 'category') {
            setModel(null)
            setStep('model')
            setSubtitle(deviceTypesEnTitles[deviceType])
        }

        if (step === 'type') setStep('')

        if (step === 'brand') setStep('close')

        if (step === '') setStep('type')

    }
    const negative = useNavigate()
    return (
        <div className={`${styles['dropdown-menu']} ${step !== '' ? styles['open-drop-down'] : null} dropdown`}
            onMouseEnter={() => {
                if (step === '') setStep('type')
                // document.querySelectorAll('.dropdown').forEach(dropdown => {
                //     // dropdown.classList.remove(styles['open-drop-down'])
                // })
            }} onMouseLeave={() => {
                // if (step === 'type') 
                setStep('')
                resetValues()
            }}>
            <section className={styles['dropdown-menu__title']} onClick={() => onDropDownTitleClick()}>
                {step !== 'brand' && <IoChevronBackOutline
                    style={{ transform: step === 'type' ? 'rotate(90deg)' : 'rotate(0deg)', transition: '0.2s' }} />}
                <p>{subtitle}</p>
            </section>

            <div className={styles['dropdown-menu__content']}>
                {deviceTypes && <section className={styles['dropdown-menu__list']} style={{ height: deviceType ? '0px' : '100%' }}>
                    {deviceTypes?.map(dt => <p
                        key={dt}
                        className={styles['dropdown-menu__device-type-item']}
                        onClick={() => {
                            setDeviceType(dt)
                            setSubtitle(deviceTypesEnTitles[dt])
                            setStep('model')
                        }}>{deviceTypesEnTitles[dt]}</p>)}
                </section>}

                {deviceType && <section className={styles['dropdown-menu__list']} style={{ height: model ? '0px' : '100%' }}>
                    {brandModels[deviceType]?.map(model => <p
                        key={model.title}
                        className={styles['dropdown-menu__device-model-item']}
                        onClick={() => {
                            setModel(model.title)
                            setSubtitle(model.title)
                            setStep('category')
                        }}
                    >{model.title}</p>)}
                </section>}

                {model && <section className={`${styles['dropdown-menu__list']}`}>
                    {categories && categories?.map(category => <p
                        key={category}
                        className={styles['dropdown-menu__category-item']}
                        onClick={() => {
                            negative(`search?brand=${title}&model=${model}&category=${category}&deviceType=${deviceTypesEnTitles[deviceType]}`)
                            resetValues()
                        }}>{category}</p>)}
                </section>}

            </div>

        </div >
    )
}
