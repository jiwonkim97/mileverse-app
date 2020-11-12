import * as types from '../actions/ActionTypes';
import update from 'react-addons-update';

const initialState = {
    stat:false,
    mode:"",
    contents:null,
    callback:null
};

export default function alert(state, action) {
    if(typeof state === "undefined")
        state = initialState;
    switch(action.type) {
        case types.OPEN_DIALOG:
            return update(state, {
                stat: { $set: true },
                mode: { $set: action.mode },
                contents : { $set: action.contents },
                callback : { $set: action.callback },
            });
        case types.CLOSE_DIALOG:
            return update(state, {
                stat: { $set: false },
                mode: { $set: "" },
                contents: { $set: null },
                callback: { $set: null }
            });
        default:
            return state;
    }
}