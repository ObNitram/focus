import { ipcRenderer } from "electron";
import React, { useContext, useEffect, useRef } from "react";
import {gsap} from 'gsap'
import styles from 'styles/components/main/sidebar.module.scss'

import { SelectedFilesContext } from "@/context/selectedFilesContext";

import Dropdown from '../../generic/Dropdown'

export interface FileListItemProps {
    item: any;
    folderToExpand: string | null; // this is the path of the folder to expand (used when creating a new note or folder)
    collapsedAll: boolean | null;  // this is used when collapsing/expanding all folders
    renaming: boolean;
}

export default function FileListItem(this: any, props: FileListItemProps) {
    const [item, setItem] = React.useState(props.item);
    const [folderToExpand, setFolderToExpand] = React.useState<string | null>(null);
    const [dirCollapsed, setDirCollapsed] = React.useState<boolean | null>(true);
    const [dirCollapsedAll, setDirCollapsedAll] = React.useState<boolean | null>(null);
    const [renaming, setRenaming] = React.useState(false);
    const [dropdownHidden, setDropdownHidden] = React.useState(true);

    const [dragOver, setDragOver] = React.useState(false);

    const refItem = useRef<HTMLDivElement>(null);
    const refSubList = useRef<HTMLUListElement>(null)

    let selectedFilesContext = useContext(SelectedFilesContext);


    const dropdownRightClickCommonItems = [
        {
            title: 'Rename',
            selected: false,
            key: 'rename'
        },
        {
            title: 'Delete',
            selected: false,
            key: 'delete'
        },
        {
            title: 'Show in Explorer',
            selected: false,
            key: 'show-in-explorer'
        }
    ]

    const dropdownRightClickFolderItems = [...dropdownRightClickCommonItems,
    {
        title: 'Create note',
        selected: false,
        key: 'create-note'
    },
    {
        title: 'Create folder',
        selected: false,
        key: 'create-folder'
    },
    {
        title: 'Select all children',
        selected: false,
        key: 'select-all-child'
    }
    ]

    useEffect(() => {
        setItem(props.item);
    }, [])

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown)
        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [selectedFilesContext])
    
    
    useEffect(() => {
        if (props.folderToExpand !== null) {
            setFolderToExpand(props.folderToExpand);
            
            if (props.folderToExpand === item.path) {
                setDirCollapsed(false);
            }
        }
        else if (props.collapsedAll !== null) {
            setDirCollapsedAll(props.collapsedAll);
            setDirCollapsed(props.collapsedAll);
        }
        // if(dirCollapsed != null && dirCollapsed !== false){
            //     console.log(item.name + 'is collapased!');
            
        // }
        
        // Event listeners
        document.addEventListener('click', handleClickOutside);
        document.addEventListener('keydown', handleEnterKeyPressed);
        document.addEventListener('contextmenu', handleRightClick);
        document.addEventListener('drop', handleDrop);

        return () => {
            document.removeEventListener('click', handleClickOutside);
            document.removeEventListener('keydown', handleEnterKeyPressed);
            document.removeEventListener('contextmenu', handleRightClick);
            document.removeEventListener('drop', handleDrop);
        }
    }, [item, props.collapsedAll, props.folderToExpand, dropdownHidden])

    const handleKeyDown = (event:KeyboardEvent) => {
        if(event.key == 'F2'){
            console.log('f2')
            console.log('selected is ' +selectedFilesContext?.[0])
            console.log('item path is ' + item.path)
            if(selectedFilesContext?.[0].length == 1 && selectedFilesContext?.[0][0] == item.path){
                console.log('je dois rename')
                handleRename()
            }
        }
    }

    const handleClickOutside = (event: MouseEvent) => {
        setDropdownHidden(true);
        const itemInclick = refItem.current && refItem.current.contains(event.target as Node);
        if (itemInclick) {
            return;
        }

        const isItemRenaming = refItem.current && refItem.current.querySelector('input')?.readOnly === false;
        if (isItemRenaming) {
            doRenaming();
        }
    };

    const handleDrop = (event: MouseEvent) => {
        const itemDropOn = refItem.current && refItem.current.contains(event.target as Node);

        if (itemDropOn) {
            setDragOver(false);
        }
    }

    const handleEnterKeyPressed = (event: KeyboardEvent) => {
        const isItemRenaming = refItem.current && refItem.current.querySelector('input')?.readOnly === false;

        if (isItemRenaming && event.key === 'Enter') {
            doRenaming();
        }
    }

    const handleRightClick = (event: MouseEvent) => {
        const itemInclick = refItem.current && refItem.current.contains(event.target as Node);
        if (itemInclick) {
            setDropdownHidden(!dropdownHidden);
        }
        else {
            setDropdownHidden(true);
        }
    }

    function doRenaming() {
        if(refItem == null || !refItem.current == null) return
        setRenaming(false);
        selectedFilesContext?.[1]([])
        ipcRenderer.send('rename-note-or-folder', item.path, refItem.current?.querySelector('input')?.value)
    }

    useEffect(() => {
        if(!item.isDirectory) return
        if(!dirCollapsed){
            gsap.to(refSubList.current, {
                height: 'auto',
                duration: 0.2
            })
        }else{
            gsap.to(refSubList.current, {
                height: 0,
                duration: 0.2
            })
        }
        console.log('dirCollapsed change')
    }, [dirCollapsed])

    function handleClickDirectory(e:React.MouseEvent) {
        console.log('click directory')
        e.stopPropagation()
        setDirCollapsed(!dirCollapsed)
        setDirCollapsedAll(null)
        setDropdownHidden(true)
    }

    function handleDropdownItemClickCommon(item: any, fileOrFolderPath: string): boolean {
        setDropdownHidden(true)
        if (item.key === 'rename') {
            handleRename()
            return true;
        }
        else if (item.key === 'delete') {
            ipcRenderer.send('delete-note-or-folder', fileOrFolderPath)
            return true;
        }
        else if (item.key === 'show-in-explorer') {
            ipcRenderer.send('show-in-explorer', fileOrFolderPath)
            return true;
        }

        return false;
    }

    function handleRename() {
        setRenaming(true);

        // Focus on the input and select the text
        if (refItem.current) {
            let input = refItem.current.querySelector('input');
            if (input) {
                input.focus();
                input.select();
            }
        }
    }

    function handleDropdownItemClickFolder(dropDownItem: any, fileOrFolderPath: string) {
        if (handleDropdownItemClickCommon(dropDownItem, fileOrFolderPath)) {
            return;
        }
        setDirCollapsed(false)
        if (dropDownItem.key === 'create-note') {
            ipcRenderer.send('create-note', fileOrFolderPath)
        }
        else if (dropDownItem.key === 'create-folder') {
            ipcRenderer.send('create-folder', fileOrFolderPath)
        }else if(dropDownItem.key === 'select-all-child'){
            let newSelected:string[] = item.children.map((file:any) => {
                return file.path
            })
            selectedFilesContext?.[1](newSelected)
        }
    }


    // Drag n drop
    function dragStartHandler(event: React.DragEvent<HTMLDivElement>) {
        event.dataTransfer.setData("text/plain", item.path);
        console.log('Item path is ' + item.path)
        event.dataTransfer.dropEffect = "move";

        // const dragImage = document.createElement('div');
        // dragImage.className = styles.sidebar_list_drag_image;
        // dragImage.textContent = item.name;

        // document.body.appendChild(dragImage);
        // event.dataTransfer.setDragImage(dragImage, 0, 0);

        // Remove the element when the drag n drop operation is done
        // setTimeout(() => document.body.removeChild(dragImage), 0);
    }

    function dragOverHandler(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();

        // if ctrl key pressed, copy the file
        if (event.ctrlKey) {
            event.dataTransfer.dropEffect = "copy";
        }
        else {
            event.dataTransfer.dropEffect = "move";
        }
        setDirCollapsed(false);

        setDragOver(true);
    }

    function handleDragLeave (event: React.DragEvent<HTMLDivElement>) {
        setDragOver(false);
    }

    function dropHandler(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault();
        const data = event.dataTransfer.getData("text/plain");
        // if ctrl key pressed, copy the file
        if (event.ctrlKey) {
            ipcRenderer.send('copy-note-or-folder', data, item.path)
        }
        else {
            ipcRenderer.send('move-note-or-folder', data, item.path)
        }
    }


    function handleSelectFile(event: React.MouseEvent, path: string) {
        event.stopPropagation()
        if (event.ctrlKey) {
            if(selectedFilesContext?.[0].includes(path)){
                selectedFilesContext?.[1]([...selectedFilesContext[0]].filter((value) => {
                    return value != path
                } ))
            }else{
                selectedFilesContext?.[1]([...selectedFilesContext[0].concat(path)])
            }
        } else {
            if(selectedFilesContext?.[0].includes(path) && selectedFilesContext?.[0].length == 1){
                selectedFilesContext?.[1]([])
            }else{
                selectedFilesContext?.[1]([path])
            }
        }
    }

    function isSelected(path: string): boolean {
        if (!selectedFilesContext) return false
        return selectedFilesContext?.[0].includes(path)
    }

    if (!item) return null;

    if (item.isDirectory) {
        return (
            <li className={`${styles.sidebar_list_folder} ${dirCollapsed === false || dirCollapsedAll === false ? styles.sidebar_list_folder_expanded : styles.sidebar_list_folder_collapsed}`}>
                <div onClick={handleClickDirectory} ref={refItem} className={`${dragOver ? styles.sidebar_list_drag_over : ''}`} draggable={true} onDragStart={dragStartHandler} onDragOver={dragOverHandler} onDrop={dropHandler} onDragLeave={handleDragLeave}>
                    <span className={styles.sidebar_list_folder_name}>
                        <input className={isSelected(item.path) ? styles.selected : ''} type="text" value={item.name} readOnly={!renaming} onChange={(e) => setItem({ ...item, name: e.target.value })} onClick={(event: React.MouseEvent) => handleSelectFile(event, item.path)} />
                    </span>
                    <Dropdown items={dropdownRightClickFolderItems} onItemSelect={(dropdownItem: any) => { handleDropdownItemClickFolder(dropdownItem, item.path) }} hidden={dropdownHidden} />
                </div>
                <ul className={styles.sidebar_list_folder_children} ref={refSubList}>
                    {item.children.map((item: any) => (
                        <FileListItem key={item.path} item={item} collapsedAll={dirCollapsedAll} renaming={false} folderToExpand={folderToExpand} />
                    ))}
                </ul>
            </li>
        )
    }

    else {
        return (
            <li className={styles.sidebar_list_file}>
                <div ref={refItem} onDragStart={dragStartHandler} draggable={true}>
                    <Dropdown items={dropdownRightClickCommonItems} onItemSelect={(dropdownItem: any) => { handleDropdownItemClickCommon(dropdownItem, item.path) }} hidden={dropdownHidden} />
                    <input className={isSelected(item.path) ? styles.selected : ''} type="text" value={item.name} readOnly={!renaming} onChange={(e) => setItem({ ...item, name: e.target.value })} onClick={(event: React.MouseEvent) => handleSelectFile(event, item.path)} />
                </div>
            </li>
        )
    }
}
