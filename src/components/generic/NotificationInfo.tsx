import styles from 'styles/components/generic/notification.module.scss'
import React, { useEffect, useRef, useContext } from "react";
import { IoClose } from 'react-icons/io5'
import { gsap } from 'gsap'
import { NotificationContext } from '@/context/NotificationContext';



type NotificationProps = {
    texte: string
}

export function NotificationInfo(this:any, props:NotificationProps):JSX.Element{
    const refNotif = useRef(null)

    const { notifications, addNotification, removeNotification } = useContext(NotificationContext);

    useEffect(() => {
        gsap.from(refNotif.current, {
            y: +300,
            duration: 0.4
        })
        setTimeout(() => {
            handleCloseNotif()
        }, 3000);
    },[])

    const handleCloseNotif = () => {
        gsap.to(refNotif.current, {
            y: +300,
            duration: 0.4
        }).then(() => {
            removeNotification(props.texte)
        })
    }

    return (
        <div ref={refNotif} className={styles.notification}>
            <div className={styles.headerNotif}>
                <IoClose onClick={handleCloseNotif}></IoClose>

            </div>
            <div className={styles.textContenair}>
                <p>{props.texte}</p>
            </div>
        </div>
    )
}