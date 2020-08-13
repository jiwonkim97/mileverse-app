import authentication from './authentication';
import spinner from './spinner';
import toast from './toast';
import load from './load';

import { combineReducers } from 'redux';

export default combineReducers({
    authentication,
    spinner,
    toast,
    load
});