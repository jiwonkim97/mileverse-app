import {
    AUTH_LOGIN,
    AUTH_LOGOUT,
    AUTH_LOGIN_SUCCESS,
    AUTH_LOGIN_FAILURE,
    AUTH_UPDATE_MVP,
    AUTH_UPDATE_PIN,
    AUTH_UPDATE_WALLET,
    INIT_REQUEST_STAT,
    FAIL_REQUEST_STAT
} from './ActionTypes';
import Axios from '../modules/Axios';

export function loginRequest(id, password) {
    return (dispatch,getState) =>{
        dispatch(login());
        return Axios.post('/users/login',{id:id,password:password})
            .then(response=>{
                const _response = response.data;
                _response.result === "success" ? dispatch(loginSuccess(_response.username,_response.mvp,_response.code,_response.pin,_response.wallet)) : dispatch(loginFailure())
                return _response
            }).catch((error)=>{
                dispatch(loginFailure());
            }).then((_response)=> { return {stat:getState().authentication.login.status,msg:_response.msg} });
    }
}

export function logoutRequest() {
    return (dispatch,getState) =>{
        return Axios.post("/users/logout").then(response=>{
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
        return Axios.post('/users/verify',_parmas)
            .then((response)=>{
                var _response = response.data
                _response.status === "login" ?  dispatch(loginSuccess(_response.username,_response.mvp,_response.code,_response.pin,_response.wallet)) : dispatch(logout())
            }).catch((error)=>{
                dispatch(logout())
            }).then(()=> { return getState().authentication.login.status });
    }
}

export function convertMVPRequest(_amount) {
    return (dispatch,getState) =>{
        dispatch(initRequest());
        return Axios.post('/api/point/trustToMvp',{amount:_amount})
            .then((response)=>{
                var _response = response.data
                _response.result === "success" ? dispatch(udpateMvp(_response.mvp)) : dispatch(failureRequest(_response.msg))
            }).catch((error)=>{
                dispatch(failureRequest());
            }).then(()=> { return {stat:getState().authentication.request.status,msg:getState().authentication.request.msg} });
    }
}

export function buyGiftConByMVP(_item,supply,event) {
    return (dispatch,getState) =>{
        dispatch(initRequest());
        return Axios.post('/api/gifticon/v2/sending',{item:_item,supply:supply,event:event})
            .then((response)=>{
                var _response = response.data
                _response.result === "success" ? dispatch(udpateMvp(_response.mvp)) : dispatch(failureRequest(_response.msg))
            }).catch((error)=>{
                dispatch(failureRequest());
            }).then(()=> { return {stat:getState().authentication.request.status,msg:getState().authentication.request.msg} });
    }
}

export function changePinRequest(_pin) {
    return (dispatch,getState) =>{
        dispatch(initRequest());
        return Axios.put("/users/pin",{pin:_pin}).then(({data})=>{
            data.result === "success" ? dispatch(udpatePin(_pin)) : dispatch(failureRequest(_response.msg));
        }).then(()=>{
             return {stat:getState().authentication.request.status,msg:getState().authentication.request.msg}
        })
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

export function loginSuccess(username,mvp,code,pin,wallet) {
    return {
        type: AUTH_LOGIN_SUCCESS,
        username,
        mvp,
        code,
        pin,
        wallet
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
export function udpatePin(pin) {
    return {
        type: AUTH_UPDATE_PIN,
        pin
    }
}
export function updateWallet() {
    return {
        type: AUTH_UPDATE_WALLET
    }
}