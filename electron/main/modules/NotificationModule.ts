/**
 * @file NotificationModule.ts
 * @description Contains function for send a notification to the main window
 */
import * as WindowsManagement from './WindowsManagement'

// The different levels of notification
export enum NotificationLevelEnum {
    WARNING,
    SUCESS,
    ERROR
}

/**
 * @description Send a notification to the main window
 * @param msg:string The message of the notification
 * @param level:NotificationLevelEnum The level of the notification
 */
export function showNotification(msg: string, level: NotificationLevelEnum) {
    WindowsManagement.getMainWindow()?.webContents.send('notification', { text: msg, level: level })
}
