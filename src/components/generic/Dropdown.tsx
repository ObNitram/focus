/**
 * @file Dropdown.tsx
 * @description Generic component for a dropdown.
 */

import React, { useEffect } from "react"

import styles from 'styles/components/generic/dropdown.module.scss'

import { BsCheckLg } from 'react-icons/bs'

export interface DropdownItem {
    title: string,           // Title of the item
    selected?: boolean,      // Whether the item is selected
    key: string              // Unique key for the item
}

export interface DropdownProps {
    items: DropdownItem[],                        // Items to display in the dropdown
    displaySelectionIndicator?: boolean,          // Whether to display a selection indicator
    onItemSelect: (item: DropdownItem) => void,   // Function to call when an item is selected
    hidden: boolean                               // Whether the dropdown is hidden
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

            if (!props.displaySelectionIndicator) {
                return
            }

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
                <li key={item.key} onClick={handleDropdownItemClick(item)}>{item.title}{item.selected ? <BsCheckLg/> : ''}</li>
            ))}
        </ul>
    )
}
