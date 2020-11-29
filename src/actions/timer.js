import {
    TIME_RESET
} from './ActionTypes';

export function timeRequest() {
    return (dispatch,getState)=>{
        dispatch(timeReset(!getState().timer.flag))
    }
}

export function timeReset(flag) {
    return {
        type:TIME_RESET,
        flag
    }
}