/**
 * @file TopBar.tsx
 * @description Top bar of the sidebar. Contains the buttons to create a note, create a folder, sort the files and folders, collapse or expand all folders.
 */
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

// Sort order items. Used to create the dropdown of the sort order button
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

// Props of the component TopBar
export interface TopBarProps {
    onCollapseAll: (collapse: boolean) => void
    onSortOrderChange: (item: DropdownItem) => void
    onHiddenBar: () => void
    isHidden: boolean
}

export default function TopBar(props: TopBarProps) {
    const [collapsed, setCollapsed] = useState(true) // If the folders are collapsed or not
    const [changeSortOrderHidden, setChangeSortOrderHidden] = useState(true) // If the dropdown of the sort order button is hidden or not

    const changeSortOrderButtonRef = useRef<HTMLButtonElement>(null) // Reference to the sort order button

    const selectionedItem = useContext(SelectedFilesContext) // Selected files context

    /**
     * @description Called when the the selectionedItem context changes. 
                    Adds a click event listener to the document to hide the dropdown of the sort order button when the user clicks outside of it.
     */
    useEffect(() => {
        document.addEventListener('click', clickOutside)
        
        return () => {
            document.removeEventListener('click', clickOutside)
        }
    }, [selectionedItem])

    /**
     * @description Use for collapsing or expanding all folders. Change state of the folders and call the onCollapseAll function of the props.
     * @param collapse If the folders should be collapsed or expanded. If not specified, the folders will be collapsed if they are expanded and expanded if they are collapsed.
     */
    function collapseOrExpandAll(collapse: boolean = !collapsed) {
        setCollapsed(collapse)
        props.onCollapseAll(collapse)
    }

    /**
     * @description Called when the user clicks on the collapse all button. Collapse or expand all folders.
     * @param event: React.MouseEvent The event of the click
     */
    function handleCollapseAll(event:React.MouseEvent) {
        event.stopPropagation()
        collapseOrExpandAll()
    }

    /**
     * @description Called when the user clicks on the sort order button. Change state.
     * @param event: React.MouseEvent The event of the click
     */
    function handleChangeSortOrder(event:React.MouseEvent) {
        event.stopPropagation()
        setChangeSortOrderHidden(!changeSortOrderHidden)
    }

    /**
     * @description Called when the user clicks on the create note button. 
                    If a folder is selected, create a note in this folder. 
                    If no folder is selected, create a note in the root folder. Send a message to the main process to create the note.
     * @param event: React.MouseEvent The event of the click
     */
    function handleCreateNote(event:React.MouseEvent) {
        event.stopPropagation()
        // collapseOrExpandAll(true)
        if(selectionedItem?.[0].length == 1 && !selectionedItem[0][0].endsWith('.md')) {
            ipcRenderer.send('create-note', selectionedItem[0][0])
        }else if(selectionedItem?.[0].length == 0) {
            ipcRenderer.send('create-note')
        }
    }

    /**
     * @description Called when the user clicks on the create folder button.
                    If a folder is selected, create a folder in this folder.
                    If no folder is selected, create a folder in the root folder. Send a message to the main process to create the folder.
     * @param event: React.MouseEvent The event of the click
     */
    function handleCreateFolder(event:React.MouseEvent) {
        event.stopPropagation()
        // collapseOrExpandAll(true)
        if(selectionedItem?.[0].length == 1 && !selectionedItem[0][0].endsWith('.md')) {
            ipcRenderer.send('create-folder', selectionedItem[0][0])
        }else if(selectionedItem?.[0].length == 0) {
            ipcRenderer.send('create-folder')
        }
    }

    /**
     * @description Called when the user clicks outside of the dropdown of the sort order button. Hide the dropdown.
     * @param e: React.MouseEvent The event of the click
     */
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
