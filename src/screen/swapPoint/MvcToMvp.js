import React,{useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {SafeAreaView,View, StyleSheet,TouchableOpacity,Image,ScrollView,TextInput,Alert} from 'react-native';
import CommonStatusbar from '../../components/CommonStatusbar';
import { ExtraBoldText,BoldText,RegularText } from '../../components/customComponents';
import Axios from '../../modules/Axios'
import * as spinner from '../../actions/spinner';
import * as dialog from '../../actions/dialog';
import * as auth from '../../actions/authentication';

export default ({navigation,route})=>{
    const dispatch = useDispatch();
    const [hasMvc,SetHasMvc] = useState(0);
    const [rate,setRate] = useState(0);
    const [changeAmount,setChangeAmount] = useState(0);
    const [inputAmount,setInputAmount] = useState("");
    const [errorStat,setErrorStat] = useState({stat:false,text:""});
    const commaFormat = (num)=>{
        const parts = String(num).split(".")
        return parts[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") +(parts[1] ? "."+parts[1] : "");
    }

    const setBlanceFormat = (num) =>{
        const _fixedNum = Number(num).toFixed(8);
        const _floatNum = parseFloat(_fixedNum);
        if(_floatNum<0.000001) {
            const __str_FixedNum = String(_fixedNum);
            if(__str_FixedNum.slice(-1) === "0") 
                return __str_FixedNum.slice(0,-1);
            else 
                return __str_FixedNum;
        }
        else return _floatNum ;
    }

    const handleInputAmount = (amt)=>{
        if(/^[0-9]*$/.test(amt)) {
            setInputAmount(amt);
            const exchange = Math.round((rate * (amt-(amt*0.0005))));
            if(exchange<0)
                setChangeAmount(0);
            else
                setChangeAmount(exchange);
        }
    }

    const requestChangePoint =()=>{
        setErrorStat({stat:false,text:""})
        if(inputAmount === "")  {
            setErrorStat({stat:true,text:"* 수량을 입력해주세요."})
        } else if(Number(inputAmount) > Number(hasMvc)){
            setErrorStat({stat:true,text:"* 보유한 수량보다 많습니다."})
        } else {
            navigation.navigate("PinCode",{
                mode:"confirm", 
                onGoBack:(_value)=>{
                    if(_value === true) {
                        doChangePoint();
                    }
                }
            });
        }
    }

    const doChangePoint = async()=>{
        dispatch(spinner.showSpinner());
        const {data} = await Axios.post("/api/henesis/swap/mvc-to-mvp",{fromMvc:inputAmount,toMvp:changeAmount});
        dispatch(spinner.hideSpinner());
        if(data.result === 'success') {
            if(data.swap === 'ok') {
                dispatch(auth.udpateMvp(data.mvp))
                navigation.navigate("SwapResult",{
                    header:"MVC를 MVP로 교환 ",
                    result:`${commaFormat(inputAmount)} MVC\n교환 완료 하였습니다.`
                })
            } else {
                dispatch(dialog.openDialog("alert",(
                    <BoldText text={`교환 한도를 초과하였습니다.\n 교환 가능 수량 : ${commaFormat(data.remain)}`} customStyle={{textAlign:"center",lineHeight:20}}/>
                )));
            }
        } else {
            Alert.alert("알림",data.msg,[{title:"확인"}]);
        }
    }

    useEffect(()=>{
        const getRate = async()=>{
            const {data} = await Axios.get("/api/henesis/mvc/rate");
            setRate(Number(data.rate.toFixed(2)))
        }
        const getAssets = async()=>{
            const {data} = await Axios.get("/api/henesis/assets");
            SetHasMvc(setBlanceFormat(data.mvc.amount))
        }
        getRate();
        getAssets();
    },[]);

    return (
         <>
            <CommonStatusbar backgroundColor="#F9F9F9"/>
            <SafeAreaView style={{flex:1}}>
                <View style={[styles.header]}>
                    <TouchableOpacity onPress={()=>navigation.goBack()}>
                        <View style={styles.headerIcoWrap}>
                            <Image source={require('../../../assets/img/ico_back.png')} style={{width:21,height:21}} />
                        </View>
                    </TouchableOpacity>
                    <View style={[styles.headerIcoWrap,{flex:1}]}>
                        <ExtraBoldText text={"MVC를 MVP로 교환 "} customStyle={{fontSize:16}}/>
                    </View>
                    <TouchableOpacity onPress={()=>navigation.goBack()}>
                        <View style={styles.headerIcoWrap}>
                            <Image source={require("../../../assets/img/ico_close_bl.png")} style={{width:20,height:20}}/>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{justifyContent:"space-between",flex:1}}>
                    <ScrollView style={{paddingHorizontal:16,flex:1,backgroundColor:'#FFFFFF'}}>
                        <View style={{marginTop:10,paddingVertical:16,justifyContent:"space-between",alignItems:"center",borderBottomWidth:2,borderBottomColor:"#F2F2F2",flex:1,flexDirection:"row"}}>
                            <BoldText text={"보유 MVC"}/>
                            <View style={{height:46,width:256,backgroundColor:"#F3F3F3",borderWidth:1,borderColor:"#E5E5E5",borderRadius:6,alignItems:"flex-end",justifyContent:"center",paddingRight:16}}>
                                <BoldText text={`${commaFormat(hasMvc)} MVC`} />
                            </View>
                        </View>
                        <View style={{marginTop:26}}>
                            <View style={{flexDirection:"row",marginBottom:4}}>
                                <RegularText text={"· MVC 가격은"} customStyle={{fontSize:11}}/>
                                <BoldText text={" 실시간으로 변동 "} customStyle={{fontSize:11,color:"#EE1818"}}/>
                                <RegularText text={"됩니다. 교환 전 확인해주세요."} customStyle={{fontSize:11}}/>
                            </View>
                            <RegularText text={"· 교환 시 가격변동에 대한 책임은 회사가 지지 않습니다."} customStyle={{fontSize:11}}/>
                        </View>
                        <View style={{marginTop:26,paddingBottom:26,borderBottomWidth:2,borderBottomColor:"#F2F2F2"}}>
                            <View style={{alignItems:"flex-end"}}>
                                <BoldText text={`현재 MVC가격 : ${String(rate)} 원`} customStyle={{fontSize:11,color:"#021AEE"}}/>
                            </View>
                            <View style={{marginTop:12,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                                <BoldText text={"수량입력"}/>
                                <View style={{height:46,width:256,backgroundColor:"#FFFFFF",borderWidth:1,borderColor:"#E5E5E5",borderRadius:6,alignItems:"center",justifyContent:"flex-end",paddingRight:16,flexDirection:'row'}}>
                                    <TextInput placeholder={"수량을 입력해주세요."} placeholderTextColor={"#D5C2D3"} value={String(inputAmount)} keyboardType={"numeric"} style={{flex:1,textAlign:"right"}} onChangeText={(text)=>handleInputAmount(text)}/>
                                    <BoldText text={"MVC"} customStyle={{marginLeft:13,color:"#707070"}}/>
                                </View>
                            </View>
                            {
                                errorStat.stat === true?
                                <View style={{alignItems:"flex-end",marginTop:8}}>
                                    <BoldText text={errorStat.text} customStyle={{fontSize:10,color:"#EE1818"}}/>
                                </View>
                                :
                                null
                            }
                            
                            <View style={{marginTop:10,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                                <BoldText text={"교환수량"}/>
                                <View style={{height:46,width:256,backgroundColor:"#F3F3F3",borderWidth:1,borderColor:"#E5E5E5",borderRadius:6,alignItems:"center",justifyContent:"flex-end",paddingRight:16,flexDirection:'row'}}>
                                    <BoldText text={commaFormat(changeAmount)} />
                                    <BoldText text={"MVP"} customStyle={{marginLeft:13}}/>
                                </View>
                            </View>
                        </View>
                        <View style={{marginTop:26}}>
                            <BoldText text={"유의사항"}/>
                            <View style={{marginTop:8}}>
                                <BoldText text={
                                    "- MVC -> MVP 교환 시 정수 단위로만 교환 가능 합니다.\n"+
                                    "- 교환되는 금액이 소수점이하일 경우 반올림 됩니다.\n"+
                                    "- 교환한 이후 취소가 불가능합니다.\n"+
                                    "- 현재 시세에 따라 교환됩니다."} customStyle={{marginTop:8,lineHeight:20}}/>
                                <View style={{flexDirection:"row",alignItems:'center'}}>
                                    <BoldText text={"- 교환 시 교환 수량에 "} customStyle={{lineHeight:20}}/>
                                    <BoldText text={"0.05%"} customStyle={{lineHeight:20,color:"#EE1818"}}/>
                                    <BoldText text={"가 수수료로 차감 됩니다."} customStyle={{lineHeight:20}}/>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                    <TouchableOpacity onPress={requestChangePoint}>
                        <View style={{height:50,backgroundColor:"#8D3981",justifyContent:"center",alignItems:"center"}}>
                            <BoldText text={"교환하기"} customStyle={{color:'#FFFFFF',fontSize:16}}/>
                        </View>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
         </>
    )
};

const styles = StyleSheet.create({
    header:{
        backgroundColor:"white",
        height:50,
        alignItems:'center',
        flexDirection:"row",
        justifyContent:"space-between",
        borderBottomColor:"#F2F2F2",
        borderBottomWidth:2
    },
    headerIcoWrap:{
        width:50,
        height:50,
        justifyContent:'center',
        alignItems:'center'
    }
});