import {
    CLOSE_DIALOG,
    OPEN_DIALOG,
} from './ActionTypes';

export function openDialog(mode,contents,callback) {
    return {
        type: OPEN_DIALOG,
        mode:mode,
        contents:contents,
        callback:callback
    };
}

export function closeDialog() {
    return {
        type: CLOSE_DIALOG
    };
}