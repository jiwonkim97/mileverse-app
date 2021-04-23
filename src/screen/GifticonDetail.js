import React, { useEffect, useState } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { Image,View,SafeAreaView,StyleSheet,TouchableWithoutFeedback,TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { ExtraBoldText, BoldText } from '../components/customComponents';
import CommonStatusbar from '../components/CommonStatusbar';
import Axios from '../modules/Axios';
import CheckBox from 'react-native-check-box'
import * as actions from '../actions/authentication'
import * as dialog from '../actions/dialog';
import * as spinner from '../actions/spinner'
import { useTranslation } from 'react-i18next';

const imagePrefix = "https://image.mileverse.com";
const GifticonDetail = ({route,navigation}) =>{
    const { t } = useTranslation();
    const {pin:auth_pin} = useSelector(state => state.authentication.userInfo);
    const [detail,setDetail] = useState({});
    const [amount,setAmount] = useState(0);
    const [agree,setAgree] = useState(false);
    const [pinChk,setPinChk] = useState(false);
    const dispatch = useDispatch();

    useEffect(()=>{
        Axios.get("/api/gifticon/item-detail",{params:{item:route.params.pdt_code}}).then(response=>{
            const {detail} = response.data
            setDetail(detail)
            if(detail.EVENT_GB === 'Y') {
                setAmount(detail.SALE_AMOUNT.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            }else {
                setAmount(detail.PDT_AMOUNT.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
            }
        });
    },[]);

    useEffect(()=>{
        if(pinChk) {
            setPinChk(false)
            dispatch(spinner.showSpinner());
            dispatch(actions.buyGiftConByMVP(route.params.pdt_code,detail.SUPPLIER,detail.EVENT_GB)).then((result)=>{
                dispatch(spinner.hideSpinner());
                if(result.stat === "SUCCESS") {
                    dispatch(dialog.openDialog("alert",(
                        <>
                            <View style={{width:'100%',height:150,justifyContent:"center",alignItems:"center"}}>
                                <Image source={{uri:imagePrefix+detail.PDT_IMAGE}} style={{resizeMode:"contain",width:120,height:120}}/>
                            </View>
                            <BoldText text={detail.PDT_NAME} customStyle={{textAlign:"center",lineHeight:20}}/>
                            <View style={{flexDirection:"row"}}>
                                <BoldText text={t("alert_giftcon_3")} customStyle={{textAlign:"center",lineHeight:20}}/>
                            </View>
                        </>         
                    ),()=>{
                        if(route.params.eventScreen) {
                            dispatch(dialog.closeDialog());
                            navigation.goBack();
                        } else {
                            dispatch(dialog.closeDialog());
                        }
                    }));
                } else {
                    dispatch(dialog.openDialog("alert",(
                        <>
                            <View style={{width:'100%',height:150,justifyContent:"center",alignItems:"center"}}>
                                <Image source={{uri:imagePrefix+detail.PDT_IMAGE}} style={{resizeMode:"contain",width:120,height:120}}/>
                            </View>
                            <BoldText text={detail.PDT_NAME} customStyle={{textAlign:"center",lineHeight:20}}/>
                            <View style={{flexDirection:"row"}}>
                                <BoldText text={result.msg} customStyle={{textAlign:"center",lineHeight:20}}/>
                            </View>
                        </>         
                    )));
                }
            })
        }
    },[pinChk])


    const onBuyBtn = ()=>{
        if(!agree){
            dispatch(dialog.openDialog("alert",(
                <>
                    <BoldText text={t('alert_giftcon_4')} customStyle={{textAlign:"center",lineHeight:20}}/>
                </>
            )));
        }else{
            dispatch(dialog.openDialog("confirm",(
                <>
                    <BoldText text={t("alert_giftcon_5",{item:detail.PDT_NAME})} customStyle={{textAlign:"center",lineHeight:20}}/>
                </>
            ),()=>{
                dispatch(dialog.closeDialog());
                if(auth_pin === "" || auth_pin === undefined || auth_pin === null) {
                    dispatch(dialog.openDialog("alert",(
                        <>
                            <BoldText text={"PINCODE를 먼저 설정해주세요.\n메뉴->내정보->PinCode 변경"} customStyle={{textAlign:"center",lineHeight:20}}/>
                        </>
                    )));
                }else {
                    navigation.navigate("PinCode",{
                        mode:"confirm",
                        onGoBack:(_value)=>{setPinChk(_value)}
                    });
                }
            }));
        }   
        
    }

    return (
        <>
            <CommonStatusbar backgroundColor="#F9F9F9"/>
            <SafeAreaView style={{flex:1}}>
                <View style={[styles.header,styles.shadow]}>
                    <TouchableOpacity onPress={()=>navigation.goBack()}>
                        <View style={styles.headerIcoWrap}>
                            <Image source={require('../../assets/img/ico_back.png')} style={{width:21,height:21}} />
                        </View>
                    </TouchableOpacity>
                    <View style={[styles.headerIcoWrap,{flex:1}]}>
                        <ExtraBoldText text={detail.PDT_NAME} customStyle={{fontSize:16}}/>
                    </View>
                    <TouchableOpacity onPress={()=>navigation.navigate("GifticonCategory")}>
                        <View style={styles.headerIcoWrap}>
                            <Image source={require("../../assets/img/ico_close_bl.png")} style={{width:20,height:20}}/>
                        </View>
                    </TouchableOpacity>
                </View>
                <ScrollView>
                    <View style={{width:'100%',height:280,justifyContent:"center",alignItems:"center",backgroundColor:"#FFFFFF",borderBottomColor:"#ECECEC",borderBottomWidth:2}}>
                        <Image source={{uri:imagePrefix+detail.PDT_IMAGE}} style={{resizeMode:"contain",width:200,height:200}}/>
                    </View>
                    <View style={{backgroundColor:"#FFFFFF",padding:16,borderBottomColor:"#ECECEC",borderBottomWidth:2}}>
                        <BoldText text={detail.PDT_NAME} customStyle={{fontSize:15}}/>
                        {
                            detail.EVENT_GB === "Y" ? (
                                <View style={{marginTop:11,flexDirection:"row",alignItems:"center"}}>
                                    <ExtraBoldText text={`${detail.SALE_RATIO}%`} customStyle={{fontSize:15,color:"#EE1818"}}/>
                                    <ExtraBoldText text={amount} customStyle={{fontSize:15,marginLeft:7}}/>
                                    <BoldText text={"MVP"} customStyle={{marginLeft:4}}/>
                                </View>        
                            ) :(
                                <View style={{marginTop:11,flexDirection:"row",alignItems:"center"}}>
                                    <ExtraBoldText text={amount} customStyle={{fontSize:15}}/>
                                    <BoldText text={"MVP"} customStyle={{marginLeft:4}}/>
                                </View>
                            )
                        }
                        
                    </View>
                    <View style={{backgroundColor:"#FFFFFF",paddingVertical:16,alignItems:"center",justifyContent:"center",borderBottomColor:"#ECECEC",borderBottomWidth:2}}>
                        <BoldText text={t('use_giftcon_14')} customStyle={{fontSize:13}}/>
                    </View>
                    <View style={{padding:16,paddingBottom:100,backgroundColor:"#F8F8F8"}}>
                        <View>
                            <BoldText text={t('use_giftcon_15')} customStyle={{fontSize:12}}/>
                            <View style={{marginTop:10}}>
                                <BoldText text={t('use_giftcon_16')} customStyle={{color:'red',fontSize:12}}/>
                                <BoldText text={t('use_giftcon_17')} customStyle={{color:'red',marginTop:5,fontSize:12}}/>
                            </View>
                            <View style={{marginTop:18}}>
                                <BoldText text={detail.notice} customStyle={{fontSize:12,lineHeight:20}}/>
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <View style={{paddingVertical:12,paddingHorizontal:16,alignItems:"center",flexDirection:'row',backgroundColor:"#FFFFFF"}}>
                    <CheckBox
                        isChecked={agree}
                        checkedCheckBoxColor={'#8D3981'}
                        uncheckedCheckBoxColor={"#999999"}
                        onClick={() => setAgree(!agree)}
                    />
                    <BoldText text={t("use_giftcon_13")} customStyle={{fontSize:11,marginLeft:10}}/>
                </View>
                <TouchableWithoutFeedback onPress={onBuyBtn}>
                    <View style={{height:50,backgroundColor:"#8D3981",justifyContent:"center",alignItems:"center"}}>
                        <BoldText text={t("use_giftcon_18")} customStyle={{fontSize:16,color:"#FFFFFF"}}/>
                    </View>
                </TouchableWithoutFeedback>
            </SafeAreaView>
        </>
    )
}


export default GifticonDetail;

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
});