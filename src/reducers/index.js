import authentication from './authentication';
import spinner from './spinner';
import load from './load';

import { combineReducers } from 'redux';

export default combineReducers({
    authentication,
    spinner,
    load
});