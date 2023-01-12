import styles from 'styles/components/main/menubar.module.scss'

import {IoClose} from 'react-icons/io5'
import {BiSquare} from 'react-icons/bi'
import {AiOutlinePlusSquare} from 'react-icons/ai'
import {IoRemove} from 'react-icons/io5'
import React from 'react'
import { ipcRenderer } from 'electron'

export default function MenuBar(props: any) {

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
            <div className={styles.window_button_contenair}>
                <IoRemove size={20} className={styles.icons} onClick={(e:React.MouseEvent) => onClickHide(e)}/>
                <BiSquare size={17} className={styles.icons} onClick={(e:React.MouseEvent) => onClickMaximize(e)}/>
                <IoClose size={20} className={styles.icons} onClick={(e:React.MouseEvent) => onClickClose(e)}/>
            </div>
        </div>
    )
}