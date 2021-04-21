import React, { useEffect,useState } from 'react';
import { useSelector,useDispatch } from 'react-redux';

import {View,SafeAreaView,TouchableWithoutFeedback,Image,StyleSheet,ScrollView} from 'react-native';
import CommonStatusbar from '../../components/CommonStatusbar';
import {ExtraBoldText,BoldText,RegularText} from '../../components/customComponents';
import Axios from '../../modules/Axios';
import CheckBox from 'react-native-check-box'
import * as auth from '../../actions/authentication'
import * as dialog from '../../actions/dialog';
import * as spinner from '../../actions/spinner'

const imagePrefix = "https://image.mileverse.com";
export default({navigation,route})=>{
    const dispatch = useDispatch();
    const {pin:auth_pin} = useSelector(state => state.authentication.userInfo);
    const [detail,setDetail] = useState({});
    const [agree,setAgree] = useState(false);
    const [pinChk,setPinChk] = useState(false);

    useEffect(()=>{
        Axios.get("/api/event/detail",{params:{code:route.params.pdt_code}}).then(({data})=>{
            setDetail(data.detail)
        });
    },[]);

    useEffect(()=>{
        if(pinChk) {
            setPinChk(false)
            dispatch(spinner.showSpinner());
            dispatch(auth.buyGiftConByMVP(route.params.pdt_code,detail.SUPPLIER,true)).then((result)=>{
                dispatch(spinner.hideSpinner());
                if(result.stat === "SUCCESS") {
                    dispatch(dialog.openDialog("alert",(
                        <>
                            <View style={{width:'100%',height:150,justifyContent:"center",alignItems:"center"}}>
                                <Image source={{uri:imagePrefix+detail.PDT_IMAGE}} style={{resizeMode:"contain",width:120,height:120}}/>
                            </View>
                            <BoldText text={detail.PDT_NAME} customStyle={{textAlign:"center",lineHeight:20}}/>
                            <View style={{flexDirection:"row"}}>
                                <BoldText text={"구매가 완료되었습니다."} customStyle={{textAlign:"center",lineHeight:20}}/>
                            </View>
                        </>         
                    ),()=>{
                        dispatch(dialog.closeDialog());
                        navigation.navigate("Event");
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

    const formattedNumber = text => {
        if(text)
            return text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    const onBuyBtn = ()=>{
        if(!agree){
            dispatch(dialog.openDialog("alert",(
                <BoldText text={"구매 확인 및 제 3자 정보 이용 제공에  동의 후 구매가 가능합니다."} customStyle={{textAlign:"center",lineHeight:20}}/>
            )));
        }else{
            dispatch(dialog.openDialog("confirm",(
                <BoldText text={`${detail.PDT_NAME} 을(를)\n 구매 하시겠습니까?`} customStyle={{textAlign:"center",lineHeight:20}}/>
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
                    <TouchableWithoutFeedback onPress={()=>navigation.goBack()}>
                        <View style={styles.headerIcoWrap}>
                            <Image source={require('../../../assets/img/ico_back.png')} style={{width:21,height:21}} />
                        </View>
                    </TouchableWithoutFeedback>
                    <View style={[styles.headerIcoWrap,{flex:1}]}>
                        <ExtraBoldText text={detail.PDT_NAME} customStyle={{fontSize:16}}/>
                    </View>
                    <TouchableWithoutFeedback onPress={()=>navigation.navigate("Home")}>
                        <View style={styles.headerIcoWrap}>
                            <Image source={require("../../../assets/img/ico_close_bl.png")} style={{width:20,height:20}}/>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <ScrollView>
                    <View style={{width:'100%',height:280,justifyContent:"center",alignItems:"center",backgroundColor:"#FFFFFF",borderBottomColor:"#ECECEC",borderBottomWidth:2}}>
                        <Image source={{uri:`${imagePrefix}${detail.PDT_IMAGE}`}} style={{resizeMode:"contain",width:200,height:200}}/>
                    </View>
                    <View style={{backgroundColor:"#FFFFFF",padding:16,borderBottomColor:"#ECECEC",borderBottomWidth:2}}>
                        <BoldText text={detail.PDT_NAME} customStyle={{fontSize:15}}/>
                        <View style={{marginTop:10,flexDirection:"row",alignItems:"center"}}>
                            <ExtraBoldText text={formattedNumber(detail.SALE_AMOUNT)} customStyle={{fontSize:15}}/>
                            <RegularText text={"MVP"} customStyle={{marginLeft:4}}/>
                            <RegularText text={`${formattedNumber(detail.PDT_AMOUNT)} MVP`} customStyle={{marginLeft:10,color:'#616161',textDecorationLine:"line-through"}}/>
                        </View>
                    </View>
                    <View style={{backgroundColor:"#FFFFFF",paddingVertical:10,alignItems:"center",justifyContent:"center",borderBottomColor:"#ECECEC",borderBottomWidth:2}}>
                        <BoldText text={"상품 정보 및 안내사항"} customStyle={{fontSize:13}}/>
                    </View>
                    <View style={{backgroundColor:'#F8F8F8',paddingHorizontal:16,paddingTop:20,paddingBottom:104}}>
                        <BoldText text={'필수공지'} customStyle={{fontSize:13}}/>
                        <View style={{marginTop:10}}>
                            <BoldText
                                customStyle={{fontSize:10,color:"#EB0000",lineHeight:18}}
                                text={
                                    '- 본 상품은 구매 후 교환 및 환불이 불가능합니다.\n'+
                                    '- 본 상품은 구매 후 유효기간 연장이 불가능합니다.'
                                }
                            />
                        </View>
                        <View style={{marginTop:20}}>
                            <BoldText text={detail.notice} customStyle={{fontSize:12,lineHeight:20}}/>
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
                    <BoldText text={"구매 확인 및 제 3자 정보 이용 제공에 동의합니다."} customStyle={{fontSize:10,marginLeft:10}}/>
                </View>
                <TouchableWithoutFeedback onPress={onBuyBtn}>
                    <View style={{height:44,backgroundColor:"#8D3981",justifyContent:"center",alignItems:"center"}}>
                        <BoldText text={"구매하기"} customStyle={{fontSize:14,color:"#FFFFFF"}}/>
                    </View>
                </TouchableWithoutFeedback>
            </SafeAreaView>
        </>
    )
}

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