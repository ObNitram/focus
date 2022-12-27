import React, { useEffect } from "react"

import styles from 'styles/dropdown.module.scss'

import { BsCheckLg } from 'react-icons/bs'

export interface DropdownItem {
    title: string,
    selected: boolean,
    key: string
}

export interface DropdownProps {
    items: DropdownItem[],
    onItemSelect: (item: DropdownItem) => void,
    hidden: boolean
}

export default function Dropdown(props: DropdownProps) {
    const [hidden, setHidden] = React.useState(true)
    const [items, setItems] = React.useState(props.items)

    useEffect(() => {
        setHidden(props.hidden)
    }, [props.hidden])

    const handleDropdownItemClick = (item: DropdownItem) => {
        return () => {
            props.onItemSelect(item)
            setHidden(true)

            // Update the selected item
            const newItems = props.items.map((i: DropdownItem) => {
                if (i.key === item.key) {
                    return {
                        ...i,
                        selected: true
                    }
                } else {
                    return {
                        ...i,
                        selected: false
                    }
                }
            })
            setItems(newItems)
        }
    }

    return (
        <ul className={`${styles.dropdown} ${hidden ? styles.hidden : ''}`}>
            {items.map((item: DropdownItem) => (
                <li key={item.key} onClick={handleDropdownItemClick(item)}>{item.selected ? <BsCheckLg/> : ''}{item.title}</li>
            ))}
        </ul>
    )
}
