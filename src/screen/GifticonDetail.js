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

const imagePrefix = "https://mv-image.s3.ap-northeast-2.amazonaws.com";
const GifticonDetail = ({route,navigation}) =>{
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
            setAmount(detail.PDT_AMOUNT.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
        });
    },[]);

    useEffect(()=>{
        if(pinChk) {
            setPinChk(false)
            dispatch(spinner.showSpinner());
            dispatch(actions.buyGiftConByMVP(route.params.pdt_code)).then((result)=>{
                dispatch(spinner.hideSpinner());
                if(result.stat === "SUCCESS") {
                    dispatch(dialog.openDialog("alert",(
                        <>
                            <View style={{width:'100%',height:150,justifyContent:"center",alignItems:"center"}}>
                                <Image source={{uri:imagePrefix+detail.PDT_IMAGE}} style={{resizeMode:"contain",width:120,height:120}}/>
                            </View>
                            <BoldText text={detail.PDT_NAME} customStyle={{textAlign:"center",lineHeight:20}}/>
                            <View style={{flexDirection:"row"}}>
                                <BoldText text={"구매가"} customStyle={{textAlign:"center",lineHeight:20}}/>
                                <ExtraBoldText text={"완료"} customStyle={{marginLeft:4,lineHeight:20}}/>
                                <BoldText text={"되었습니다."} customStyle={{textAlign:"center",lineHeight:20}}/>
                            </View>
                        </>         
                    ),()=>{
                        dispatch(dialog.closeDialog());
                        navigation.goBack();
                    }));
                } else {
                    dispatch(dialog.openDialog("alert",(
                        <>
                            <View style={{width:'100%',height:150,justifyContent:"center",alignItems:"center"}}>
                                <Image source={{uri:imagePrefix+detail.PDT_IMAGE}} style={{resizeMode:"contain",width:120,height:120}}/>
                            </View>
                            <BoldText text={result.msg} customStyle={{textAlign:"center",fontSize:16,color:"#F22D2D"}}/>
                            <BoldText text={detail.PDT_NAME} customStyle={{textAlign:"center",marginTop:20}}/>
                            <View style={{flexDirection:"row",marginTop:6}}>
                                <BoldText text={"구매가"} customStyle={{textAlign:"center"}}/>
                                <ExtraBoldText text={"취소"} customStyle={{marginLeft:4,color:"#F22D2D"}}/>
                                <BoldText text={"되었습니다."} customStyle={{textAlign:"center"}}/>
                            </View>
                        </>      
                    )))
                }
            })
        }
    },[pinChk])


    const onBuyBtn = ()=>{
        if(!agree){
            dispatch(dialog.openDialog("alert",(
                <>
                    <BoldText text={"구매 확인 및 제 3자 정보 이용 제공에 \n 동의 후 구매가 가능합니다."} customStyle={{textAlign:"center",lineHeight:20}}/>
                </>
            )));
        }else{
            dispatch(dialog.openDialog("confirm",(
                <>
                    <BoldText text={detail.PDT_NAME+" 을(를)\n 구매 하시겠습니까?"} customStyle={{textAlign:"center",lineHeight:20}}/>
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
                            <Image source={require('../../assets/img/ico_back.png')} style={{width:8,height:16}} />
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
                        <View style={{marginTop:11,flexDirection:"row",alignItems:"center"}}>
                            <ExtraBoldText text={amount} customStyle={{fontSize:15}}/>
                            <BoldText text={"MVP"} customStyle={{marginLeft:4}}/>
                        </View>
                    </View>
                    <View style={{backgroundColor:"#FFFFFF",paddingVertical:16,alignItems:"center",justifyContent:"center",borderBottomColor:"#ECECEC",borderBottomWidth:2}}>
                        <BoldText text={"상품 정보 및 안내사항"} customStyle={{fontSize:13}}/>
                    </View>
                    <View style={{padding:16,paddingBottom:100,backgroundColor:"#F8F8F8"}}>
                        <View>
                            <BoldText text={"[필수공지]"} customStyle={{fontSize:12}}/>
                            <View style={{marginTop:10}}>
                                <BoldText text={"- 본 상품은 구매 후 교환 및 환불이 불가능합니다."} customStyle={{color:'red',fontSize:12}}/>
                                <BoldText text={"- 본 상품은 구매 후 유효기간 연장이 불가능합니다."} customStyle={{color:'red',marginTop:5,fontSize:12}}/>
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
                    <BoldText text={"구매 확인 및 제 3자 정보 이용 제공에 동의합니다."} customStyle={{fontSize:11,marginLeft:10}}/>
                </View>
                <TouchableWithoutFeedback onPress={onBuyBtn}>
                    <View style={{height:50,backgroundColor:"#8D3981",justifyContent:"center",alignItems:"center"}}>
                        <BoldText text={"구매하기"} customStyle={{fontSize:16,color:"#FFFFFF"}}/>
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