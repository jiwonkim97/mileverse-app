import {
    AUTH_LOGIN,
    AUTH_LOGOUT,
    AUTH_LOGIN_SUCCESS,
    AUTH_LOGIN_FAILURE,
    AUTH_UPDATE_MVP,
    INIT_REQUEST_STAT,
    FAIL_REQUEST_STAT
} from './ActionTypes';
import axios from 'axios';

export function loginRequest(id, password) {
    return (dispatch,getState) =>{
        dispatch(login());
        // http://13.209.142.239:3000/users/login
        return axios.post('http://13.209.142.239:3010/users/login',{id:id,password:password})
            .then((response)=>{
                var _response = response.data
                _response.result === "success" ? dispatch(loginSuccess(_response.username,_response.mvp,_response.token)) : dispatch(loginFailure())
            }).catch((error)=>{
                dispatch(loginFailure());
            }).then(()=> { return getState().authentication.login.status });
    }
}

export function logoutRequest() {
    return (dispatch,getState) =>{
        return axios.post("http://13.209.142.239:3010/users/logout",{}).then(response=>{
            let _response = response.data;
            if(_response.result === "success") {
                dispatch(logout())
            }
        }).catch(error=>{
            console.log(error);
        }).then(()=> { return getState().authentication.login.status });
    }
}

export function verifyRequest(_parmas) {
    return (dispatch,getState) =>{
        dispatch(login());
        // http://13.209.142.239:3000/users/login
        return axios.post('http://13.209.142.239:3010/users/verify',_parmas)
            .then((response)=>{
                var _response = response.data
                _response.status === "login" ?  dispatch(loginSuccess(_response.username,_response.mvp,_response.token)) : dispatch(logout())
            }).catch((error)=>{
                // dispatch(loginFailure());
            }).then(()=> { return getState().authentication.login.status });
    }
}

export function convertMVPRequest(_amount) {
    return (dispatch,getState) =>{
        dispatch(initRequest());
        return axios.post('http://13.209.142.239:3010/api/point/trustToMvp',{amount:_amount},{headers:{"x-access-token":getState().authentication.status.token}})
            .then((response)=>{
                var _response = response.data
                _response.result === "success" ? dispatch(udpateMvp(_response.mvp)) : dispatch(failureRequest(_response.msg))
            }).catch((error)=>{
                dispatch(failureRequest());
            }).then(()=> { return {stat:getState().authentication.request.status,msg:getState().authentication.request.msg} });
    }
}

export function buyGiftConByMVP(_item,_comp) {
    return (dispatch,getState) =>{
        dispatch(initRequest());
        return axios.post('http://13.209.142.239:3010/api/point/useMvp',{item:_item,comp:_comp},{headers:{"x-access-token":getState().authentication.status.token}})
            .then((response)=>{
                var _response = response.data
                _response.result === "success" ? dispatch(udpateMvp(_response.mvp)) : dispatch(failureRequest(_response.msg))
            }).catch((error)=>{
                dispatch(failureRequest());
            }).then(()=> { return {stat:getState().authentication.request.status,msg:getState().authentication.request.msg} });
    }
}

export function login() {
    return {
        type: AUTH_LOGIN
    };
}

export function logout() {
    return {
        type: AUTH_LOGOUT
    };
}

export function loginSuccess(username,mvp,token) {
    return {
        type: AUTH_LOGIN_SUCCESS,
        username,
        mvp,
        token
    };
}

export function loginFailure() {
    return {
        type: AUTH_LOGIN_FAILURE
    };
}

export function initRequest() {
    return {
        type: INIT_REQUEST_STAT
    };
}

export function failureRequest(msg) {
    return {
        type: FAIL_REQUEST_STAT,
        msg
    };
}

export function udpateMvp(mvp) {
    return {
        type: AUTH_UPDATE_MVP,
        mvp
    }
}