import React, { useState } from 'react';
import FindPwResult from '../FindPwResult';
import FindPwFormEn from './FindPwFormEn';



export default (props)=>{
    const [screen,setScreen] = useState("form");
    const [userId,setUserId] = useState("");

    const changeScreen = (_screen,_id)=>{
        setUserId(_id);
        setScreen(_screen);
    }

    return (
        <>
            {screen === "form" ? <FindPwFormEn passResult={changeScreen} /> :  <FindPwResult userId={userId} navigation={props.navigation}/>}
        </>
    )
}