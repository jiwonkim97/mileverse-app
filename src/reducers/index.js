import authentication from './authentication';
import spinner from './spinner';
import load from './load';
import global from './global';
import dialog from './dialog';
import timer from './timer';

import { combineReducers } from 'redux';

export default combineReducers({
    authentication,
    spinner,
    load,
    global,
    dialog,
    timer
});