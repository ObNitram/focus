import styles from 'styles/sidebar.module.scss'

import { useState } from 'react'

import { MdOutlineEditNote } from 'react-icons/md'
import { AiFillFolderAdd } from 'react-icons/ai'
import { TbSortDescending } from 'react-icons/tb'
import { VscCollapseAll, VscExpandAll } from 'react-icons/vsc'

import Dropdown, { DropdownItem } from '../../generic/Dropdown'

const { ipcRenderer } = window.require('electron')

const sortOrderItems = [
    {
        title: 'Name (A to Z)',
        selected: true,
        key: 'name-asc'
    },
    {
        title: 'Name (Z to A)',
        selected: false,
        key: 'name-desc'
    },
    {
        title: 'Modified date (newest first)',
        selected: false,
        key: 'modified-desc'
    },
    {
        title: 'Modified date (oldest first)',
        selected: false,
        key: 'modified-asc'
    },
    {
        title: 'Created date (newest first)',
        selected: false,
        key: 'created-desc'
    },
    {
        title: 'Created date (oldest first)',
        selected: false,
        key: 'created-asc'
    }
]

export interface TopBarProps {
    onCollapseAll: (collapse: boolean) => void
    onSortOrderChange: (item: DropdownItem) => void
}

export default function TopBar(props: TopBarProps) {
    const [collapsed, setCollapsed] = useState(true)
    const [changeSortOrderHidden, setChangeSortOrderHidden] = useState(true)

    function collapseOrExpandAll(collapse: boolean = !collapsed) {
        setCollapsed(collapse)
        props.onCollapseAll(collapse)
    }


    function handleCollapseAll() {
        collapseOrExpandAll()
    }

    function handleChangeSortOrder() {
        setChangeSortOrderHidden(!changeSortOrderHidden)
    }

    function handleCreateNote() {
        collapseOrExpandAll(true)
        ipcRenderer.send('create-note')
    }

    function handleCreateFolder() {
        collapseOrExpandAll(true)
        ipcRenderer.send('create-folder')
    }

    return (
        <div className={styles.sidebar_topbar}>
            <button title='Create new note' onClick={handleCreateNote}><MdOutlineEditNote/></button>
            <button title='Create new folder' onClick={handleCreateFolder}><AiFillFolderAdd/></button>
            <button title='Change sort order' onClick={handleChangeSortOrder} className={changeSortOrderHidden ? '' : styles.selected}><TbSortDescending/>
                <Dropdown items={sortOrderItems} hidden={changeSortOrderHidden} onItemSelect={props.onSortOrderChange}/>
            </button>
            <button title={collapsed ? 'Expand all' : 'Collapse all'} onClick={handleCollapseAll}>{collapsed ? <VscExpandAll/> : <VscCollapseAll/>}</button>
        </div>
    )
}
