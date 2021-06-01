import React, { useEffect,useState,useRef } from 'react';
import { Image,View,SafeAreaView,ScrollView ,StyleSheet,Platform, TouchableWithoutFeedback,Dimensions,AppState,Linking } from 'react-native';
import { useSelector,useDispatch } from 'react-redux';
import Modal from 'react-native-modal';
import Barcode from "react-native-barcode-builder";
import { useTranslation } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

import * as spinner from '../actions/spinner'
import * as actions from '../actions/authentication'
import AsyncStorage from '@react-native-community/async-storage';
import { RegularText, BoldText, ExtraBoldText } from '../components/customComponents';
import CommonStatusbar from '../components/CommonStatusbar';
import {checkAbusing} from '../modules/AbusingHelper';
import Axios from '../modules/Axios'

import noticeAlert from '../components/NoticeAlert';
import DeviceBrightness from '@adrianso/react-native-device-brightness';
import { updatePushToken,onPushOpenListener,onPushOpenListenerBackground } from '../modules/FireBaseHelper';


const HomeScreen = (props) =>{
    const dispatch = useDispatch();
    const stat = useSelector(state => state.authentication.status.isLoggedIn);
    const {mvp,currentUser:name,code} = useSelector(state => state.authentication.userInfo);
    const _ver = useSelector(state => state.global.version);
    const [modal,setModal] = useState(false)
    const [codeNum,setCodeNum] = useState("");
    const [commaMvp,setCommaMvp] = useState(mvp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    const bannerHeight = useRef(Dimensions.get("screen").width*643/1501);
    const brightness = useRef(0);
    const { t } = useTranslation();
    const [images,setImages] = useState([
        RNLocalize.getLocales()[0].languageCode === 'ko' ? require("../../assets/img/main_banner.png") :  require("../../assets/img/main_banner_en.png"), 
        require("../../assets/img/banner_square_note.png")
    ]);
    
    useEffect(()=>{
        setCommaMvp(mvp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))
    },[mvp])

    useEffect(()=>{
        setCodeNum(code.substr(0,4)+" "+code.substr(4,4)+" "+code.substr(8,4)+" "+code.substr(12,4))
    },[code])

    const handleAppState = async(netAppState)=>{
        if ( netAppState === "active") {
            brightness.current = await DeviceBrightness.getBrightnessLevel();
            if(Platform.OS === 'android') {
                brightness.current = await DeviceBrightness.getSystemBrightnessLevel();
            }
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
        const initApp = async() => {
            const {data} = await Axios.post('/api/notice/check-notice-version',{version:_ver,platform:Platform.OS});
            await noticeAlert(data.rows,_ver);
            await onVerifyRequest();
        }
        AppState.addEventListener("change",handleAppState);
        onPushOpenListener(props.navigation);
        onPushOpenListenerBackground(props.navigation);
        initApp();
    },[])

    const navigateScreen = (_code,_name) =>{
        stat ? props.navigation.navigate('GifticonList',{ctgr_code:_code,ctgr_name:_name}) : props.navigation.navigate("Login")
    }
    
    const onVerifyRequest = async() =>{
        await AsyncStorage.getItem("@loginStorage").then(value=>{
            dispatch(spinner.showSpinner());
            let _data = {};
            if(value !== null) _data = JSON.parse(value);
            dispatch(actions.verifyRequest(_data)).then(async(rst)=>{
                if(rst === 'SUCCESS') {
                    await checkAbusing(_data.id);
                    await updatePushToken(_data.id);
                }
                dispatch(spinner.hideSpinner())
            })
        })
    }
    return (
        <>
            <CommonStatusbar backgroundColor="#F9F9F9"/>
            <SafeAreaView style={{flex:1}}>
                <View style={[styles.header,styles.shadow]}>
                    <Image source={require('../../assets/img/mileverse_letter_2.png')} style={{width:150,resizeMode:"contain"}}></Image>
                </View>
                <ScrollView>
                    <View style={{paddingVertical:6}}>
                        <TouchableWithoutFeedback onPress={()=>{Linking.openURL("https://www.mileverse.com/events");}}>
                            <Image source={require("../../assets/img/airdrop_banner.png")} style={{resizeMode:"stretch",width:"100%",height:bannerHeight.current}}></Image>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={{backgroundColor:"#FFFFFF",width:"100%",paddingHorizontal:16,paddingTop:16 ,paddingBottom:16}}>
                        <View style={[styles.shadow,{borderRadius:8}]}>
                            <View style={{paddingTop:40,paddingLeft:50}}>
                                {stat?
                                    <BoldText text={name+t('main_23')} customStyle={{fontSize:15,color:"#2B2B2B"}}/>
                                    :
                                    <TouchableWithoutFeedback onPress={()=>props.navigation.navigate("Login")}>
                                        <View>
                                            <BoldText text={t('main_1')} customStyle={{fontSize:15,color:"#2B2B2B"}}/>
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
                                        <BoldText text={t('main_2')} customStyle={{fontSize:11,color:"#2B2B2B",opacity:stat?1:0.5}}/>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                            <View style={{borderTopWidth:1,borderTopColor:"#ECECEC",paddingVertical:19,flexDirection:"row"}}>
                                <TouchableWithoutFeedback onPress={()=>{
                                    stat?props.navigation.navigate("Change"):props.navigation.navigate("Login")
                                }}>
                                    <View style={styles.btnWrap}>
                                        <BoldText text={t('main_3')} customStyle={styles.btnTxt}/>
                                    </View>    
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={()=>{
                                    stat?modalToggle(true):props.navigation.navigate("Login")
                                }}>
                                    <View style={styles.btnWrap}>
                                        <BoldText text={t('main_4')} customStyle={styles.btnTxt}/>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                        <View style={[styles.shadow,{borderRadius:8,marginTop:16,paddingTop:26,paddingBottom:23}]}>
                            <View style={{justifyContent:"center",alignItems:"center"}}>
                                <BoldText text={t('main_5')} customStyle={{fontSize:18,color:"#2B2B2B"}}/>
                            </View>
                            <View style={{marginTop:40,paddingHorizontal:28}}>
                                <View style={{flexDirection:"row",justifyContent:"space-between"}}>
                                    <TouchableWithoutFeedback onPress={()=>navigateScreen("CTGR_01","main_6")}>
                                        <View style={{alignItems:"center",justifyContent:"flex-start"}}>
                                            <Image source={require("../../assets/img/ico_mart.png")} style={[styles.gifticonImg]}/>
                                            <BoldText text={t('main_6')} customStyle={styles.gifticonTxt}/>
                                        </View>
                                    </TouchableWithoutFeedback>
                                    <TouchableWithoutFeedback onPress={()=>navigateScreen("CTGR_02","main_7")}>
                                        <View style={{alignItems:"center",justifyContent:"flex-start"}}>
                                            <Image source={require("../../assets/img/ico_coffee.png")} style={[styles.gifticonImg]}/>
                                            <BoldText text={t('main_7')} customStyle={styles.gifticonTxt}/>
                                        </View>
                                    </TouchableWithoutFeedback>
                                    <TouchableWithoutFeedback onPress={()=>navigateScreen("CTGR_03","main_8")}>
                                        <View style={{alignItems:"center",justifyContent:"flex-start"}}>
                                            <Image source={require("../../assets/img/ico_chicken.png")} style={[styles.gifticonImg]}/>
                                            <BoldText text={t('main_8')} customStyle={styles.gifticonTxt}/>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                                <View style={{flexDirection:"row",justifyContent:"space-between",marginTop:36}}>
                                    <TouchableWithoutFeedback onPress={()=>navigateScreen("CTGR_04","main_9")}>
                                        <View style={{alignItems:"center",justifyContent:"flex-start"}}>
                                            <Image source={require("../../assets/img/ico_icecream.png")} style={[styles.gifticonImg]}/>
                                            <BoldText text={t('main_9')} customStyle={styles.gifticonTxt}/>
                                        </View>
                                    </TouchableWithoutFeedback>
                                    <TouchableWithoutFeedback onPress={()=>navigateScreen("CTGR_05","main_10")}>
                                        <View style={{alignItems:"center",justifyContent:"flex-start"}}>
                                            <Image source={require("../../assets/img/ico_movie.png")} style={[styles.gifticonImg]}/>
                                            <BoldText text={t('main_10')} customStyle={styles.gifticonTxt}/>
                                        </View>
                                    </TouchableWithoutFeedback>
                                    <TouchableWithoutFeedback onPress={()=>navigateScreen("CTGR_06","main_11")}>
                                        <View style={{alignItems:"center",justifyContent:"flex-start"}}>
                                            <Image source={require("../../assets/img/ico_beauty.png")} style={[styles.gifticonImg]}/>
                                            <BoldText text={t('main_11')} customStyle={styles.gifticonTxt}/>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                                <View style={{flexDirection:"row",justifyContent:"space-between",marginTop:36}}>
                                    <TouchableWithoutFeedback onPress={()=>navigateScreen("CTGR_08","main_25")}>
                                        <View style={{alignItems:"center",justifyContent:"flex-start"}}>
                                            <Image source={require("../../assets/img/ico_voucher.png")} style={[styles.gifticonImg]}/>
                                            <BoldText text={t('main_25')} customStyle={styles.gifticonTxt}/>
                                        </View>
                                    </TouchableWithoutFeedback>
                                    <TouchableWithoutFeedback onPress={()=>navigateScreen("CTGR_09","main_26")}>
                                        <View style={{alignItems:"center",justifyContent:"flex-start"}}>
                                            <Image source={require("../../assets/img/ico_gift-card.png")} style={[styles.gifticonImg]}/>
                                            <BoldText text={t('main_26')} customStyle={styles.gifticonTxt}/>
                                        </View>
                                    </TouchableWithoutFeedback>
                                    <TouchableWithoutFeedback onPress={()=>navigateScreen("CTGR_10","main_27")}>
                                        <View style={{alignItems:"center",justifyContent:"flex-start"}}>
                                            <Image source={require("../../assets/img/ico_books.png")} style={[styles.gifticonImg]}/>
                                            <BoldText text={t('main_27')} customStyle={styles.gifticonTxt}/>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={{backgroundColor:"#722D72",width:"100%",padding:20}}>
                        <RegularText text={t('main_12')} customStyle={styles.footer} />
                        <RegularText text={t('main_13')} customStyle={styles.footer} />
                        <RegularText text={t('main_14')} customStyle={styles.footer} />
                        <RegularText text={t('main_15')} customStyle={styles.footer} />
                        <RegularText text={t('main_16')} customStyle={styles.footer} />
                        <RegularText text={t('main_17')} customStyle={[styles.footer,{marginTop:10}]} />
                    </View>
                </ScrollView>
            </SafeAreaView>
            <Modal isVisible={modal} backdropTransitionOutTiming={0} 
                onBackdropPress={()=>{modalToggle(false)}}
                onBackButtonPress={()=>modalToggle(false)}
                style={{margin: 0,flex:1,justifyContent:"flex-start"}} useNativeDriver={true} animationIn={"slideInDown"} animationOut={"slideOutUp"}>
                {Platform.OS === 'ios'? <CommonStatusbar backgroundColor="#FFFFFF"/> : null  }
                <View style={{backgroundColor:"#ffffff",borderBottomRightRadius:50,borderBottomLeftRadius:50,paddingBottom:60}}>
                    <View style={{paddingTop:50,paddingLeft:54}}>
                        <BoldText text={name+t("main_23")} customStyle={{fontSize:15}}/>
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
        backgroundColor:"#FFFFFF",
        elevation:2,
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 0.5,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.6,
    },
    gifticonImg:{
        width:60,
        height:60,
        marginBottom:14
    },
    gifticonTxt:{
        fontSize:12,
        color:"#2B2B2B",
        textAlign:"center"
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