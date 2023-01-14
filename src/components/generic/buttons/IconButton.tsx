import React, { forwardRef } from "react";

import styles from 'styles/components/generic/buttons/iconButton.module.scss'

export interface IconButtonProps {
    title: string;
    onClick: (event:React.MouseEvent) => void;
    icon: React.ReactNode;
    children?: React.ReactNode;
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
