import * as types from '../actions/ActionTypes';
import update from 'react-addons-update';

const initialState = {
    login: {
        status: 'INIT'
    },
    status: {
        isLoggedIn: false,
    },
    userInfo:{
        mvp:"",
        currentUser:'',
        code:"",
        pin:""
    },request:{
        status:"INIT",
        msg:''
    }
};

export default function authentication(state, action) {
    if(typeof state === "undefined")
        state = initialState;
    switch(action.type) {
        case types.AUTH_LOGIN:
            return update(state, {
                login: {
                    status: { $set: 'WAITING' }
                }
            });
        case types.AUTH_LOGOUT:
            return update(state, {
                login: {
                    status: { $set: 'INIT' }
                },
                status: {
                    isLoggedIn: { $set: false },
                },
                userInfo: {
                    currentUser : {$set: ""},
                    mvp: {$set : ""},
                    code: {$set : ""},
                    pin : {$set : ""}
                }
            });
        case types.AUTH_LOGIN_SUCCESS:
            return update(state, {
                login: {
                    status: { $set: 'SUCCESS' }
                },
                status: {
                    isLoggedIn: { $set: true },
                },userInfo:{
                    currentUser : {$set: action.username},
                    mvp: {$set : action.mvp},
                    code: {$set : action.code},
                    pin: {$set : action.pin}
                }
            });
        case types.AUTH_LOGIN_FAILURE:
            return update(state, {
                login: {
                    status: { $set: 'FAILURE' }
                }
            });
        case types.INIT_REQUEST_STAT:
            return update(state, {
                request: {
                    status: { $set: 'WAITING' }
                }
            });
        case types.FAIL_REQUEST_STAT:
            return update(state, {
                request: {
                    status: { $set: 'FAILURE' },
                    msg: { $set: action.msg }
                }
            });
        case types.AUTH_UPDATE_MVP:
            return update(state, {
                userInfo:{
                    mvp: {$set : action.mvp}
                },
                request:{
                    status: { $set: 'SUCCESS' },
                    msg: { $set: '' },
                }
            });
        case types.AUTH_UPDATE_PIN:
            return update(state, {
                userInfo:{
                    pin: {$set : action.pin}
                },
                request:{
                    status: { $set: 'SUCCESS' },
                    msg: { $set: '' },
                }
            });
        default:
            return state;
    }
}