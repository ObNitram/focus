import styles from 'styles/components/main/menubar.module.scss'

import {useState} from 'react'

import {IoClose} from 'react-icons/io5'
import {BiSquare} from 'react-icons/bi'
import {AiOutlinePlusSquare} from 'react-icons/ai'
import {IoRemove} from 'react-icons/io5'
import React from 'react'
import { ipcRenderer } from 'electron'
import { ThemeMenu } from './ThemeMenu'

type MenuBarProps = {
    themes: {name:string, css:string}[]|null,
    selectedTheme:string,
    displayManageTheme: (bool: boolean) => void
}

export default function MenuBar(props: MenuBarProps) {
    const [themeUnroll, setThemeUnroll] = useState<boolean>(false)

    const onClickClose = (e:React.MouseEvent) => {
        ipcRenderer.send('closeApp')
    }

    const onClickMaximize = (e:React.MouseEvent) => {
        ipcRenderer.send('maximizeWindow')
    }

    const onClickHide = (e:React.MouseEvent) => {
        ipcRenderer.send('hideWindow')
    }

    return(
        <div className={styles.menubar}>
            <div className={styles.menu_contenair}>
                <img src="/electron.png" alt="Logo of Focus"/>
                <ul className={styles.listMenu}>
                    <li onClick={() => setThemeUnroll(!themeUnroll)}>
                        <ThemeMenu themes={props.themes} selectedTheme={props.selectedTheme} isUnrolled={themeUnroll} displayManageTheme={props.displayManageTheme}/>
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