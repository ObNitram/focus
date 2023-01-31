import { createContext } from "react";

interface NotificationContextType {
    notifications: string[];
    addNotification: (s: string) => void;
    removeNotification: (s: string) => void;
}

export const NotificationContext = createContext<NotificationContextType>({
    notifications: [],
    addNotification: (s:string) => {},
    removeNotification: (s:string) => {}
});