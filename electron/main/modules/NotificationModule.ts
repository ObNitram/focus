import * as WindowsManagement from './WindowsManagement'

export enum NotificationLevelEnum {
    WARNING,
    SUCESS,
    ERROR
}

export function showNotification(msg: string, level: NotificationLevelEnum) {
    WindowsManagement.getMainWindow()?.webContents.send('notification', { text: msg, level: level })
}
