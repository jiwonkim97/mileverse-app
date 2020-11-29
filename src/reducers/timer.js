import * as types from '../actions/ActionTypes';
import update from 'react-addons-update';

const initialState = {
    flag: false
};

export default function timer(state, action) {
    if(typeof state === "undefined")
        state = initialState;
    switch(action.type) {
        case types.TIME_RESET:
            return update(state, {
                flag: { $set: action.flag }
            });
        default:
            return state;
    }
}