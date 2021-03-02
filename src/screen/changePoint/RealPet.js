import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Image,View,SafeAreaView,StyleSheet,ScrollView,TouchableOpacity,Alert,TextInput } from 'react-native';
import { ExtraBoldText, BoldText } from '../../components/customComponents';
import CommonStatusbar from '../../components/CommonStatusbar';
import { useTranslation } from 'react-i18next';

import * as dialog from '../../actions/dialog';
import * as spinner from '../../actions/spinner';
import * as auth from '../../actions/authentication';
import Axios from '../../modules/Axios';

const Partnercom = ({navigation,route}) =>{
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [type,setType] = useState(0);
    const [hasPoint,setHasPoint] = useState(route.params.available_points);
    const [changePoint,setChangePoint] = useState("");

    const selectBg = (num)=> {
        return num === type ? {backgroundColor:"#8D3981",borderColor:"#8D3981"} : {backgroundColor:"#FFFFFF",borderColor:"#E5E5E5"}
    }

    const selectText = (num)=> {
        return num === type ? {color:"#FFFFFF"} : {color:"#707070"}
    }

    const onPercentPress = (num)=>{
        if(num !== type) {
            setType(num);
            setChangePoint(Math.floor(hasPoint*(num/100)));
        } else {
            setType(0);
            setChangePoint(0);
        }
    }

    const commaFormat = (num)=>{
        const parts = String(num).split(".")
        return parts[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    const onChangeInput = (text)=>{
        setChangePoint(text)
        if(type !== 0) setType(0)
    }

    const onChangePoint = ()=>{
        if(Number(changePoint) === 0) {
            dispatch(dialog.openDialog("alert",(
                <>
                    <BoldText text={t("alert_exchange_popup_1")} customStyle={{textAlign:"center",lineHeight:20}}/>
                </>
            ))); 
        } else if(Number(changePoint) < 1){
            dispatch(dialog.openDialog("alert",(
                <>
                    <BoldText text={t("alert_exchange_5")} customStyle={{textAlign:"center",lineHeight:20}}/>
                </>
            ))); 
        }else if(!(/^[0-9]*$/).test(changePoint)){
            dispatch(dialog.openDialog("alert",(
                <>
                    <BoldText text={t('alert_exchange_8')} customStyle={{textAlign:"center",lineHeight:20}}/>
                </>
            ))); 
        }else if(Number(changePoint) > Number(hasPoint)) {
            dispatch(dialog.openDialog("alert",(
                <>
                    <BoldText text={t("alert_exchange_popup_2")} customStyle={{textAlign:"center",lineHeight:20}}/>
                </>
            ))); 
        } else if(Number(changePoint) > 10000){
            dispatch(dialog.openDialog("alert",(
                <>
                    <BoldText text={t("alert_exchange_4")} customStyle={{textAlign:"center",lineHeight:20}}/>
                </>
            )));
        }else {
            dispatch(dialog.openDialog("confirm",(
                <>
                    <BoldText text={t('alert_exchange_3')} customStyle={{textAlign:"center",lineHeight:20}}/>
                </>
            ),()=>{
                dispatch(dialog.closeDialog());
                checkLimit();      
            }));
        }
    }

    const checkLimit = async()=>{
        const {data} = await Axios.get('/api/point/change/limit',{params:{amount:changePoint}});
        if(data.result === 'success') {
            navigation.navigate("PinCode",{
                mode:"confirm",
                onGoBack:(_value)=>{if(_value) requestChangePoint();}
            });
        } else {
            dispatch(dialog.openDialog("alert",(
                <>
                    <BoldText text={data.msg} customStyle={{textAlign:"center",lineHeight:20}}/>
                </>
            )));
        }
    }

    const requestChangePoint = async()=>{
        dispatch(spinner.showSpinner());
        const {data} =  await Axios.post("/api/realPet/points",{amount:changePoint,member_id:route.params.member_id});
        dispatch(spinner.hideSpinner());
        if(data.result === "success"){
            dispatch(auth.udpateMvp(data.mvp));
            navigation.navigate("ChangeResult",{amount:changePoint,header:'리얼펫'})
        } else {
            dispatch(dialog.openDialog("alert",(
                <>
                    <BoldText text={data.msg} customStyle={{textAlign:"center",lineHeight:20}}/>
                </>
            ))); 
        }
    }

    return (
        <>
            <CommonStatusbar backgroundColor="#F9F9F9"/>
            <SafeAreaView style={{flex:1}}>
                <View style={[styles.header,styles.shadow]}>
                    <TouchableOpacity onPress={()=>navigation.goBack()}>
                        <View style={styles.headerIcoWrap}>
                            <Image source={require('../../../assets/img/ico_back.png')} style={{width:21,height:21}} />
                        </View>
                    </TouchableOpacity>
                    <View style={[styles.headerIcoWrap,{flex:1}]}>
                        <ExtraBoldText text={'리얼펫'} customStyle={{fontSize:16}}/>
                    </View>
                    <TouchableOpacity onPress={()=>navigation.goBack()}>
                        <View style={styles.headerIcoWrap}>
                            <Image source={require("../../../assets/img/ico_close_bl.png")} style={{width:20,height:20}}/>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{justifyContent:"space-between",flex:1,backgroundColor:"#FFFFFF"}}>
                    <ScrollView style={{flex:1}}>
                        <View style={[styles.shadow,{borderRadius:10,justifyContent:"center",alignItems:"center",paddingVertical:13,marginHorizontal:16,marginTop:26,flexDirection:"row"}]}>
                            <Image source={require("../../../assets/img/logo_realpet.jpg")} style={{resizeMode:"contain",width:130,height:60}}/>
                        </View>
                        <View style={{marginTop:30,marginHorizontal:16}}>
                            <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
                                <BoldText text={t('exchange_17')} />
                                <View style={{borderRadius:6,backgroundColor:'#F3F3F3',borderColor:'#E5E5E5',borderWidth:1,paddingHorizontal:16,alignItems:"center",justifyContent:"flex-end",width:250,flexDirection:"row",height:46}}>
                                    <BoldText text={commaFormat(hasPoint)} />
                                    <BoldText text={t("common_unit_1")} customStyle={{marginLeft:20}}/>
                                </View>
                            </View>
                            <View style={{flexDirection:"row",justifyContent:"space-between",alignItems:"center",marginTop:10}}>
                                <BoldText text={t('exchange_18')} />
                                <View style={{borderRadius:6,borderColor:'#E5E5E5',borderWidth:1,paddingHorizontal:16,alignItems:"center",justifyContent:"space-between",width:250,flexDirection:"row",height:46}}>
                                    <TextInput onChangeText={(text)=>onChangeInput(text)} value={String(changePoint)} placeholder={t("exchange_19")} placeholderTextColor="#D5C2D3" keyboardType={"phone-pad"} style={{padding:0,fontFamily:"NotoSans-Regular",textAlign:'right',flex:1}}/>
                                    <BoldText text={t('common_unit_1')} customStyle={{marginLeft:20}}/>
                                </View>
                            </View>
                            <View style={{flexDirection:"row",marginTop:10,alignItems:'center',justifyContent:"flex-end"}}>
                                <TouchableOpacity onPress={()=>onPercentPress(50)}>
                                    <View style={[{borderWidth:1,borderColor:'#E5E5E5',width:120,height:36,justifyContent:'center',alignItems:"center",borderRadius:6},selectBg(50)]}>
                                        <BoldText text={t('exchange_20')} customStyle={selectText(50)}/>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>onPercentPress(100)}>
                                    <View style={[{borderWidth:1,borderColor:'#E5E5E5',width:120,height:36,justifyContent:'center',alignItems:"center",borderRadius:6,marginLeft:10},selectBg(100)]}>
                                        <BoldText text={t('exchange_21')} customStyle={selectText(100)}/>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={{marginTop:30,borderWidth:1,borderColor:"#F2F2F2"}} />
                            <View style={{marginVertical:26}} >
                                <BoldText text={t("exchange_22")} customStyle={{color:"#3A3A3A"}}/>
                                <View style={{marginTop:10}}>
                                    <BoldText text={
                                        `${t("exchange_23")}\n`+
                                        `${t("exchange_24")}\n`+
                                        `${t("exchange_25")}\n`+
                                        `${t("exchange_26")}`} customStyle={{lineHeight:18}}/>
                                </View>
                            </View>
                        </View>
                    </ScrollView>
                    <TouchableOpacity onPress={onChangePoint}>
                        <View style={{height:50,backgroundColor:"#8D3981",justifyContent:"center",alignItems:"center"}}>
                            <BoldText text={t("exchange_27")} customStyle={{color:"#FFFFFF",fontSize:16}}/>
                        </View>
                    </TouchableOpacity>
                    
                </View>
            </SafeAreaView>
        </>
    )
}

export default Partnercom;

const styles = StyleSheet.create({
    header:{
        backgroundColor:"white",
        height:50,
        alignItems:'center',
        flexDirection:"row",
        justifyContent:"space-between"
    },
    headerIcoWrap:{
        width:50,
        height:50,
        justifyContent:'center',
        alignItems:'center'
    },
    shadow:{
        backgroundColor:"#FFFFFF",
        elevation:2,
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 0.5,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.6,
        zIndex:2
    }
});