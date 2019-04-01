import { 
    NOTIFICATION_TYPE_SUCCESS,
    NOTIFICATION_TYPE_ERROR 
} from 'react-redux-notify';

export function successNotification(msg) {
    return {
        message: msg,
        type: NOTIFICATION_TYPE_SUCCESS,
        duration: 2000,
        canDismiss: true,
    }
}

export function errorNotification(msg) {
    return {
        message: msg,
        type: NOTIFICATION_TYPE_ERROR,
        duration: 2000,
        canDismiss: true,
    }
}