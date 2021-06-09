import React, { useEffect, useState } from 'react';
import {useDispatch} from "react-redux";
import {View,StyleSheet,TouchableWithoutFeedback,TextInput} from 'react-native'
import { BoldText,RegularText } from '../customComponents';
import Axios from '../../modules/Axios';
import * as dialog from '../../actions/dialog'
import { useTranslation } from 'react-i18next';

const FindPwResult = (props)=>{
    const { t } = useTranslation();
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
            setErrorText({text:t('alert_pw_2'),color:"#FF3B3B"});
        }else if(!regex.test(password)){
            setErrorText2({text:t("alert_pw_2"),color:"#FF3B3B"});
        }else if(password !== password2){
            setErrorText2({text:t("alert_pw_1"),color:"#FF3B3B"});
        } else {
            Axios.put("/users/miss/passwords",{password:password2,id:props.userId}).then(({data})=>{
                if(data.result === "success") {
                    dispatch(dialog.openDialog("alert",(
                        <>
                            <BoldText text={t("alert_find_8")} customStyle={{textAlign:"center",lineHeight:20}}/>
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
                <BoldText text={t("alert_find_9")}/>
                <RegularText text={t("login_find_14")} customStyle={{marginTop:10}}/>
            </View>
            <View style={{marginTop:30}}>
                <View>
                    <View style={styles.inputBox}>
                        <TextInput placeholderTextColor={"#A7A7A7"} onChangeText={(text)=>{setPassword(text)}} secureTextEntry={true} placeholder={t("signup_13")} style={styles.input}/>
                    </View>
                    <View style={{marginTop:8}}>
                        <BoldText text={errorText.text} customStyle={{color:errorText.color,fontSize:10}}/>
                    </View>
                    <View style={[styles.inputBox,{marginTop:10}]}>
                        <TextInput placeholderTextColor={"#A7A7A7"} onChangeText={(text)=>{setPassword2(text)}} secureTextEntry={true} placeholder={t("signup_15")} style={styles.input}/>
                    </View>
                    <View style={{marginTop:8}}>
                        <BoldText text={errorText2.text} customStyle={{color:errorText2.color,fontSize:10}}/>
                    </View>
                </View>
            </View>
            <TouchableWithoutFeedback onPress={onCahngePw}>
                <View style={{marginTop:30,borderRadius:6,backgroundColor:"#8D3981",justifyContent:"center",alignItems:"center",height:46}}>
                    <BoldText text={t("common_confirm_1")} customStyle={{color:"#FFFFFF",fontSize:14}}/>
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
        height:20,
        fontFamily:"NotoSans-Regular"
    }
});
export default FindPwResult;