import styles from 'styles/components/main/menubar.module.scss'


import { useState } from "react"
import { AiOutlineCheck } from "react-icons/ai"

type ThemeMenuProps = {
    themes: {name:string, css:string}[]|null,
    selectedTheme: string,
    isUnrolled: boolean,
    displayManageTheme: (bool: boolean) => void
}

export function ThemeMenu(this:any, props:ThemeMenuProps){
    return (
        <div className={styles.menuItem}>
            <p>Themes</p>
            {props.themes != null && (
            <div className={styles.subMenu} style={props.isUnrolled ? {display: 'block'} : {display: 'none'}}>
                <ul>
                    {props.themes.map((value: { name: string; css: string; }) => {
                        return (<li key={value.name}>
                                    {value.name}
                                    {value.name == props.selectedTheme && <AiOutlineCheck/>}
                                </li>)
                    })}
                    <div className={styles.separator}></div>
                    <li onClick={() => props.displayManageTheme(true)}>Manage Themes</li>
                </ul>
            </div>
            )}
        </div>
    )
}