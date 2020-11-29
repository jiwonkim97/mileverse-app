import React,{useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import {BoldText} from "./customComponents";

const Timer = (props)=>{
    const flag = useSelector(state => state.timer.flag);
    const [time,setTime] = useState(179);

    useEffect(()=>{
        if(time>0) {
            const counter = setInterval(()=>{
                setTime(time-1);
            },1000);
            return ()=> clearInterval(counter);
        }
    },[time])

    useEffect(()=>{
        setTime(179)
    },[flag])

    const getTime = (time) =>{
        let m = Math.floor(time/60).toString();
            if(m.length === 1) m = `0${m}`;

            let s = (time % 60).toString()
            if (s.length === 1) s = `0${s}`
        return `인증 유효시간 : ${m}분 : ${s}초`;
    }
    return (
        <BoldText text={getTime(time)} customStyle={{color:"#5D5D5D",fontSize:10}}/>
    )
}

export default Timer;