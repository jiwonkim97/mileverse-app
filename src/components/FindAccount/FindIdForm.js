import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {TextInput,StyleSheet,View,TouchableWithoutFeedback,Keyboard} from 'react-native'
import { BoldText } from '../customComponents';
import Timer from '../Timer';
import RadioButtonRN from 'radio-buttons-react-native';
import * as dialog from '../../actions/dialog';
import * as timer from '../../actions/timer'
import * as spinner from '../../actions/spinner';
import Axios from '../../modules/Axios';


const FindIdForm = (props)=>{
    const dispatch = useDispatch();
    const [name,setName] = useState("");
    const [target,setTarget] = useState("");
    const [certNum,setCertNum] = useState("");
    const [requestBtn,setRequestBtn] = useState({active:false,textColor:"#FFFFFF",bgColor:"#8D3981",text:"인증요청"})
    const [checkBtn,setCheckBtn] = useState({active:true,textColor:"#A7A7A7",bgColor:"#E5E5E5"});
    const [resultBtn,setResultBtn] = useState({active:true,textColor:"#A7A7A7",bgColor:"#E5E5E5"});
    const [label,setLabel] = useState("");
    const [request,setRequest] = useState(false);
    const [userId,setUserId] = useState("");
    const [placeText,setPlaceText] = useState("휴대전화를 입력해주세요(-없이)");
    const [errorText,setErrorText] = useState({text:"-",color:"#FFFFFF"});
    const [errorText2,setErrorText2] = useState({text:"-",color:"#FFFFFF"});

    useEffect(()=>{
        if(label === "휴대전화") {
            setPlaceText("휴대전화를 입력해주세요(-없이)")
        } else {
            setPlaceText("이메일을 입력해주세요")
        }
        setRequestBtn({active:false,textColor:"#FFFFFF",bgColor:"#8D3981",text:"인증요청"});
        setCheckBtn({active:true,textColor:"#A7A7A7",bgColor:"#E5E5E5"});
        setResultBtn({active:true,textColor:"#A7A7A7",bgColor:"#E5E5E5"});
        setErrorText({text:"-",color:"#FFFFFF"});
        setErrorText2({text:"-",color:"#FFFFFF"});
        setRequest(false);
        setCertNum("");

    },[label])

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
                    <BoldText text={"등록된 회원 정보가 없습니다."} customStyle={{textAlign:"center",lineHeight:20,color:"#EE1818"}}/>
                    <BoldText text={"정보를 다시 확인하세요."} customStyle={{textAlign:"center",lineHeight:20}}/>
                </>
            )
        }
    }
    const onRequest = async()=>{
        setErrorText({text:"-",color:"#FFFFFF"});
        if(name === "" || target === "" ) setErrorText({text:"* 해당 정보를 입력해주세요",color:"#EE1818"});
        else {
            if ( request === true ) {
                dispatch(timer.timeRequest());
                setCheckBtn({active:true,textColor:"#A7A7A7",bgColor:"#E5E5E5"});
                setCertNum("");
                setErrorText2({text:"-",color:"#FFFFFF"}); 
            }
            dispatch(spinner.showSpinner());
            const {data} = await Axios.get('/users/id/cert-number',{params:{name:name,target:target}});
            dispatch(spinner.hideSpinner());
            if(data.result === "success") {
                let text = `요청하신 인증번호가 \n${label==="이메일"?"이메일로":""} 발송되었습니다.`;
                dispatch(dialog.openDialog("alert",(
                        <>
                            <BoldText text={text} customStyle={{textAlign:"center",lineHeight:20}}/>
                        </>
                ),()=>{
                    setRequestBtn({...requestBtn,...{text:"재 요청"}})
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
            setUserId(data.userId);
            setRequestBtn({...requestBtn,...{active:true,textColor:"#A7A7A7",bgColor:"#E5E5E5"}});
            setCheckBtn({active:true,textColor:"#A7A7A7",bgColor:"#E5E5E5"})
            setResultBtn({active:false,textColor:"#FFFFFF",bgColor:"#8D3981"});
            setErrorText2({text:"* 인증이 완료되었습니다.",color:"#021AEE"});
        } else {
            setErrorText2({text:"* 인증 번호가 일치하지 않습니다.",color:"#EE1818"})
        }
    }

    const onResult = ()=>{
        props.passResult("result",userId);
    }

    return (
        <>
            <View style={{marginVertical:20,alignItems:'flex-start',justifyContent:"center"}}>
                <RadioButtonRN
                    data={[{label: '휴대전화'},{label: '이메일'}]}
                    box={false}
                    initial={1}
                    duration={100}
                    activeColor={"#8D3981"}
                    textColor={"#2B2B2B"}
                    textStyle={{marginLeft:8,fontSize:13,fontFamily:"NanumSquareB"}}
                    boxStyle={{width:90,marginLeft:4}}
                    selectedBtn={({label}) => setLabel(label)}
                    circleSize={12}
                    style={{flexDirection:"row",justifyContent:"flex-end",marginTop:-10}}
                />
            </View>
            <View>
                <View style={{borderWidth:1,borderColor:"#B6B6B6",padding:16,borderRadius:6}}>
                    <TextInput placeholderTextColor={"#A7A7A7"} placeholder={"이름을 입력해주세요"} onChangeText={text=>setName(text)} style={{padding:0,fontSize:13,color:"#2B2B2B",height:14}}/>
                </View>
                <View style={{borderWidth:1,borderColor:"#B6B6B6",padding:8,paddingLeft:16,borderRadius:6,marginTop:10,flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
                    <TextInput placeholderTextColor={"#A7A7A7"} placeholder={placeText} onChangeText={text=>setTarget(text)} keyboardType="default" style={{padding:0,fontSize:13,color:"#2B2B2B",height:14}}/>
                    <TouchableWithoutFeedback onPress={onRequest} disabled={requestBtn.active}>
                        <View style={{justifyContent:"center",alignItems:'center',backgroundColor:requestBtn.bgColor,width:90,height:30,borderRadius:6}}>
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
                        <TextInput onChangeText={text=>activeCheckBtn(text)} value={certNum} placeholderTextColor={"#A7A7A7"} placeholder={"인증번호를 입력해주세요"} keyboardType="numeric" maxLength={6} style={{padding:0,fontSize:13,color:"#2B2B2B",height:14}} />
                        <TouchableWithoutFeedback onPress={onCheck} disabled={checkBtn.active}>
                            <View style={{justifyContent:"center",alignItems:'center',backgroundColor:checkBtn.bgColor,width:90,height:30, borderRadius:6}}>
                                <BoldText text={"확인"} customStyle={{fontSize:13,color:checkBtn.textColor}}/>
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
                    <BoldText text={"확인"} customStyle={{fontSize:13,color:resultBtn.textColor,fontSize:13}}/>
                </View>
            </TouchableWithoutFeedback>
        </>
    )
}

export default FindIdForm;