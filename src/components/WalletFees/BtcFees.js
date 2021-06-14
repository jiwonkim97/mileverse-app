import React,{useEffect, useState} from 'react';
import {View,StyleSheet,TouchableWithoutFeedback,TextInput} from 'react-native';
import {BoldText} from '../customComponents';

export default (props)=>{
    const [lowBtn,setLowBtn] = useState({bg:"#8D3981",textColor:"#FFFFFF"});
    const [moderateBtn,setModerateBtn] = useState({bg:"#EBEBEB",textColor:"#C4C4C4"});
    const [highBtn,setHighBtn] = useState({bg:"#EBEBEB",textColor:"#C4C4C4"});
    const [fee,setFee] = useState("");

    const setFeesBtn = (_mode)=>{
        if(_mode === "low" ) {
            setLowBtn({bg:"#8D3981",textColor:"#FFFFFF"});
            setModerateBtn({bg:"#EBEBEB",textColor:"#C4C4C4"});
            setHighBtn({bg:"#EBEBEB",textColor:"#C4C4C4"});
            setFee(String(props.gasFees.hourFee*0.00000001));
        } else if(_mode === "moderate") {
            setLowBtn({bg:"#EBEBEB",textColor:"#C4C4C4"});
            setModerateBtn({bg:"#8D3981",textColor:"#FFFFFF"});
            setHighBtn({bg:"#EBEBEB",textColor:"#C4C4C4"});
            setFee(String(props.gasFees.halfHourFee*0.00000001));
        } else if(_mode === "high"){
            setLowBtn({bg:"#EBEBEB",textColor:"#C4C4C4"});
            setModerateBtn({bg:"#EBEBEB",textColor:"#C4C4C4"});
            setHighBtn({bg:"#8D3981",textColor:"#FFFFFF"});
            setFee(String(props.gasFees.fastestFee*0.00000001));
        }
    }
    return (
        <View>
            <View style={{marginTop:16,borderWidth:1,borderColor:"#F2F2F2"}} />
            <View style={{marginTop:26,marginBottom:100}}>
                <BoldText text={"[유의사항]"} customStyle={styles.noticeText}/>
                <BoldText text={"잘못 전송한 경우 취소가 불가능합니다.\n전송 시 전송 수수료(0.0002 BTC)가 발생합니다."} customStyle={[styles.noticeText,{marginTop:9,lineHeight:18}]}/>
            </View>   
        </View>
    )
}
const styles = StyleSheet.create({
    feesBtnWrap:{
        flex:1,
        justifyContent:'center',
        alignItems:"center"
    },input:{
        padding:0,
        fontFamily:"NotoSans-Regular",
        fontSize:13,
        color:"#2B2B2B",
        width:200
    },noticeText:{
        color:"#3A3A3A",
        fontSize:12
    }
})