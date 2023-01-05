import styles from 'styles/components/main/sidebar.module.scss'

import { useEffect, useRef, useState } from 'react'

import { MdOutlineEditNote } from 'react-icons/md'
import { AiFillFolderAdd } from 'react-icons/ai'
import { TbSortDescending } from 'react-icons/tb'
import { VscCollapseAll, VscExpandAll } from 'react-icons/vsc'

import Dropdown, { DropdownItem } from '../../generic/Dropdown'
import IconButton from '../../generic/buttons/IconButton'

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

    const changeSortOrderButtonRef = useRef<HTMLButtonElement>(null)

    useEffect(() => {
        document.addEventListener('click', clickOutside)
    }, [])

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

    const clickOutside = (e: MouseEvent) => {
        if (changeSortOrderButtonRef.current && !changeSortOrderButtonRef.current.contains(e.target as Node)) {
            setChangeSortOrderHidden(true)
        }
    }

    return (
        <div className={styles.sidebar_topbar}>
            <IconButton title='Create new note' onClick={handleCreateNote} icon={<MdOutlineEditNote/>}/>
            <IconButton title='Create new folder' onClick={handleCreateFolder} icon={<AiFillFolderAdd/>}/>
            <IconButton title='Change sort order' onClick={handleChangeSortOrder} icon={<TbSortDescending/>} ref={changeSortOrderButtonRef}>
                <Dropdown items={sortOrderItems} hidden={changeSortOrderHidden} onItemSelect={props.onSortOrderChange} displaySelectionIndicator={true}/>
            </IconButton>
            <IconButton title={collapsed ? 'Expand all' : 'Collapse all'} onClick={handleCollapseAll} icon={collapsed ? <VscExpandAll/> : <VscCollapseAll/>}></IconButton>
        </div>
    )
}
