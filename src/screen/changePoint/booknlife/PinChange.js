import React,{useState,useEffect} from 'react';
import {View,StyleSheet,TextInput,TouchableWithoutFeedback} from 'react-native';
import { BoldText, ExtraBoldText } from '../../../components/customComponents';
import Axios from "../../../modules/Axios";
import {formmatedNumber} from '../../../modules/CommonHelper';

export default(props)=>{
    const [btnActive,setBtnActive] = useState(false);
    const [pin,setPin] = useState("");
    const [pass,setPass] = useState("");
    const [errorTxt,setErrorTxt] = useState("");
    const [viewResult,setViewResult] = useState(false);
    const [balance,setBalance] = useState(0);
    const [editable,setEditable] = useState(true);
    useEffect(()=>{
        if(pass.length === 4 && pin.length === 16) {
            setBtnActive(true);
        } else {
            setBtnActive(false);
        }
    },[pin,pass]);

    const handleCheckBtn = async()=>{
        if(btnActive) {
            const {data} = await Axios.get("/api/booknlifeRouter/pin",{params:{pin:pin,pass:pass}});
            if(data.success === true) {
                setEditable(false)
                setBalance(data.balance)
                setViewResult(true);
                props.pinHandler({pin:pin,pass:pass})
                props.voucherHandler(data.balance)
            } else {
                setErrorTxt(data.message)
            }
        }
    }

    return (
        <View style={{paddingTop:30}}>
            <View style={[styles.inputBox,{backgroundColor:editable?'none':"#F3F3F3"}]}>
                <TextInput placeholder={"상품권 번호(PIN) 16자리"}
                    placeholderTextColor={"#D5C2D3"}
                    maxLength={16}
                    keyboardType={"number-pad"}
                    style={styles.input}
                    onChangeText={value=>setPin(value)}
                    editable={editable}
                />
            </View>
            <View style={[styles.inputBox,{marginTop:10,backgroundColor:editable?"none":"#F3F3F3"}]}>
                <TextInput placeholder={"인증번호 4자리"}
                    placeholderTextColor={"#D5C2D3"}
                    maxLength={4}
                    keyboardType={"number-pad"}
                    style={styles.input}
                    onChangeText={value=>setPass(value)}
                    editable={editable}
                />
            </View>
            {
                viewResult? 
                <View style={{height:76,backgroundColor:'#F3F3F3',borderRadius:6,marginTop:10,justifyContent:'center',alignItems:"center"}}>
                    <BoldText text={"상품권 금액"} customStyle={{fontSize:13}}/>
                    <ExtraBoldText text={`${formmatedNumber(balance)} 원`} customStyle={{fontSize:17,color:"#8D3981",marginTop:6}}/>
                </View>
                :
                <View>
                    {
                    errorTxt !== "" ?
                    <View style={{marginTop:8}}>
                        <BoldText text={errorTxt} customStyle={{color:"#EE1818",fontSize:10}}/>
                    </View>
                    :
                    null
                    }
                    <TouchableWithoutFeedback onPress={handleCheckBtn}>
                        <View style={[styles.inputBox,{marginTop:10,justifyContent:"center",alignItems:"center",borderColor:btnActive?"#8D3981":"#E5E5E5"}]}>
                            <BoldText text={"상품권 금액 확인"} customStyle={{color:btnActive?"#8D3981":"#C9C9C9"}}/>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            }
        </View>
    )
}

const styles = StyleSheet.create({
    inputBox:{
        borderColor:"#E5E5E5",
        borderWidth:1,
        borderRadius:6,
        height:46
    },
    input:{
        fontFamily:"NotoSans-Regular",
        height:46,
        paddingHorizontal:16,
    }
})