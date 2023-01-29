import styles from 'styles/components/main/themeGenerator/themeGenerator.module.scss'
import { ExemplePage } from './ExemplePage'
import { FormContenairTheme } from './FormContenairTheme'
import {MdOutlineDesignServices} from 'react-icons/md';
import { AiOutlineClose } from 'react-icons/ai';
import { useEffect, useState } from 'react';
import {Theme} from 'themetypes'
import { Loader } from '@/components/generic/Loader';

const { ipcRenderer } = window.require('electron')


type ThemeGeneratorProps = {
    closeThemeGenerator : () => void
}

export default function ThemeGenerator(this:any, props:ThemeGeneratorProps){
    const [JSONThemes, setJSONThemes] = useState<Theme[]|null>(null)

    useEffect(() => {
        ipcRenderer.send('getJSONTypes');
        ipcRenderer.once('JSONTypesReceived', (event, value:Theme[]) => {
            setJSONThemes(value)
            console.log(value)
        })
    }, [])

    return (
        <div className={styles.themeGenerator}>
            <h1 className={styles.h1}>
                <MdOutlineDesignServices/>Theme Generator <MdOutlineDesignServices/>
                <AiOutlineClose title='Close Theme Generator' className={styles.btnClose} onClick={() => props.closeThemeGenerator()}/>
            </h1>
            {JSONThemes == null 
                ? <Loader/>
                : <div className={styles.themeGeneratorContenair}>
                    <FormContenairTheme></FormContenairTheme>
                    <ExemplePage></ExemplePage>
                  </div>
            }
        </div>
    )
}