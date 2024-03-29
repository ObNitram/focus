/**
 * @file MenuBar.tsx
 * @description Component representing the top bar of the app
 */
import styles from 'styles/components/main/menubar.module.scss'

import {useState} from 'react'

import {IoClose} from 'react-icons/io5'
import {BiSquare} from 'react-icons/bi'
import {IoRemove} from 'react-icons/io5'
import React from 'react'
import { ipcRenderer } from 'electron'
import { ThemeMenu } from './ThemeMenu'

//Type of the props of menubar
type MenuBarProps = {
    themes: {name:string, css:string}[]|null,
    selectedTheme:string,
    displayManageTheme: (bool: boolean) => void,
    displayThemeGenerator: boolean,
    setSelectedTheme: (theme:string) => void
}

export default function MenuBar(props: MenuBarProps) {
    const [themeUnroll, setThemeUnroll] = useState<boolean>(false) // Used to know if the theme menu is unrolled

    /**
     * @description Called when the user click on the close button, send a message to the main process to close the app
     * @param e React.MouseEvent
     */
    const onClickClose = (e:React.MouseEvent) => {
        ipcRenderer.send('closeApp')
    }

    /**
     * @description Called when the user click on the maximize button, send a message to the main process to maximize the app
     * @param e React.MouseEvent
     */
    const onClickMaximize = (e:React.MouseEvent) => {
        ipcRenderer.send('maximizeWindow')
    }

    /**
     * @description Called when the user click on the hide button, send a message to the main process to hide the app
     * @param e React.MouseEvent
     */
    const onClickHide = (e:React.MouseEvent) => {
        ipcRenderer.send('hideWindow')
    }

    return(
        <div className={styles.menubar}>
            <div className={styles.menu_contenair}>
                <img src='./electron.png' title='Logo of Electron'/>
                <ul className={styles.listMenu}>
                    <li onClick={() => setThemeUnroll(!themeUnroll)}>
                        <ThemeMenu themes={props.themes} selectedTheme={props.selectedTheme} isUnrolled={themeUnroll} displayManageTheme={props.displayManageTheme} displayThemeGenerator={props.displayThemeGenerator} setSelectedTheme={props.setSelectedTheme}/>
                    </li>
                </ul>
            </div>
            <div className={styles.window_button_contenair}>
                <IoRemove size={20} className={styles.icons} onClick={(e:React.MouseEvent) => onClickHide(e)}/>
                <BiSquare size={17} className={styles.icons} onClick={(e:React.MouseEvent) => onClickMaximize(e)}/>
                <IoClose size={20} className={styles.icons} onClick={(e:React.MouseEvent) => onClickClose(e)}/>
            </div>
        </div>
    )
}
