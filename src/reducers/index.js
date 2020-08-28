import authentication from './authentication';
import spinner from './spinner';
import load from './load';
import global from './global'

import { combineReducers } from 'redux';

export default combineReducers({
    authentication,
    spinner,
    load,
    global
});