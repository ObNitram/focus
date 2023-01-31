import { createContext } from "react";

export enum NotificationLevelEnum {
    WARNING,
    SUCESS,
    ERROR
}

export type NotificationType = {
    text: string,
    level: NotificationLevelEnum,
}

interface NotificationContextType {
    notifications: NotificationType[];
    addNotification: (s:string, level:NotificationLevelEnum) => void
    removeNotification: (notificationToDelete:NotificationType) => void;
}


export const NotificationContext = createContext<NotificationContextType>({
    notifications: [],
    addNotification: (s:string, level:NotificationLevelEnum) => {},
    removeNotification: (notificationToDelete:NotificationType) => {}
});