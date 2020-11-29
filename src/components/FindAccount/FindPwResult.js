import React, { useEffect, useState } from 'react';
import {useDispatch} from "react-redux";
import {View,StyleSheet,TouchableWithoutFeedback,TextInput} from 'react-native'
import { BoldText,RegularText } from '../customComponents';
import Axios from '../../modules/Axios';
import * as dialog from '../../actions/dialog'

const FindPwResult = (props)=>{
    const regex = /^.*(?=^.{8,16}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;
    const dispatch = useDispatch();
    const [password,setPassword] = useState("");
    const [password2,setPassword2] = useState("");
    const [errorText,setErrorText] = useState({text:"-",color:"#FFFFFF"});
    const [errorText2,setErrorText2] = useState({text:"-",color:"#FFFFFF"});

    const onCahngePw = ()=>{
        setErrorText({text:"-",color:"#FFFFFF"});
        setErrorText2({text:"-",color:"#FFFFFF"});

        if(!regex.test(password)){
            setErrorText({text:"* 8~16자 영문, 숫자, 특수문자를 사용하세요.",color:"#FF3B3B"});
        }else if(!regex.test(password)){
            setErrorText2({text:"* 8~16자 영문, 숫자, 특수문자를 사용하세요.",color:"#FF3B3B"});
        }else if(password !== password2){
            setErrorText2({text:"* 비밀번호가 일치하지 않습니다.",color:"#FF3B3B"});
        } else {
            Axios.put("/users/miss/passwords",{password:password2,id:props.userId}).then(({data})=>{
                if(data.result === "success") {
                    dispatch(dialog.openDialog("alert",(
                        <>
                            <BoldText text={"변경이 완료되었습니다."} customStyle={{textAlign:"center",lineHeight:20}}/>
                        </>
                    ),()=>{
                        dispatch(dialog.closeDialog());
                        props.navigation.navigate("Login");
                    }));
                } else {
                    dispatch(dialog.openDialog("alert",(
                        <>
                            <BoldText text={data.msg} customStyle={{textAlign:"center",lineHeight:20}}/>
                        </>
                    )));
                }
            })
        }
    }

    return (
        <View style={{flex:1,marginTop:30}}>
            <View>
                <BoldText text={"비밀번호 재설정"}/>
                <RegularText text={"회원님의 계정 비밀번호를 재설정 해주세요."} customStyle={{marginTop:10}}/>
            </View>
            <View style={{marginTop:30}}>
                <View>
                    <View style={styles.inputBox}>
                        <TextInput placeholderTextColor={"#A7A7A7"} onChangeText={(text)=>{setPassword(text)}} secureTextEntry={true} placeholder={"비밀번호를 입력해주세요"} style={styles.input}/>
                    </View>
                    <View style={{marginTop:8}}>
                        <BoldText text={errorText.text} customStyle={{color:errorText.color,fontSize:10}}/>
                    </View>
                    <View style={[styles.inputBox,{marginTop:10
                    
                    }]}>
                        <TextInput placeholderTextColor={"#A7A7A7"} onChangeText={(text)=>{setPassword2(text)}} secureTextEntry={true} placeholder={"비밀번호를 다시 한 번 입력해주세요"} style={styles.input}/>
                    </View>
                    <View style={{marginTop:8}}>
                        <BoldText text={errorText2.text} customStyle={{color:errorText2.color,fontSize:10}}/>
                    </View>
                </View>
            </View>
            <TouchableWithoutFeedback onPress={onCahngePw}>
                <View style={{marginTop:30,borderRadius:6,backgroundColor:"#8D3981",justifyContent:"center",alignItems:"center",height:46}}>
                    <BoldText text={"확인"} customStyle={{color:"#FFFFFF",fontSize:14}}/>
                </View>
            </TouchableWithoutFeedback>
        </View>
    )
}

const styles = StyleSheet.create({
    inputBox:{
        borderWidth:1,
        borderColor:"#B6B6B6",
        padding:16,
        borderRadius:6
    },
    input:{
        padding:0,
        fontSize:13,
        color:"#2B2B2B",
        height:14,
        fontFamily:"NotoSans-Regular"
    }
});
export default FindPwResult;