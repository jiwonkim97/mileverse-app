import * as types from '../actions/ActionTypes';
import update from 'react-addons-update';

const initialState = {
    load: false,
};

export default function load(state, action) {
    if(typeof state === "undefined")
        state = initialState;
    switch(action.type) {
        case types.APP_LOAD:
            return update(state, {
                load: { $set: true },
            });
        default:
            return state;
    }
}