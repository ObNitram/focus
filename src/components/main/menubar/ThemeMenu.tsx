import styles from 'styles/components/main/menubar.module.scss'


import { useState } from "react"
import { AiOutlineCheck } from "react-icons/ai"

type ThemeMenuProps = {
    themes: {name:string, css:string}[]|null,
    selectedTheme: string,
    isUnrolled: boolean,
    displayManageTheme: (bool: boolean) => void,
    displayThemeGenerator: boolean
}

export function ThemeMenu(this:any, props:ThemeMenuProps){

    const handleDisplayThemeGenerator = (e:React.MouseEvent) => {
        e.preventDefault()
        if(!props.displayThemeGenerator){
            props.displayManageTheme(true);
        }
    }

    return (
        <div className={styles.menuItem}>
            <p>Themes</p>
            {props.themes != null && (
            <div className={`${styles.subMenu} ${props.displayThemeGenerator && styles.unavailable}`} style={props.isUnrolled ? {display: 'block'} : {display: 'none'}}>
                <ul>
                    {props.themes.map((value: { name: string; css: string; }) => {
                        return (<li key={value.name}>
                                    {value.name}
                                    {value.name == props.selectedTheme && <AiOutlineCheck/>}
                                </li>)
                    })}
                    <div className={styles.separator}></div>
                    <li onClick={(e) => handleDisplayThemeGenerator(e)}>Manage Themes</li>
                </ul>
            </div>
            )}
        </div>
    )
}