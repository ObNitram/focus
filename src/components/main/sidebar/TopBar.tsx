import styles from 'styles/components/main/sidebar.module.scss'

import React, { useContext, useEffect, useRef, useState } from 'react'

import { MdOutlineEditNote } from 'react-icons/md'
import { AiFillFolderAdd } from 'react-icons/ai'
import { TbSortDescending } from 'react-icons/tb'
import { VscCollapseAll, VscExpandAll } from 'react-icons/vsc'
import { BiChevronsLeft, BiChevronsRight} from 'react-icons/bi'

import Dropdown, { DropdownItem } from '../../generic/Dropdown'
import IconButton from '../../generic/buttons/IconButton'
import { SelectedFilesContext } from '@/context/selectedFilesContext'

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
    onHiddenBar: () => void
    isHidden: boolean
}

export default function TopBar(props: TopBarProps) {
    const [collapsed, setCollapsed] = useState(true)
    const [changeSortOrderHidden, setChangeSortOrderHidden] = useState(true)

    const changeSortOrderButtonRef = useRef<HTMLButtonElement>(null)

    const selectionedItem = useContext(SelectedFilesContext)

    useEffect(() => {
        document.addEventListener('click', clickOutside)
        
        return () => {
            document.removeEventListener('click', clickOutside)
        }
    }, [selectionedItem])

    function collapseOrExpandAll(collapse: boolean = !collapsed) {
        setCollapsed(collapse)
        props.onCollapseAll(collapse)
    }


    function handleCollapseAll(event:React.MouseEvent) {
        event.stopPropagation()
        collapseOrExpandAll()
    }

    function handleChangeSortOrder(event:React.MouseEvent) {
        event.stopPropagation()
        setChangeSortOrderHidden(!changeSortOrderHidden)
    }

    function handleCreateNote(event:React.MouseEvent) {
        event.stopPropagation()
        // collapseOrExpandAll(true)
        if(selectionedItem?.[0].length == 1 && !selectionedItem[0][0].endsWith('.md')) {
            ipcRenderer.send('create-note', selectionedItem[0][0])
        }else if(selectionedItem?.[0].length == 0) {
            ipcRenderer.send('create-note')
        }
    }

    function handleCreateFolder(event:React.MouseEvent) {
        event.stopPropagation()
        // collapseOrExpandAll(true)
        if(selectionedItem?.[0].length == 1 && !selectionedItem[0][0].endsWith('.md')) {
            ipcRenderer.send('create-folder', selectionedItem[0][0])
        }else if(selectionedItem?.[0].length == 0) {
            ipcRenderer.send('create-folder')
        }
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
            <IconButton title='Hide sidebar' icon={props.isHidden? <BiChevronsRight/> :<BiChevronsLeft/>} onClick={props.onHiddenBar} />
        </div>
    )
}
