import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {TextInput,StyleSheet,View,TouchableWithoutFeedback,Keyboard} from 'react-native'
import { BoldText } from '../../customComponents';
import Timer from '../../Timer';
import RadioButtonRN from 'radio-buttons-react-native';
import * as dialog from '../../../actions/dialog';
import * as timer from '../../../actions/timer'
import * as spinner from '../../../actions/spinner';
import Axios from '../../../modules/Axios';
import { useTranslation } from 'react-i18next';

const FindPwForm = (props)=>{
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [name,setName] = useState("");
    const [target,setTarget] = useState("");
    const [certNum,setCertNum] = useState("");
    const [requestBtn,setRequestBtn] = useState({active:false,textColor:"#FFFFFF",bgColor:"#8D3981",text:t("common_auth_1")})
    const [checkBtn,setCheckBtn] = useState({active:true,textColor:"#A7A7A7",bgColor:"#E5E5E5"});
    const [resultBtn,setResultBtn] = useState({active:true,textColor:"#A7A7A7",bgColor:"#E5E5E5"});
    const [request,setRequest] = useState(false);
    const [userId,setUserId] = useState("");
    const [returnId,setReturnId] = useState("");
    const [errorText,setErrorText] = useState({text:"-",color:"#FFFFFF"});
    const [errorText2,setErrorText2] = useState({text:"-",color:"#FFFFFF"});

    const activeCheckBtn = (text)=>{
        setCertNum(text);
        if(text.length===6) {
            setCheckBtn({active:false,textColor:"#FFFFFF",bgColor:"#8D3981"});
        } else {
            setCheckBtn({active:true,textColor:"#A7A7A7",bgColor:"#E5E5E5"});
        }
    }
    const message = (msg)=>{
        if(msg) {
            return (<>
                    <BoldText text={msg} customStyle={{textAlign:"center"}}/>
                </>)
        } else {
            return (
                <>
                    <BoldText text={t('alert_find_12')} customStyle={{textAlign:"center",lineHeight:20,color:"#EE1818"}}/>
                    <BoldText text={t("alert_find_13")} customStyle={{textAlign:"center",lineHeight:20}}/>
                </>
            )
        }
    }
    const onRequest = async()=>{
        setErrorText({text:"-",color:"#FFFFFF"});
        if(name === "" || target === "" || userId === "") setErrorText({text:t("alert_find_11"),color:"#EE1818"})
        else {
            if(request === true){
                dispatch(timer.timeRequest());
                setCheckBtn({active:true,textColor:"#A7A7A7",bgColor:"#E5E5E5"});
                setCertNum("");
                setErrorText2({text:"-",color:"#FFFFFF"}); 
            }
            dispatch(spinner.showSpinner());
            const {data} = await Axios.get('/users/pw/cert-number',{params:{name:name,target:target,id:userId}});
            dispatch(spinner.hideSpinner());
            if(data.result === "success") {
                let text = t("alert_find_3");
                dispatch(dialog.openDialog("alert",(
                        <>
                            <BoldText text={text} customStyle={{textAlign:"center",lineHeight:20}}/>
                        </>
                ),()=>{
                    setRequestBtn({...requestBtn,...{text:t("alert_find_4")}});
                    setRequest(true);
                    dispatch(dialog.closeDialog());
                })); 
            } else {
                dispatch(dialog.openDialog("alert",message(data.msg))); 
            }
        }
    }

    const onCheck= async()=>{
        Keyboard.dismiss();
        setErrorText2({text:"-",color:"#FFFFFF"});
        const {data} = await Axios.get("/users/check-cert-number",{params:{cert:certNum}});
        if(data.result === 'success') {
            setReturnId(data.userId);
            setRequestBtn({...requestBtn,...{active:true,textColor:"#A7A7A7",bgColor:"#E5E5E5"}});
            setCheckBtn({active:true,textColor:"#A7A7A7",bgColor:"#E5E5E5"})
            setResultBtn({active:false,textColor:"#FFFFFF",bgColor:"#8D3981"});
            setErrorText2({text:t("alert_find_5"),color:"#021AEE"});
        } else {
            setErrorText2({text:t("alert_find_6"),color:"#EE1818"});
        }
    }

    const onResult = ()=>{
        props.passResult("result",returnId);
    }

    return (
        <>
            <View style={{marginTop:20}}>
                <View style={{borderWidth:1,borderColor:"#B6B6B6",padding:16,borderRadius:6}}>
                    <TextInput placeholderTextColor={"#A7A7A7"} placeholder={t('login_find_10')} onChangeText={text=>setUserId(text)} style={{padding:0,fontSize:13,color:"#2B2B2B",height:20,fontFamily:"NotoSans-Regular"}}/>
                </View>
                <View style={{borderWidth:1,borderColor:"#B6B6B6",padding:16,borderRadius:6,marginTop:10}}>
                    <TextInput placeholderTextColor={"#A7A7A7"} placeholder={t("login_find_11")} onChangeText={text=>setName(text)} style={{padding:0,fontSize:13,color:"#2B2B2B",height:20,fontFamily:"NotoSans-Regular"}}/>
                </View>
                <View style={{borderWidth:1,borderColor:"#B6B6B6",padding:8,paddingLeft:16,borderRadius:6,marginTop:10,flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
                    <TextInput placeholderTextColor={"#A7A7A7"} placeholder={t("login_find_13")} onChangeText={text=>setTarget(text)} keyboardType="default" style={{padding:0,fontSize:13,color:"#2B2B2B",height:20,fontFamily:"NotoSans-Regular"}}/>
                    <TouchableWithoutFeedback onPress={onRequest} disabled={requestBtn.active}>
                        <View style={{justifyContent:"center",alignItems:'center',backgroundColor:requestBtn.bgColor,width:120,height:30,borderRadius:6}}>
                            <BoldText text={requestBtn.text} customStyle={{fontSize:13,color:requestBtn.textColor}}/>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </View>
            <View style={{flexDirection:"row",marginTop:8,justifyContent:"space-between"}}>
                <BoldText text={errorText.text} customStyle={{color:errorText.color, fontSize:10}}/>
                {request? <Timer /> : null}
            </View>
            {request?
                <>
                    <View style={{marginTop:10,borderRadius:6,borderWidth:1,borderColor:"#A9A9A9",flexDirection:"row", paddingLeft:16,paddingRight:8,paddingVertical:8,justifyContent:"space-between",alignItems:"center"}}>
                        <TextInput onChangeText={text=>activeCheckBtn(text)} value={certNum} placeholderTextColor={"#A7A7A7"} placeholder={t("alert_find_10")} keyboardType="numeric" maxLength={6} style={{padding:0,fontSize:13,color:"#2B2B2B",height:20,fontFamily:"NotoSans-Regular"}} />
                        <TouchableWithoutFeedback onPress={onCheck} disabled={checkBtn.active}>
                            <View style={{justifyContent:"center",alignItems:'center',backgroundColor:checkBtn.bgColor,width:90,height:30, borderRadius:6}}>
                                <BoldText text={t("common_confirm_1")} customStyle={{fontSize:13,color:checkBtn.textColor}}/>
                            </View>
                        </TouchableWithoutFeedback>
                    </View> 
                    <View style={{marginTop:8}}>
                        <BoldText text={errorText2.text} customStyle={{fontSize:13,color:errorText2.color,fontSize:10}}/>
                    </View>
                </>
                : 
                null
            }
            <TouchableWithoutFeedback disabled={resultBtn.active} onPress={onResult}>
                <View style={{marginTop:20,justifyContent:'center',alignItems:"center",backgroundColor:resultBtn.bgColor,borderRadius:6,height:46}}>
                    <BoldText text={t("common_confirm_1")} customStyle={{fontSize:13,color:resultBtn.textColor,fontSize:13}}/>
                </View>
            </TouchableWithoutFeedback>
        </>
    )
}

const styles = StyleSheet.create({
    inputForm:{
        fontFamily:"NotoSans-Regular"
    }
})
export default FindPwForm;