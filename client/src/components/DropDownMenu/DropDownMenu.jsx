import React, { useEffect } from 'react'

import styles from './DropDownMenu.module.css'
import DropDownItem from './DropDownItem/DropDownItem'

export default function DropDownMenu({ list, title }) {

    const func = () => {
        list && Object.entries(list).map((key, value) => {
            // if (typeof (value) === 'object')
            return <DropDownItem key={'value'} title='asdasd' />
        })
    }
    useEffect(() => {
        // for (const [key, value] of Object.entries(list || {}))
        //     console.log(`key: ${key}, value: ${value}`)


    }, [list])
    return (
        <div>
            <p>{title}</p>
            {
                list && Object.entries(list).map(([key, value]) => {
                    if (typeof (value) === 'object')
                        value.map(item => <p key={item}>adas</p>)
                })
            }
        </div>
    )
}
