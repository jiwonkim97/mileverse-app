import React, { useEffect,useState,useRef,useCallback } from 'react';
import { Image,View,SafeAreaView,ScrollView ,StyleSheet,Platform, TouchableWithoutFeedback,Dimensions,AppState } from 'react-native';
import { useSelector,useDispatch } from 'react-redux';
import Modal from 'react-native-modal';
import Barcode from "react-native-barcode-builder";
import * as toast from '../components/Toast';

import * as spinner from '../actions/spinner'
import * as actions from '../actions/authentication'
import AsyncStorage from '@react-native-community/async-storage';
import { RegularText, BoldText, ExtraBoldText } from '../components/customComponents';
import CommonStatusbar from '../components/CommonStatusbar';
import Axios from '../modules/Axios'

import noticeAlert from '../components/NoticeAlert';
import DeviceBrightness from '@adrianso/react-native-device-brightness';

const HomeScreen = (props) =>{
    const dispatch = useDispatch();
    const stat = useSelector(state => state.authentication.status.isLoggedIn);
    const {mvp,currentUser:name,code} = useSelector(state => state.authentication.userInfo);
    const _ver = useSelector(state => state.global.version);
    const [modal,setModal] = useState(false)
    const [codeNum,setCodeNum] = useState("");
    const [commaMvp,setCommaMvp] = useState(mvp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    const bannerHeight = useRef(Dimensions.get("screen").width*643/1501);
    const brightness = useRef(0)
    
    useEffect(()=>{
        setCommaMvp(mvp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))
    },[mvp])

    useEffect(()=>{
        setCodeNum(code.substr(0,4)+" "+code.substr(4,4)+" "+code.substr(8,4)+" "+code.substr(12,4))
    },[code])

    const handleAppState = async(netAppState)=>{
        if ( netAppState === "active") {
            brightness.current = await DeviceBrightness.getBrightnessLevel();
            DeviceBrightness.setBrightnessLevel(brightness.current);
        }
    }

    const modalToggle = (_flag)=>{
        setModal(_flag)
        if(_flag) {
            DeviceBrightness.setBrightnessLevel(1);
        } else {
            DeviceBrightness.setBrightnessLevel(brightness.current);
        }
    }
    
    useEffect(()=>{
        const checkNotice = async() => {
            const _getNotice = await Axios.post('/api/notice/check-notice-version',{version:_ver,platform:Platform.OS});
            const _response = _getNotice.data.rows
            const _notice = await noticeAlert(_response,_ver);
            if(_notice === true) onVerifyRequest();
        }
        AppState.addEventListener("change",handleAppState);
        checkNotice();
    },[])

    const navigateScreen = (_code,_name) =>{
        stat ? props.navigation.navigate('GifticonList',{ctgr_code:_code,ctgr_name:_name}) : props.navigation.navigate("Login")
    }
    
    const onVerifyRequest = async() =>{
        await AsyncStorage.getItem("@loginStorage").then(value=>{
            dispatch(spinner.showSpinner());
            let _data = {};
            if(value !== null) _data = JSON.parse(value);
            dispatch(actions.verifyRequest(_data)).then(rst=>{
                dispatch(spinner.hideSpinner())
            })
        })
    }

    return (
        <>
            <CommonStatusbar backgroundColor="#F9F9F9"/>
            <SafeAreaView style={{flex:1}}>
                <View style={styles.header}>
                    <Image source={require('../../assets/img/mileverse_letter_2.png')} style={{width:150,resizeMode:"contain"}}></Image>
                </View>
                <ScrollView>
                    <View style={{paddingVertical:6}}>
                        <TouchableWithoutFeedback onPress={()=>{
                            stat?props.navigation.navigate("GifticonCategory"):props.navigation.navigate("Login")
                        }}>
                        <Image source={require("../../assets/img/main_banner.png")} style={{resizeMode:"stretch",width:"100%",height:bannerHeight.current}}/>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={{backgroundColor:"#FFFFFF",width:"100%",paddingHorizontal:16,paddingTop:16 ,paddingBottom:16}}>
                        <View style={[styles.shadow,{borderRadius:8}]}>
                            <View style={{paddingTop:40,paddingLeft:50}}>
                                {stat?
                                    <BoldText text={name+" 님의 MVP"} customStyle={{fontSize:15,color:"#2B2B2B"}}/>
                                    :
                                    <TouchableWithoutFeedback onPress={()=>props.navigation.navigate("Login")}>
                                        <View>
                                            <BoldText text={"로그인이 필요합니다."} customStyle={{fontSize:15,color:"#2B2B2B"}}/>
                                        </View>
                                    </TouchableWithoutFeedback>
                                    
                                }
                                <TouchableWithoutFeedback onPress={()=>stat?props.navigation.navigate("MyMvp"):props.navigation.navigate("Login")}>
                                    <View style={{flexDirection:"row",alignItems:"center",marginTop:12,alignSelf:"flex-start"}}>
                                        <ExtraBoldText text={mvp===""? "-": commaMvp+" MVP"} customStyle={{fontSize:20,color:"#8D3981"}}/>
                                        {stat?
                                            <Image source={require('../../assets/img/ico_bracket.png')} style={styles.icoBracket}/>
                                            :
                                            null
                                        }
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                            <View style={{paddingVertical:30,justifyContent:"center",alignItems:"center"}}>
                                <TouchableWithoutFeedback onPress={()=>{
                                    stat?modalToggle(true):props.navigation.navigate("Login")
                                }}>
                                    <View style={{alignItems:"center"}}>
                                        <Image source={require("../../assets/img/pay_barcode.png")} style={{resizeMode:"stretch",width:178,height:51,opacity:stat?1:0.3}}/>
                                        <BoldText text={"터치해서 결제하세요!"} customStyle={{fontSize:11,color:"#2B2B2B",opacity:stat?1:0.5}}/>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                            <View style={{borderTopWidth:1,borderTopColor:"#ECECEC",paddingVertical:19,flexDirection:"row"}}>
                                <TouchableWithoutFeedback onPress={()=>{
                                    stat?props.navigation.navigate("Change"):props.navigation.navigate("Login")
                                }}>
                                    <View style={styles.btnWrap}>
                                        <BoldText text={"MVP 교환"} customStyle={styles.btnTxt}/>
                                    </View>    
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={()=>{
                                    stat?modalToggle(true):props.navigation.navigate("Login")
                                }}>
                                    <View style={styles.btnWrap}>
                                        <BoldText text={"MVP 사용"} customStyle={styles.btnTxt}/>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                        <View style={[styles.shadow,{borderRadius:8,marginTop:16,paddingTop:26,paddingBottom:23}]}>
                            <View style={{justifyContent:"center",alignItems:"center"}}>
                                <BoldText text={"기프티콘 바로가기"} customStyle={{fontSize:18,color:"#2B2B2B"}}/>
                            </View>
                            <View style={{marginTop:40}}>
                                <View style={{flexDirection:"row",justifyContent:"space-around"}}>
                                    <TouchableWithoutFeedback onPress={()=>navigateScreen("CTGR_01","편의점")}>
                                        <View style={{alignItems:"center",justifyContent:"flex-start"}}>
                                            <Image source={require("../../assets/img/ico_mart.png")} style={[styles.gifticonImg]}/>
                                            <BoldText text={"편의점"} style={styles.gifticonTxt}/>
                                        </View>
                                    </TouchableWithoutFeedback>
                                    <TouchableWithoutFeedback onPress={()=>navigateScreen("CTGR_02","커피")}>
                                        <View style={{alignItems:"center",justifyContent:"flex-start"}}>
                                            <Image source={require("../../assets/img/ico_coffee.png")} style={[styles.gifticonImg]}/>
                                            <BoldText text={"커피"} style={styles.gifticonTxt}/>
                                        </View>
                                    </TouchableWithoutFeedback>
                                    <TouchableWithoutFeedback onPress={()=>navigateScreen("CTGR_03","치킨/피자")}>
                                        <View style={{alignItems:"center",justifyContent:"flex-start"}}>
                                            <Image source={require("../../assets/img/ico_chicken.png")} style={[styles.gifticonImg]}/>
                                            <BoldText text={"치킨/피자"} style={styles.gifticonTxt}/>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                                <View style={{flexDirection:"row",justifyContent:"space-around",marginTop:36}}>
                                    <TouchableWithoutFeedback onPress={()=>navigateScreen("CTGR_04","베이커리,아이스크림")}>
                                        <View style={{alignItems:"center",justifyContent:"flex-start"}}>
                                            <Image source={require("../../assets/img/ico_icecream.png")} style={[styles.gifticonImg]}/>
                                            <BoldText text={" 베이커리/\n아이스크림"} style={styles.gifticonTxt}/>
                                        </View>
                                    </TouchableWithoutFeedback>
                                    <TouchableWithoutFeedback onPress={()=>navigateScreen("CTGR_05","영화")}>
                                        <View style={{alignItems:"center",justifyContent:"flex-start"}}>
                                            <Image source={require("../../assets/img/ico_movie.png")} style={[styles.gifticonImg]}/>
                                            <BoldText text={"영화"} style={styles.gifticonTxt}/>
                                        </View>
                                    </TouchableWithoutFeedback>
                                    <TouchableWithoutFeedback onPress={()=>navigateScreen("CTGR_06","뷰티")}>
                                        <View style={{alignItems:"center",justifyContent:"flex-start"}}>
                                            <Image source={require("../../assets/img/ico_beauty.png")} style={[styles.gifticonImg]}/>
                                            <BoldText text={"뷰티"} style={styles.gifticonTxt}/>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={{backgroundColor:"#722D72",width:"100%",padding:20}}>
                        <RegularText text="회사: 주식회사 트루스트체인" customStyle={styles.footer} />
                        <RegularText text="대표자: 정진형 | 사업자 등록 번호: 746-87-01620" customStyle={styles.footer} />
                        <RegularText text="사업장 소재지: 서울특별시 영등포구 당산로 49길 28 1층" customStyle={styles.footer} />
                        <RegularText text="e-mail: mkt@mileverse.com │ contact@mileverse.com" customStyle={styles.footer} />
                        <RegularText text="tel: 02-2633-5896" customStyle={styles.footer} />
                        <RegularText text="Copyright ⓒ 2019 Trustchain Inc. ALL RIGHT RESERVED" customStyle={[styles.footer,{marginTop:10}]} />
                    </View>
                </ScrollView>
            </SafeAreaView>
            <Modal isVisible={modal} backdropTransitionOutTiming={0} 
                onBackdropPress={()=>{modalToggle(false)}}
                style={{margin: 0,flex:1,justifyContent:"flex-start"}} useNativeDriver={true} animationIn={"slideInDown"} animationOut={"slideOutUp"}>
                {Platform.OS === 'ios'? <CommonStatusbar backgroundColor="#FFFFFF"/> : null  }
                <View style={{backgroundColor:"#ffffff",borderBottomRightRadius:50,borderBottomLeftRadius:50,paddingBottom:60}}>
                    <View style={{paddingTop:50,paddingLeft:54}}>
                        <BoldText text={name+" 님의 MVP"} customStyle={{fontSize:15}}/>
                        <TouchableWithoutFeedback onPress={()=>{
                            modalToggle(false)
                            props.navigation.navigate("MyMvp")
                        }}>
                            <View style={{flexDirection:"row",alignItems:"center",marginTop:14}}>
                                <ExtraBoldText text={mvp===""? "-": commaMvp+" MVP"} customStyle={{fontSize:18,color:"#8D3981"}}/>
                                <Image source={require('../../assets/img/ico_bracket.png')} style={styles.icoBracket}/>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={{marginTop:36,alignItems:"center",justifyContent:"center"}}>
                        <Barcode value={code? code : "0000"} format="CODE128" height={77}/>
                        <BoldText text={codeNum? codeNum : "0000"} customStyle={{fontSize:12,color:"#000000"}}/>
                    </View>
                    <View style={{position:"absolute",right:15,top:15}}>
                        <TouchableWithoutFeedback onPress={()=>modalToggle(false)}>
                            <Image source={require('../../assets/img/ico_close_bl.png')} style={{resizeMode:"contain",width:20,height:20}} />    
                        </TouchableWithoutFeedback> 
                    </View>
                </View>
            </Modal>
        </>
    )
}

export default HomeScreen;

const styles = StyleSheet.create({
    header:{
        backgroundColor:"white",
        height:50,
        justifyContent:'center',
        alignItems:'center',
    },
    footer:{
        color:"white",
        fontSize:12,
        lineHeight:20
    },
    shadow:{
        backgroundColor:"white",
        elevation:2, 
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2.22
    },
    gifticonImg:{
        width:60,
        height:60,
        marginBottom:14
    },
    gifticonTxt:{
        fontSize:12,
        color:"#2B2B2B"
    },
    btnWrap:{
        flex:1,
        justifyContent:"center",
        alignItems:"center"
    },
    btnTxt:{
        fontSize:14,
        color:"#434343"
    },
    icoBracket:{
        resizeMode:"contain",
        width:8,
        height:20,
        marginLeft:6
    }
});