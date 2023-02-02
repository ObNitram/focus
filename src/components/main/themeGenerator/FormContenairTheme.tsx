import styles from 'styles/components/main/themeGenerator/formContenairTheme.module.scss'

import {IoIosArrowDown} from 'react-icons/io'
import React, {useRef, useState, useEffect, useContext} from 'react'
import {gsap} from "gsap"
import {Theme} from 'themetypes'
import { NotificationContext, NotificationLevelEnum } from '@/context/NotificationContext'
const { ipcRenderer } = window.require('electron')


type FormContenairThemeprops = {
    JSONThemes: Theme[]
}

export function FormContenairTheme(this:any, props:FormContenairThemeprops){
    const [themeSelected, setThemeSelected] = useState<string>('')

    const refNewNameInput = useRef<HTMLInputElement>(null)
    const refSelectExistingTheme = useRef<HTMLSelectElement>(null)

    const refNewThemeContenair = useRef<HTMLDivElement>(null)
    const refGeneralSetting = useRef<HTMLDivElement>(null)
    const refParagraphSetting = useRef<HTMLDivElement>(null)
    const refBoldSetting = useRef<HTMLDivElement>(null)
    const refItalicSetting = useRef<HTMLDivElement>(null)
    const refUnderlineSetting = useRef<HTMLDivElement>(null)
    const refH1Setting = useRef<HTMLDivElement>(null)
    const refH2Setting = useRef<HTMLDivElement>(null)
    const refH3Setting = useRef<HTMLDivElement>(null)
    const refH4Setting = useRef<HTMLDivElement>(null)
    const refH5Setting = useRef<HTMLDivElement>(null)
    const refH6Setting = useRef<HTMLDivElement>(null)
    const refQuoteSetting = useRef<HTMLDivElement>(null)
    const refLinkSetting = useRef<HTMLDivElement>(null)
    const refULSetting = useRef<HTMLDivElement>(null)
    const refOLSetting = useRef<HTMLDivElement>(null)

    const { notifications, addNotification, removeNotification } = useContext(NotificationContext);

    const toggleShowTable = (e:React.MouseEvent) => {
        const associatedTable = e.currentTarget.nextElementSibling as HTMLDivElement
        const logo = e.currentTarget.getElementsByTagName('svg')[0] as SVGElement
        if(associatedTable.style.height == '0px') {
            gsap.to(associatedTable, {
                height: 'auto',
                duration: 0.2
            })
            gsap.from(logo, {
                transform: 'rotate(0deg)',
                duration: 0.2
            })
        }else{
            gsap.to(associatedTable, {
                height: '0px',
                duration: 0.2
            })
            gsap.from(logo, {
                transform: 'rotate(-90deg)',
                duration: 0.2
            })
        }
    }

    const createFormErrorElement = (msg:string):HTMLParagraphElement => {
        let errorP = document.createElement('p')
        errorP.classList.add(styles.errorP)
        errorP.innerHTML = msg
        return errorP
    }

    const handleCreateNewTheme = (e:React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if(refNewNameInput == null || refNewNameInput.current == null || refNewThemeContenair == null || refNewThemeContenair.current == null) return
        let errorMessages = refNewThemeContenair.current.getElementsByClassName(styles.errorP)
        while(errorMessages.length > 0) errorMessages[0].remove()
        const name = refNewNameInput.current.value
        if(name == ''){
            refNewThemeContenair.current.appendChild(createFormErrorElement('You must choose a name'))
            return
        }
        let alreadyFound= false;
        props.JSONThemes.forEach((value:Theme) => {
            if(value.name == name){
                refNewThemeContenair.current?.appendChild(createFormErrorElement('The chosen name is not available. A theme already exists with this name.'))
                alreadyFound = true;
                return
            }
        })
        if(alreadyFound){
            refNewNameInput.current.focus()
            return
        }
        setThemeSelected(name)
    }

    const handleModifyExistingTheme = (e:React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if(refSelectExistingTheme == null || refSelectExistingTheme.current == null) return
        setThemeSelected(refSelectExistingTheme.current.value)
    }

    const convertPXStringtoNumber = (pxString:string):number => {
        //remove the px at the end of the string if it exists
        if(pxString.endsWith('px')) pxString = pxString.slice(0, -2)
        return parseInt(pxString)
    }


    const removePXString = (pxString:string):string => {
        //remove the px at the end of the string if it exists
        if(pxString.endsWith('px')) pxString = pxString.slice(0, -2)
        return pxString
    }

    const changeStyle = () => {
        const style_editor = document.getElementById('style_editor') as HTMLStyleElement
        style_editor.innerHTML = `
            .editor_general{
                background-color: ${refGeneralSetting.current?.getElementsByTagName('input')[0].value};
                caret-color: ${refGeneralSetting.current?.getElementsByTagName('input')[1].value};
            }
            .editor_paragraph{
                color: ${refParagraphSetting.current?.getElementsByTagName('input')[0].value};
                margin-left: ${refParagraphSetting.current?.getElementsByTagName('input')[1].value}px;
                margin-top: ${refParagraphSetting.current?.getElementsByTagName('input')[2].value}px;
                margin-bottom: ${refParagraphSetting.current?.getElementsByTagName('input')[3].value}px;
                font-size: ${refParagraphSetting.current?.getElementsByTagName('input')[4].value}px;
            }
            .editor_bold{
                color: ${refBoldSetting.current?.getElementsByTagName('input')[0].value};
                font-size: ${refBoldSetting.current?.getElementsByTagName('input')[1].value}px;
                font-weight: bold;
            }
            .editor_italic{
                color: ${refItalicSetting.current?.getElementsByTagName('input')[0].value};
                font-size: ${refItalicSetting.current?.getElementsByTagName('input')[1].value}px;
                font-style: italic;
            }
            .editor_underline{
                color: ${refUnderlineSetting.current?.getElementsByTagName('input')[0].value};
                font-size: ${refUnderlineSetting.current?.getElementsByTagName('input')[1].value}px;
                text-decoration: underline;
            }
            .editor_h1{
                color: ${refH1Setting.current?.getElementsByTagName('input')[0].value};
                margin-left: ${refH1Setting.current?.getElementsByTagName('input')[1].value}px;
                margin-top: ${refH1Setting.current?.getElementsByTagName('input')[2].value}px;
                margin-bottom: ${refH1Setting.current?.getElementsByTagName('input')[3].value}px;
                font-size: ${refH1Setting.current?.getElementsByTagName('input')[4].value}px;
                font-weight: ${refH1Setting.current?.getElementsByTagName('input')[5].value};
            }
            .editor_h2{
                color: ${refH2Setting.current?.getElementsByTagName('input')[0].value};
                margin-left: ${refH2Setting.current?.getElementsByTagName('input')[1].value}px;
                margin-top: ${refH2Setting.current?.getElementsByTagName('input')[2].value}px;
                margin-bottom: ${refH2Setting.current?.getElementsByTagName('input')[3].value}px;
                font-size: ${refH2Setting.current?.getElementsByTagName('input')[4].value}px;
                font-weight: ${refH2Setting.current?.getElementsByTagName('input')[5].value};
            }
            .editor_h3{
                color: ${refH3Setting.current?.getElementsByTagName('input')[0].value};
                margin-left: ${refH3Setting.current?.getElementsByTagName('input')[1].value}px;
                margin-top: ${refH3Setting.current?.getElementsByTagName('input')[2].value}px;
                margin-bottom: ${refH3Setting.current?.getElementsByTagName('input')[3].value}px;
                font-size: ${refH3Setting.current?.getElementsByTagName('input')[4].value}px;
                font-weight: ${refH3Setting.current?.getElementsByTagName('input')[5].value};
            }
            .editor_h4{
                color: ${refH4Setting.current?.getElementsByTagName('input')[0].value};
                margin-left: ${refH4Setting.current?.getElementsByTagName('input')[1].value}px;
                margin-top: ${refH4Setting.current?.getElementsByTagName('input')[2].value}px;
                margin-bottom: ${refH4Setting.current?.getElementsByTagName('input')[3].value}px;
                font-size: ${refH4Setting.current?.getElementsByTagName('input')[4].value}px;
                font-weight: ${refH4Setting.current?.getElementsByTagName('input')[5].value};
            }
            .editor_h5{
                color: ${refH5Setting.current?.getElementsByTagName('input')[0].value};
                margin-left: ${refH5Setting.current?.getElementsByTagName('input')[1].value}px;
                margin-top: ${refH5Setting.current?.getElementsByTagName('input')[2].value}px;
                margin-bottom: ${refH5Setting.current?.getElementsByTagName('input')[3].value}px;
                font-size: ${refH5Setting.current?.getElementsByTagName('input')[4].value}px;
                font-weight: ${refH5Setting.current?.getElementsByTagName('input')[5].value};
            }
            .editor_h6{
                color: ${refH6Setting.current?.getElementsByTagName('input')[0].value};
                margin-left: ${refH6Setting.current?.getElementsByTagName('input')[1].value}px;
                margin-top: ${refH6Setting.current?.getElementsByTagName('input')[2].value}px;
                margin-bottom: ${refH6Setting.current?.getElementsByTagName('input')[3].value}px;
                font-size: ${refH6Setting.current?.getElementsByTagName('input')[4].value}px;
                font-weight: ${refH6Setting.current?.getElementsByTagName('input')[5].value};
            }
            .editor_quote{
                margin-left: ${refQuoteSetting.current?.getElementsByTagName('input')[0].value}px;
                margin-bottom: ${refQuoteSetting.current?.getElementsByTagName('input')[1].value}px;
                font-size: ${refQuoteSetting.current?.getElementsByTagName('input')[2].value}px;
                color: ${refQuoteSetting.current?.getElementsByTagName('input')[3].value};
                border-left-color: ${refQuoteSetting.current?.getElementsByTagName('input')[4].value};
                border-left-style: ${refQuoteSetting.current?.getElementsByTagName('select')[0].value};
                border-left-width: ${refQuoteSetting.current?.getElementsByTagName('input')[5].value}px;
                padding-left: ${refQuoteSetting.current?.getElementsByTagName('input')[6].value}px;
            }
            .editor_ul{
                padding-left: ${refULSetting.current?.getElementsByTagName('input')[0].value}px;
                margin-bottom: ${refULSetting.current?.getElementsByTagName('input')[1].value}px;
                margin-top: ${refULSetting.current?.getElementsByTagName('input')[2].value}px;
            }
            .editor_ol{
                padding-left: ${refOLSetting.current?.getElementsByTagName('input')[0].value}px;
                margin-bottom: ${refOLSetting.current?.getElementsByTagName('input')[1].value}px;
                margin-top: ${refOLSetting.current?.getElementsByTagName('input')[2].value}px;
            }
            .editor_link{
                font-size: ${refLinkSetting.current?.getElementsByTagName('input')[0].value}px;
                color: ${refLinkSetting.current?.getElementsByTagName('input')[1].value};
                text-decoration: ${refLinkSetting.current?.getElementsByTagName('select')[0].value};
            }
            .editor_link:hover{
                color: ${refLinkSetting.current?.getElementsByTagName('input')[2].value};
                text-decoration: ${refLinkSetting.current?.getElementsByTagName('select')[1].value};
            }
        `
    }

    useEffect(() => {
        if(themeSelected ==  '') return
        let indexTheme:number = -1;
        props.JSONThemes.forEach((value:Theme, index:number) => {
            if(value.name == themeSelected){
                indexTheme = index
                return
            }
        })
        let loadedTheme:Theme;
        if(indexTheme == -1){
            loadedTheme = props.JSONThemes[0] //0 is the default Theme
        }else{
            loadedTheme = props.JSONThemes[indexTheme]
        }
        if(refGeneralSetting && refGeneralSetting.current){
            refGeneralSetting.current.getElementsByTagName('input')[0].value = loadedTheme.general['background-color']
            console.log(refGeneralSetting.current.getElementsByTagName('input')[1])
            console.log(loadedTheme.general['caret-color'])
            refGeneralSetting.current.getElementsByTagName('input')[1].value = loadedTheme.general['caret-color']
        }
        if(refParagraphSetting && refParagraphSetting.current){
            refParagraphSetting.current.getElementsByTagName('input')[0].value = loadedTheme.paragraph['color']
            refParagraphSetting.current.getElementsByTagName('input')[1].value = removePXString(loadedTheme.paragraph['margin-left'])
            refParagraphSetting.current.getElementsByTagName('input')[2].value = removePXString(loadedTheme.paragraph['margin-top'])
            refParagraphSetting.current.getElementsByTagName('input')[3].value = removePXString(loadedTheme.paragraph['margin-bottom'])
            refParagraphSetting.current.getElementsByTagName('input')[4].value = removePXString(loadedTheme.paragraph['font-size'])
        }
        if(refBoldSetting && refBoldSetting.current){
            refBoldSetting.current.getElementsByTagName('input')[0].value = loadedTheme.bold['color']
            refBoldSetting.current.getElementsByTagName('input')[1].value = removePXString(loadedTheme.bold['font-size'])
        }
        if(refItalicSetting && refItalicSetting.current){
            refItalicSetting.current.getElementsByTagName('input')[0].value = loadedTheme.italic['color']
            refItalicSetting.current.getElementsByTagName('input')[1].value = removePXString(loadedTheme.italic['font-size'])
        }
        if(refUnderlineSetting && refUnderlineSetting.current){
            refUnderlineSetting.current.getElementsByTagName('input')[0].value = loadedTheme.underline['color']
            refUnderlineSetting.current.getElementsByTagName('input')[1].value = removePXString(loadedTheme.underline['font-size'])
        }
        if(refH1Setting && refH1Setting.current){
            refH1Setting.current.getElementsByTagName('input')[0].value = loadedTheme.h1['color']
            refH1Setting.current.getElementsByTagName('input')[1].value = removePXString(loadedTheme.h1['margin-left'])
            refH1Setting.current.getElementsByTagName('input')[2].value = removePXString(loadedTheme.h1['margin-top'])
            refH1Setting.current.getElementsByTagName('input')[3].value = removePXString(loadedTheme.h1['margin-bottom'])
            refH1Setting.current.getElementsByTagName('input')[4].value = removePXString(loadedTheme.h1['font-size'])
            refH1Setting.current.getElementsByTagName('input')[5].value = removePXString(loadedTheme.h1['font-weight'])
        }
        if(refH2Setting && refH2Setting.current){
            refH2Setting.current.getElementsByTagName('input')[0].value = loadedTheme.h2['color']
            refH2Setting.current.getElementsByTagName('input')[1].value = removePXString(loadedTheme.h2['margin-left'])
            refH2Setting.current.getElementsByTagName('input')[2].value = removePXString(loadedTheme.h2['margin-top'])
            refH2Setting.current.getElementsByTagName('input')[3].value = removePXString(loadedTheme.h2['margin-bottom'])
            refH2Setting.current.getElementsByTagName('input')[4].value = removePXString(loadedTheme.h2['font-size'])
            refH2Setting.current.getElementsByTagName('input')[5].value = removePXString(loadedTheme.h2['font-weight'])
        }
        if(refH3Setting && refH3Setting.current){
            refH3Setting.current.getElementsByTagName('input')[0].value = loadedTheme.h3['color']
            refH3Setting.current.getElementsByTagName('input')[1].value = removePXString(loadedTheme.h3['margin-left'])
            refH3Setting.current.getElementsByTagName('input')[2].value = removePXString(loadedTheme.h3['margin-top'])
            refH3Setting.current.getElementsByTagName('input')[3].value = removePXString(loadedTheme.h3['margin-bottom'])
            refH3Setting.current.getElementsByTagName('input')[4].value = removePXString(loadedTheme.h3['font-size'])
            refH3Setting.current.getElementsByTagName('input')[5].value = removePXString(loadedTheme.h3['font-weight'])
        }
        if(refH4Setting && refH4Setting.current){
            refH4Setting.current.getElementsByTagName('input')[0].value = loadedTheme.h4['color']
            refH4Setting.current.getElementsByTagName('input')[1].value = removePXString(loadedTheme.h4['margin-left'])
            refH4Setting.current.getElementsByTagName('input')[2].value = removePXString(loadedTheme.h4['margin-top'])
            refH4Setting.current.getElementsByTagName('input')[3].value = removePXString(loadedTheme.h4['margin-bottom'])
            refH4Setting.current.getElementsByTagName('input')[4].value = removePXString(loadedTheme.h4['font-size'])
            refH4Setting.current.getElementsByTagName('input')[5].value = removePXString(loadedTheme.h4['font-weight'])
        }
        if(refH5Setting && refH5Setting.current){
            refH5Setting.current.getElementsByTagName('input')[0].value = loadedTheme.h5['color']
            refH5Setting.current.getElementsByTagName('input')[1].value = removePXString(loadedTheme.h5['margin-left'])
            refH5Setting.current.getElementsByTagName('input')[2].value = removePXString(loadedTheme.h5['margin-top'])
            refH5Setting.current.getElementsByTagName('input')[3].value = removePXString(loadedTheme.h5['margin-bottom'])
            refH5Setting.current.getElementsByTagName('input')[4].value = removePXString(loadedTheme.h5['font-size'])
            refH5Setting.current.getElementsByTagName('input')[5].value = removePXString(loadedTheme.h5['font-weight'])
        }
        if(refH6Setting && refH6Setting.current){
            refH6Setting.current.getElementsByTagName('input')[0].value = loadedTheme.h6['color']
            refH6Setting.current.getElementsByTagName('input')[1].value = removePXString(loadedTheme.h6['margin-left'])
            refH6Setting.current.getElementsByTagName('input')[2].value = removePXString(loadedTheme.h6['margin-top'])
            refH6Setting.current.getElementsByTagName('input')[3].value = removePXString(loadedTheme.h6['margin-bottom'])
            refH6Setting.current.getElementsByTagName('input')[4].value = removePXString(loadedTheme.h6['font-size'])
            refH6Setting.current.getElementsByTagName('input')[5].value = removePXString(loadedTheme.h6['font-weight'])
        }
        if(refQuoteSetting && refQuoteSetting.current){
            refQuoteSetting.current.getElementsByTagName('input')[0].value = removePXString(loadedTheme.quote['margin-left'])
            refQuoteSetting.current.getElementsByTagName('input')[1].value = removePXString(loadedTheme.quote['margin-bottom'])
            refQuoteSetting.current.getElementsByTagName('input')[2].value = removePXString(loadedTheme.quote['font-size'])
            refQuoteSetting.current.getElementsByTagName('input')[3].value = loadedTheme.quote['color']
            refQuoteSetting.current.getElementsByTagName('input')[4].value = loadedTheme.quote['border-left-color']
            refQuoteSetting.current.getElementsByTagName('input')[5].value = removePXString(loadedTheme.quote['border-left-width'])
            refQuoteSetting.current.getElementsByTagName('select')[0].value = loadedTheme.quote['border-left-style']
            refQuoteSetting.current.getElementsByTagName('input')[6].value = removePXString(loadedTheme.quote['padding-left'])
        }
        if(refLinkSetting && refLinkSetting.current){
            refLinkSetting.current.getElementsByTagName('input')[0].value = removePXString(loadedTheme.link['font-size'])
            refLinkSetting.current.getElementsByTagName('input')[1].value = loadedTheme.link['color']
            refLinkSetting.current.getElementsByTagName('select')[0].value = loadedTheme.link['text-decoration']
            refLinkSetting.current.getElementsByTagName('input')[2].value = loadedTheme.link['linkHover']['color']
            refLinkSetting.current.getElementsByTagName('select')[1].value = loadedTheme.link['linkHover']['text-decoration']
        }
        if(refULSetting && refULSetting.current){
            refULSetting.current.getElementsByTagName('input')[0].value = removePXString(loadedTheme.ul['padding-left'])
            refULSetting.current.getElementsByTagName('input')[1].value = removePXString(loadedTheme.ul['margin-bottom'])
            refULSetting.current.getElementsByTagName('input')[2].value = removePXString(loadedTheme.ul['margin-top'])
        }
        if(refOLSetting && refOLSetting.current){
            refOLSetting.current.getElementsByTagName('input')[0].value = removePXString(loadedTheme.ol['padding-left'])
            refOLSetting.current.getElementsByTagName('input')[1].value = removePXString(loadedTheme.ol['margin-bottom'])
            refOLSetting.current.getElementsByTagName('input')[2].value = removePXString(loadedTheme.ol['margin-top'])
        }
        changeStyle();
    }, [themeSelected])

    const saveTheme = (e:React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        // return if one ref or ref.current is null
        if(!refGeneralSetting || !refGeneralSetting.current || !refParagraphSetting || !refParagraphSetting.current || !refBoldSetting || !refBoldSetting.current || !refItalicSetting || !refItalicSetting.current || !refUnderlineSetting || !refUnderlineSetting.current || !refH1Setting || !refH1Setting.current || !refH2Setting || !refH2Setting.current || !refH3Setting || !refH3Setting.current || !refH4Setting || !refH4Setting.current || !refH5Setting || !refH5Setting.current || !refH6Setting || !refH6Setting.current || !refQuoteSetting || !refQuoteSetting.current || !refLinkSetting || !refLinkSetting.current || !refULSetting || !refULSetting.current || !refOLSetting || !refOLSetting.current) return
        const theme:Theme = {
            name: themeSelected,
            general: {
                'background-color': refGeneralSetting.current.getElementsByTagName('input')[0].value,
                'caret-color': refGeneralSetting.current.getElementsByTagName('input')[1].value,
            },
            paragraph: {
                'color': refParagraphSetting.current.getElementsByTagName('input')[0].value,
                'font-size': refParagraphSetting.current.getElementsByTagName('input')[4].value + 'px',
                'margin-bottom': refParagraphSetting.current.getElementsByTagName('input')[3].value + 'px',
                'margin-left': refParagraphSetting.current.getElementsByTagName('input')[1].value + 'px',
                'margin-top': refParagraphSetting.current.getElementsByTagName('input')[2].value + 'px',
            },
            bold: {
                'color': refBoldSetting.current.getElementsByTagName('input')[0].value,
                'font-size': refBoldSetting.current.getElementsByTagName('input')[1].value + 'px',
            },
            italic: {
                'color': refItalicSetting.current.getElementsByTagName('input')[0].value,
                'font-size':  refItalicSetting.current.getElementsByTagName('input')[1].value + 'px',
            },
            underline: {
                'color': refUnderlineSetting.current.getElementsByTagName('input')[0].value,
                'font-size': refUnderlineSetting.current.getElementsByTagName('input')[1].value + 'px',
            },
            h1: {
                'color': refH1Setting.current.getElementsByTagName('input')[0].value,
                'margin-left': refH1Setting.current.getElementsByTagName('input')[1].value + 'px',
                'margin-top': refH1Setting.current.getElementsByTagName('input')[2].value + 'px',
                'margin-bottom': refH1Setting.current.getElementsByTagName('input')[3].value + 'px',
                'font-size': refH1Setting.current.getElementsByTagName('input')[4].value + 'px',
                'font-weight': refH1Setting.current.getElementsByTagName('input')[5].value,
            },
            h2: {
                'color': refH2Setting.current.getElementsByTagName('input')[0].value,
                'margin-left': refH2Setting.current.getElementsByTagName('input')[1].value + 'px',
                'margin-top': refH2Setting.current.getElementsByTagName('input')[2].value + 'px',
                'margin-bottom': refH2Setting.current.getElementsByTagName('input')[3].value + 'px',
                'font-size': refH2Setting.current.getElementsByTagName('input')[4].value + 'px',
                'font-weight': refH2Setting.current.getElementsByTagName('input')[5].value,
            },
            h3: {
                'color': refH3Setting.current.getElementsByTagName('input')[0].value,
                'margin-left': refH3Setting.current.getElementsByTagName('input')[1].value + 'px',
                'margin-top': refH3Setting.current.getElementsByTagName('input')[2].value + 'px',
                'margin-bottom': refH3Setting.current.getElementsByTagName('input')[3].value + 'px',
                'font-size': refH3Setting.current.getElementsByTagName('input')[4].value + 'px',
                'font-weight': refH3Setting.current.getElementsByTagName('input')[5].value,
            },
            h4: {
                'color': refH4Setting.current.getElementsByTagName('input')[0].value,
                'margin-left': refH4Setting.current.getElementsByTagName('input')[1].value + 'px',
                'margin-top': refH4Setting.current.getElementsByTagName('input')[2].value + 'px',
                'margin-bottom': refH4Setting.current.getElementsByTagName('input')[3].value + 'px',
                'font-size': refH4Setting.current.getElementsByTagName('input')[4].value + 'px',
                'font-weight': refH4Setting.current.getElementsByTagName('input')[5].value,
            },
            h5: {
                'color': refH5Setting.current.getElementsByTagName('input')[0].value,
                'margin-left': refH5Setting.current.getElementsByTagName('input')[1].value + 'px',
                'margin-top':   refH5Setting.current.getElementsByTagName('input')[2].value + 'px',
                'margin-bottom': refH5Setting.current.getElementsByTagName('input')[3].value + 'px',
                'font-size': refH5Setting.current.getElementsByTagName('input')[4].value + 'px',
                'font-weight': refH5Setting.current.getElementsByTagName('input')[5].value,
            },
            h6: {
                'color': refH6Setting.current.getElementsByTagName('input')[0].value,
                'margin-left': refH6Setting.current.getElementsByTagName('input')[1].value + 'px',
                'margin-top': refH6Setting.current.getElementsByTagName('input')[2].value + 'px',
                'margin-bottom': refH6Setting.current.getElementsByTagName('input')[3].value + 'px',
                'font-size': refH6Setting.current.getElementsByTagName('input')[4].value + 'px',
                'font-weight': refH6Setting.current.getElementsByTagName('input')[5].value,
            },
            quote: {
                'margin-left': refQuoteSetting.current.getElementsByTagName('input')[0].value + 'px',
                'margin-bottom': refQuoteSetting.current.getElementsByTagName('input')[1].value + 'px',
                'font-size': refQuoteSetting.current.getElementsByTagName('input')[2].value + 'px',
                'color': refQuoteSetting.current.getElementsByTagName('input')[3].value,
                'border-left-color': refQuoteSetting.current.getElementsByTagName('input')[4].value,
                'border-left-width': refQuoteSetting.current.getElementsByTagName('input')[5].value + 'px',
                'border-left-style': refQuoteSetting.current.getElementsByTagName('select')[0].value,
                'padding-left': refQuoteSetting.current.getElementsByTagName('input')[6].value + 'px',
            },
            link: {
                'font-size': refLinkSetting.current.getElementsByTagName('input')[0].value + 'px',
                'color': refLinkSetting.current.getElementsByTagName('input')[1].value,
                'text-decoration': refLinkSetting.current.getElementsByTagName('select')[0].value,
                'linkHover': {
                    'color': refLinkSetting.current.getElementsByTagName('input')[2].value,
                    'text-decoration': refLinkSetting.current.getElementsByTagName('select')[1].value,
                },
            },
            ul: {
                'padding-left': refULSetting.current.getElementsByTagName('input')[0].value + 'px',
                'margin-bottom': refULSetting.current.getElementsByTagName('input')[1].value + 'px',
                'margin-top': refULSetting.current.getElementsByTagName('input')[2].value + 'px'
            },
            ol: {
                'padding-left': refOLSetting.current.getElementsByTagName('input')[0].value + 'px',
                'margin-bottom': refOLSetting.current.getElementsByTagName('input')[1].value + 'px',
                'margin-top': refOLSetting.current.getElementsByTagName('input')[2].value + 'px'
            }
            
        }
        ipcRenderer.send('saveTheme', themeSelected, theme)
        ipcRenderer.once('saveTheme_reponse', (event, res:boolean) => {
            addNotification(`The theme ${themeSelected} is ${res ? 'saved!' : 'unsaved!'}`, res ? NotificationLevelEnum.SUCESS : NotificationLevelEnum.ERROR )
        })
    }

    return(
        <div className={styles.formContenairTheme}>
            <h2>Edit section {themeSelected !== '' && `- ${themeSelected}`}{themeSelected !== '' && (<button className={styles.btn_save} onClick={(e) => saveTheme(e)}>Save</button>)}</h2>
            {themeSelected !== ''
            ? (<form action="">
                <div className={styles.section_Form}>
                    <h3 style={{padding: '10px'}} onClick={(e:React.MouseEvent) => toggleShowTable(e)} >
                        General <IoIosArrowDown style={{transform : 'rotate(-90deg)'}}/>
                    </h3>
                    <div style={{height: '0px'}} className={styles.table_contenair} ref={refGeneralSetting}>
                        <table>
                            <tbody>
                                <tr>
                                    <td><label htmlFor="backgroundColor">Background Color :</label></td>
                                    <td><input onChange={changeStyle} type={'color'} defaultValue='#ffffff' id='backgroundColor'></input></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="caretColor">Caret Color :</label></td>
                                    <td><input onChange={changeStyle} type="color" id="caretColor" /></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <h3 style={{padding: '10px'}} onClick={(e:React.MouseEvent) => toggleShowTable(e)} >Paragraph <IoIosArrowDown style={{transform : 'rotate(-90deg)'}}/> </h3>
                    <div style={{height: '0px'}} className={styles.table_contenair} ref={refParagraphSetting}>
                        <table>
                            <tbody>
                                <tr>
                                    <td><label htmlFor="ColorP">Color :</label></td>
                                    <td><input onChange={changeStyle} type="color" id="ColorP"/></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="mlP">Space before :</label></td>
                                    <td><input onChange={changeStyle} type="number" id="mlP"/></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="mtP">Space above :</label></td>
                                    <td><input onChange={changeStyle} type="number" id="mtP"/></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="mbP">Space below :</label></td>
                                    <td><input onChange={changeStyle} type="number" id="mbP"/></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="fontSizeP">Font size :</label></td>
                                    <td><input onChange={changeStyle} type="number" id="fontSizeP"/></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <h3 style={{padding: '10px'}} onClick={(e:React.MouseEvent) => toggleShowTable(e)} >Bold <IoIosArrowDown style={{transform : 'rotate(-90deg)'}}/></h3>
                    <div style={{height: '0px'}} className={styles.table_contenair} ref={refBoldSetting}>
                        <table>
                            <tbody>
                                <tr>
                                    <td><label htmlFor="colorBold">Color :</label></td>
                                    <td><input onChange={changeStyle} type="color" id="colorBold"/></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="fontSizeBold">Font size :</label></td>
                                    <td><input onChange={changeStyle} type="number" id="fontSizeBold"/></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <h3 style={{padding: '10px'}} onClick={(e:React.MouseEvent) => toggleShowTable(e)} >Italic <IoIosArrowDown style={{transform : 'rotate(-90deg)'}}/></h3>
                    <div style={{height: '0px'}} className={styles.table_contenair} ref={refItalicSetting}>
                        <table>
                            <tbody>
                                <tr>
                                    <td><label htmlFor="colorItalic">Color :</label></td>
                                    <td><input onChange={changeStyle} type="color" id="colorItalic"/></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="fontSizeItalic">Font size :</label></td>
                                    <td><input onChange={changeStyle} type="number" id="fontSizeItalic"/></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <h3 style={{padding: '10px'}} onClick={(e:React.MouseEvent) => toggleShowTable(e)} >Underline <IoIosArrowDown style={{transform : 'rotate(-90deg)'}}/></h3>
                    <div style={{height: '0px'}} className={styles.table_contenair} ref={refUnderlineSetting}>
                        <table>
                            <tbody>
                                <tr>
                                    <td><label htmlFor="colorUnderline">Color :</label></td>
                                    <td><input onChange={changeStyle} type="color" id="colorUnderline"/></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="fontSizeUnderline">Font size :</label></td>
                                    <td><input onChange={changeStyle} type="number" id="fontSizeUnderline"/></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <h3 style={{padding: '10px'}} onClick={(e:React.MouseEvent) => toggleShowTable(e)} >Level 1 Title <IoIosArrowDown style={{transform : 'rotate(-90deg)'}}/></h3>
                    <div style={{height: '0px'}} className={styles.table_contenair} ref={refH1Setting}>
                        <table>
                            <tbody>
                                <tr>
                                    <td><label htmlFor="colorH1">Color :</label></td>
                                    <td><input onChange={changeStyle} type="color" id="colorH1" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="mlH1">Space before :</label></td>
                                    <td><input onChange={changeStyle} type="number" id="mlH1" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="mtH1">Space above :</label></td>
                                    <td><input onChange={changeStyle} type="number" id="mtH1" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="mbH1">Space below :</label></td>
                                    <td><input onChange={changeStyle} type="number" id="mbH1" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="fontSizeH1">Font size :</label></td>
                                    <td><input onChange={changeStyle} type="number" id="fontSizeH1" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="fontWeightH1">Font weight :</label></td>
                                    <td><input onChange={changeStyle} type="number" id="fontWeightH1" /></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <h3 style={{padding: '10px'}} onClick={(e:React.MouseEvent) => toggleShowTable(e)} >Level 2 Title <IoIosArrowDown style={{transform : 'rotate(-90deg)'}}/></h3>
                    <div style={{height: '0px'}} className={styles.table_contenair} ref={refH2Setting}>
                        <table>
                            <tbody>
                                <tr>
                                    <td><label htmlFor="colorH2">Color :</label></td>
                                    <td><input onChange={changeStyle} type="color" id="colorH2" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="mlH2">Space before :</label></td>
                                    <td><input onChange={changeStyle} type="number" id="mlH2" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="mtH2">Space above :</label></td>
                                    <td><input onChange={changeStyle} type="number" id="mtH2" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="mbH2">Space below :</label></td>
                                    <td><input onChange={changeStyle} type="number" id="mbH2" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="fontSizeH2">Font size :</label></td>
                                    <td><input onChange={changeStyle} type="number" id="fontSizeH2" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="fontWeightH2">Font weight :</label></td>
                                    <td><input onChange={changeStyle} type="number" id="fontWeightH2" /></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <h3 style={{padding: '10px'}} onClick={(e:React.MouseEvent) => toggleShowTable(e)} >Level 3 Title <IoIosArrowDown style={{transform : 'rotate(-90deg)'}}/></h3>
                    <div style={{height: '0px'}} className={styles.table_contenair} ref={refH3Setting}>
                        <table>
                            <tbody>
                                <tr>
                                    <td><label htmlFor="colorH3">Color :</label></td>
                                    <td><input onChange={changeStyle} type="color" id="colorH3" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="mlH3">Space before :</label></td>
                                    <td><input onChange={changeStyle} type="number" id="mlH3" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="mtH3">Space above :</label></td>
                                    <td><input onChange={changeStyle} type="number" id="mtH3" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="mbH3">Space below :</label></td>
                                    <td><input onChange={changeStyle} type="number" id="mbH3" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="fontSizeH3">Font size :</label></td>
                                    <td><input onChange={changeStyle} type="number" id="fontSizeH3" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="fontWeightH3">Font weight :</label></td>
                                    <td><input onChange={changeStyle} type="number" id="fontWeightH3" /></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <h3 style={{padding: '10px'}} onClick={(e:React.MouseEvent) => toggleShowTable(e)} >Level 4 Title <IoIosArrowDown style={{transform : 'rotate(-90deg)'}}/></h3>
                    <div style={{height: '0px'}} className={styles.table_contenair} ref={refH4Setting}>
                        <table>
                            <tbody>
                                <tr>
                                    <td><label htmlFor="colorH4">Color :</label></td>
                                    <td><input onChange={changeStyle} type="color" id="colorH4" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="mlH4">Space before :</label></td>
                                    <td><input onChange={changeStyle} type="number" id="mlH4" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="mtH4">Space above :</label></td>
                                    <td><input onChange={changeStyle} type="number" id="mtH4" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="mbH4">Space below :</label></td>
                                    <td><input onChange={changeStyle} type="number" id="mbH4" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="fontSizeH4">Font size :</label></td>
                                    <td><input onChange={changeStyle} type="number" id="fontSizeH4" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="fontWeightH4">Font weight :</label></td>
                                    <td><input onChange={changeStyle} type="number" id="fontWeightH4" /></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <h3 style={{padding: '10px'}} onClick={(e:React.MouseEvent) => toggleShowTable(e)} >Level 5 Title <IoIosArrowDown style={{transform : 'rotate(-90deg)'}}/></h3>
                    <div style={{height: '0px'}} className={styles.table_contenair} ref={refH5Setting}>
                        <table>
                            <tbody>
                                <tr>
                                    <td><label htmlFor="colorH5">Color :</label></td>
                                    <td><input onChange={changeStyle} type="color" id="colorH5" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="mlH5">Space before :</label></td>
                                    <td><input onChange={changeStyle} type="number" id="mlH5" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="mtH5">Space above :</label></td>
                                    <td><input onChange={changeStyle} type="number" id="mtH1" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="mbH5">Space below :</label></td>
                                    <td><input onChange={changeStyle} type="number" id="mbH5" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="fontSizeH5">Font size :</label></td>
                                    <td><input onChange={changeStyle} type="number" id="fontSizeH5" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="fontWeightH5">Font weight :</label></td>
                                    <td><input onChange={changeStyle} type="number" id="fontWeightH5" /></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <h3 style={{padding: '10px'}} onClick={(e:React.MouseEvent) => toggleShowTable(e)} >Level 6 Title <IoIosArrowDown style={{transform : 'rotate(-90deg)'}}/></h3>
                    <div style={{height: '0px'}} className={styles.table_contenair} ref={refH6Setting}>
                        <table>
                            <tbody>
                                <tr>
                                    <td><label htmlFor="colorH6">Color :</label></td>
                                    <td><input onChange={changeStyle} type="color" id="colorH6" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="mlH6">Space before :</label></td>
                                    <td><input onChange={changeStyle} type="number" id="mlH6" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="mtH6">Space above :</label></td>
                                    <td><input onChange={changeStyle} type="number" id="mtH6" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="mbH6">Space below :</label></td>
                                    <td><input onChange={changeStyle} type="number" id="mbH6" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="fontSizeH6">Font size :</label></td>
                                    <td><input onChange={changeStyle} type="number" id="fontSizeH6" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="fontWeightH6">Font weight :</label></td>
                                    <td><input onChange={changeStyle} type="number" id="fontWeightH6" /></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <h3 style={{padding: '10px'}} onClick={(e:React.MouseEvent) => toggleShowTable(e)} >Quote <IoIosArrowDown style={{transform : 'rotate(-90deg)'}}/></h3>
                    <div style={{height: '0px'}} className={styles.table_contenair} ref={refQuoteSetting}>
                        <table>
                            <tbody>
                                <tr>
                                    <td><label htmlFor="mlQuote">Space before :</label></td>
                                    <td><input onChange={changeStyle} type="number" id="mlQuote"/></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="mbQuote">Space below :</label></td>
                                    <td><input onChange={changeStyle} type="number" id="mlQuote"/></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="fontSizeQuote">Font size :</label></td>
                                    <td><input onChange={changeStyle} type="number" id="fontSizeQuote" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="colorQuote">Color :</label></td>
                                    <td><input onChange={changeStyle} type="color" id="colorQuote"/></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="borderLeftColorQuote">Border left color :</label></td>
                                    <td><input onChange={changeStyle} type="color" id="borderLeftColorQuote" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="borderLeftWidthQuote">Border left width :</label></td>
                                    <td><input onChange={changeStyle} type="number" id="borderLeftWidthQuote" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="borderLeftStyle">Border left style :</label></td>
                                    <td><select onChange={changeStyle} id="borderLeftStyle" defaultValue={'solid'}>
                                            <option value="none">none</option>
                                            <option value="dotted">Dotted</option>
                                            <option value="dashed">Dashed</option>
                                            <option value="solid">Solid</option>
                                            <option value="double">Doble</option>
                                        </select></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="plQuote">Padding left : :</label></td>
                                    <td><input onChange={changeStyle} type="number" id="plQuote"/></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <h3 style={{padding: '10px'}} onClick={(e:React.MouseEvent) => toggleShowTable(e)} >Link <IoIosArrowDown style={{transform : 'rotate(-90deg)'}}/></h3>
                    <div style={{height: '0px'}} className={styles.table_contenair} ref={refLinkSetting}>
                        <table>
                            <tbody>
                                <tr>
                                    <td><label htmlFor="fontSizeLink">Font size :</label></td>
                                    <td><input onChange={changeStyle} type="number" id="fontSizeLink" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="colorLink">Color :</label></td>
                                    <td><input onChange={changeStyle} type="color" id="colorLink"/></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="textDecorationLink">Text decoration :</label></td>
                                    <td>
                                        <select onChange={changeStyle} id="textDecorationLink" defaultValue={'none'}>
                                            <option value="none">None</option>
                                            <option value="underline">Underline</option>
                                            <option value="overline">Overline</option>
                                            <option value="line-through">Line-Through</option>
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="linkHoverColor">Color on hover :</label></td>
                                    <td><input onChange={changeStyle}type="color" id="linkHoverColor" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="textDecorationLinkHover">Text decoration on Hover :</label></td>
                                    <td>
                                        <select onChange={changeStyle} id="textDecorationLinkHover" defaultValue={'none'}>
                                            <option value="none">None</option>
                                            <option value="underline">Underline</option>
                                            <option value="overline">Overline</option>
                                            <option value="line-through">Line-Through</option>
                                        </select>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <h3 style={{padding: '10px'}} onClick={(e:React.MouseEvent) => toggleShowTable(e)} >Bulleted list <IoIosArrowDown style={{transform : 'rotate(-90deg)'}}/></h3>
                    <div style={{height: '0px'}} className={styles.table_contenair} ref={refULSetting}>
                        <table>
                            <tbody>
                                <tr>
                                    <td><label htmlFor="plUl">Space before :</label></td>
                                    <td><input onChange={changeStyle} type="number" id="plUl" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="mbUl">Space below :</label></td>
                                    <td><input onChange={changeStyle} type="number" id="mbUl" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="mtUl">Space above :</label></td>
                                    <td><input onChange={changeStyle} type="number" id="mtUl" /></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <h3 style={{padding: '10px'}} onClick={(e:React.MouseEvent) => toggleShowTable(e)} >Ordered list <IoIosArrowDown style={{transform : 'rotate(-90deg)'}}/></h3>
                    <div style={{height: '0px'}} className={styles.table_contenair} ref={refOLSetting}>
                        <table>
                            <tbody>
                                <tr>
                                    <td><label htmlFor="plOl">Space before :</label></td>
                                    <td><input onChange={changeStyle} type="number" id="plOl" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="mbOl">Space below :</label></td>
                                    <td><input onChange={changeStyle} type="number" id="mbOl" /></td>
                                </tr>
                                <tr>
                                    <td><label htmlFor="mtOl">Space above :</label></td>
                                    <td><input onChange={changeStyle} type="number" id="mtOl" /></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </form>)
            : (<form className={styles.form_SelectTheme}>
                <h4>Please select a Theme : </h4>
                {props.JSONThemes.length !== 1 
                    ? (
                        <div className={styles.newThemeContenair}>
                            <select ref={refSelectExistingTheme} id="selectTheme">
                                {props.JSONThemes.map((value:Theme) => {
                                    if(value.name !== 'default'){
                                        return (<option value={value.name}>{value.name}</option>)
                                    }
                                })}
                            </select>
                            <button onClick={handleModifyExistingTheme}>Modify</button>
                        </div>
                        )
                    
                    : (<p>No availables themes</p>)
                }
                <h4>Or create a new theme : </h4>
                <div className={styles.newThemeContenair} ref={refNewThemeContenair}>
                    <input ref={refNewNameInput} type="text" placeholder='Name'/>
                    <button onClick={(e) => handleCreateNewTheme(e)}>Create</button>
                </div>
            </form>)}
        </div>
    )
}