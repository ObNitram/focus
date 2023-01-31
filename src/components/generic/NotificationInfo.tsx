import styles from 'styles/components/generic/notification.module.scss'
import React, { useEffect, useRef, useContext } from "react";
import { IoClose } from 'react-icons/io5'
import { gsap } from 'gsap'
import { NotificationContext, NotificationLevelEnum, NotificationType } from '@/context/NotificationContext';



type NotificationProps = {
    notification: NotificationType
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
            removeNotification(props.notification)
        })
    }

    const getClassType = () => {
        switch(props.notification.level){
            case NotificationLevelEnum.ERROR : {
                return styles.error
            }
            case NotificationLevelEnum.WARNING : {
                return styles.warning
            }
            case NotificationLevelEnum.SUCESS : {
                return styles.sucess
            }
        }
    }

    return (
        <div ref={refNotif} className={`${styles.notification} ${getClassType()}`}>
            <div className={styles.headerNotif}>
                <p>
                {props.notification.level == NotificationLevelEnum.ERROR && 'ERROR'}
                {props.notification.level == NotificationLevelEnum.WARNING && 'WARNING'}
                {props.notification.level == NotificationLevelEnum.SUCESS && 'SUCESS'}
                </p>
                <IoClose onClick={handleCloseNotif} color={'red'}></IoClose>
            </div>
            <div className={styles.textContenair}>
                <p>{props.notification.text}</p>
            </div>
        </div>
    )
}