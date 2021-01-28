import React, { useState } from 'react';
import FindIdResult from '../FindIdResult';
import FindIdFormEn from './FindIdFormEn';



export default (props)=>{
    const [screen,setScreen] = useState("form");
    const [userId,setUserId] = useState("");

    const changeScreen = (_screen,_id)=>{
        setUserId(_id);
        setScreen(_screen);
    }

    return (
        <>
            {screen === "form" ? <FindIdFormEn passResult={changeScreen} /> :  <FindIdResult userId={userId} navigation={props.navigation}/>}
        </>
    )
}