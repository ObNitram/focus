/**
 * @file IconButton.tsx
 * @description Generic component for an icon button.
 */

import React, { forwardRef } from "react";

import styles from 'styles/components/generic/buttons/iconButton.module.scss'

// Props of the component IconButton
export interface IconButtonProps {
    title: string;                                // Title of the button
    onClick: (event:React.MouseEvent) => void;    // Function to call when the button is clicked
    icon: React.ReactNode;                        // Icon to display in the button
    children?: React.ReactNode;                   // Children to display in the button
}

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>((props, ref) => {
    return (
        <button className={styles.icon_button} title={props.title} onClick={(e:React.MouseEvent) => props.onClick(e)} ref={ref}>
            {props.icon}
            {props.children}
        </button>
    )
})

export default IconButton
