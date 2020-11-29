import React, { useState } from 'react';
import FindPwResult from './FindPwResult';
import FindPwForm from './FindPwForm';



export default (props)=>{
    const [screen,setScreen] = useState("form");
    const [userId,setUserId] = useState("");

    const changeScreen = (_screen,_id)=>{
        setUserId(_id);
        setScreen(_screen);
    }

    return (
        <>
            {screen === "form" ? <FindPwForm passResult={changeScreen} /> :  <FindPwResult userId={userId} navigation={props.navigation}/>}
        </>
    )
}