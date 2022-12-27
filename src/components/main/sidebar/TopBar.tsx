import styles from 'styles/sidebar.module.scss'

import { useState } from 'react'

import { MdOutlineEditNote } from 'react-icons/md'
import { AiFillFolderAdd } from 'react-icons/ai'
import { TbSortDescending } from 'react-icons/tb'
import { VscCollapseAll, VscExpandAll } from 'react-icons/vsc'

const { ipcRenderer } = window.require('electron')

export interface TopBarProps {
    onCollapseAll: () => void
}

export default function TopBar(props: TopBarProps) {
    const [collapsed, setCollapsed] = useState(true)

    function handleCollapseAll() {
        props.onCollapseAll()
        setCollapsed(!collapsed)
    }

    return (
        <div className={styles.sidebar_topbar}>
            <button title='Create new note'><MdOutlineEditNote/></button>
            <button title='Create new folder'><AiFillFolderAdd/></button>
            <button title='Change sort order'><TbSortDescending/></button>
            <button title={collapsed ? 'Expand all' : 'Collapse all'} onClick={handleCollapseAll}>{collapsed ? <VscExpandAll/> : <VscCollapseAll/>}</button>
        </div>
    )
}
