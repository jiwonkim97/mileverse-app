import React, { useState } from 'react';
import FindIdResult from './FindIdResult';
import FindIdForm from './FindIdForm';



export default (props)=>{
    const [screen,setScreen] = useState("form");
    const [userId,setUserId] = useState("");

    const changeScreen = (_screen,_id)=>{
        setUserId(_id);
        setScreen(_screen);
    }

    return (
        <>
            {screen === "form" ? <FindIdForm passResult={changeScreen} /> :  <FindIdResult userId={userId} navigation={props.navigation}/>}
        </>
    )
}