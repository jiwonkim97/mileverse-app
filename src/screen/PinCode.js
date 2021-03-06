import React, { useEffect, useRef, useState } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import {View,SafeAreaView,TextInput,StyleSheet,TouchableWithoutFeedback,Keyboard,Platform,Image} from 'react-native';
import CommonStatusbar from '../components/CommonStatusbar';
import {ExtraBoldText,BoldText} from '../components/customComponents';
import * as actions from '../actions/authentication';
import * as RNLocalize from 'react-native-localize';
import { useTranslation } from 'react-i18next';

const PinCode = ({navigation,route})=>{
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const {pin:auth_pin} = useSelector(state => state.authentication.userInfo);
    const inputRef = useRef();
    const [pin,setPin] = useState("");
    const [dots,setDots] = useState({
        dots1:{active:false},
        dots2:{active:false},
        dots3:{active:false},
        dots4:{active:false},
        dots5:{active:false},
        dots6:{active:false},
    });
    const [error,setError] = useState(false);
    const [confirm,setConfirm] = useState(false);
    const [numCheck,setNumCheck] = useState(false);
    const [firstChk,setFirstChk] = useState(false);
    const [firstPin,setFirstPin] = useState("");
    const [local,setLocale] = useState("ko");
    
    useEffect(()=>{
        Keyboard.addListener('keyboardDidHide',()=>{
            Keyboard.dismiss();
        });
        RNLocalize.getLocales()[0].languageCode === 'ko' ? setLocale("ko") : setLocale("en")

    },[]);

    useEffect(()=>{
        if(pin.length === 6) {
            if((route.params.mode === 'set' || route.params.mode === 'init') && firstChk === false) {
                setConfirm(true);
                setFirstChk(true);
                setFirstPin(pin);
                setPin("");
                clearDots();
            } else if(route.params.mode === 'set' && firstChk === true){
                if(pin === firstPin) {
                    dispatch(actions.changePinRequest(pin)).then((result)=>{
                        if(result.stat === "SUCCESS"){
                            navigation.goBack();
                        } else {
                            alert(result.msg)
                        }
                    })
                } else {
                    setConfirm(false);
                    setFirstChk(false);
                    setError(true);
                    setPin("");
                    clearDots();
                }
            } else if(route.params.mode === 'init' && firstChk === true){
                if(pin === firstPin) {
                    route.params.onGoBack(pin);
                    navigation.goBack();
                } else {
                    setConfirm(false);
                    setFirstChk(false);
                    setError(true);
                    setPin("");
                    clearDots();
                }
            }else {
                if(pin === auth_pin) {
                    route.params.onGoBack(true);
                    navigation.goBack();
                }else {
                    setError(true);
                    setPin("");
                    clearDots();
                }
            }
        }
    },[pin]);

    const clearDots = ()=>{
        let _dots = {};
        for(let i = 1 ; i<=6 ; i++) {
            _dots["dots"+i] = {active:false}
        }        
        setDots(_dots);
    }

    const onKeyboardToggle = ()=>{
        if(inputRef.current.isFocused()) {
            Keyboard.dismiss();
        } else {
            inputRef.current.focus();
        }
    }

    const onSetDots = (text)=>{
        const regexp = /^[0-9]*$/

        error ? setError(!error) :null;
        confirm ? setConfirm(!confirm) :null;
        numCheck ? setNumCheck(!numCheck) :null;
        let _dots = {};
        if(regexp.test(text)) {
            for(let i = 1 ; i<=6 ; i++) {
                if(i<=text.length) {
                    _dots["dots"+i] = {active:true}
                } else {
                    _dots["dots"+i] = {active:false}
                }
            }
            setPin(text);
            setDots(_dots);
        } else {
            setNumCheck(true)
            setPin(text.slice(0,-1))
        }
        
    }

    return (
        <>
            <CommonStatusbar backgroundColor="#EEEEEE"/>
            <SafeAreaView style={{flex:1,backgroundColor:"#EEEEEE"}}>
                <View style={{paddingLeft:40,paddingTop:70}}>
                    {
                        local === 'ko' ?
                        <>
                            <View style={{flexDirection:"row"}}>
                                <ExtraBoldText text={"PIN??????"} customStyle={{fontSize:30}}/>
                                <BoldText text={"???"} customStyle={{fontSize:30}}/>
                            </View>
                            <BoldText text={"??????????????????."} customStyle={{fontSize:30,marginTop:8}}/>
                        </> 
                        :
                        <BoldText text={t('menu_info_11')} customStyle={{fontSize:25,marginTop:8}}/>
                    }
                    
                </View>
                {
                    Platform.OS === "ios" ? 
                    <TouchableWithoutFeedback onPress={()=>navigation.goBack()}>
                        <Image source={require('../../assets/img/ico_close_bl.png')} style={{position:"absolute",right:15,top:15,width:20,height:20}}></Image>
                    </TouchableWithoutFeedback>
                    : null
                }
                <TouchableWithoutFeedback onPress={onKeyboardToggle}>
                    <View style={{marginTop:20,flexDirection:'row',justifyContent:"space-around",paddingHorizontal:20,height:35}}>
                        <View style={styles.dotsWrap}>
                            {dots.dots1.active ? <View style={styles.dots} /> : null}
                        </View>
                        <View style={styles.dotsWrap}>
                            {dots.dots2.active ? <View style={styles.dots} /> : null}
                        </View>
                        <View style={styles.dotsWrap}>
                            {dots.dots3.active ? <View style={styles.dots} /> : null}
                        </View>
                        <View style={styles.dotsWrap}>
                            {dots.dots4.active ? <View style={styles.dots} /> : null}
                        </View>
                        <View style={styles.dotsWrap}>
                            {dots.dots5.active ? <View style={styles.dots} /> : null}
                        </View>
                        <View style={styles.dotsWrap}>
                            {dots.dots6.active ? <View style={styles.dots} /> : null}
                        </View>
                    </View>
                </TouchableWithoutFeedback>
                <View style={{alignItems:'center',marginTop:20}}>
                    {
                        error ? <BoldText text={t("alert_pincode_3")}  customStyle={{color:"#EE1818"}} /> : null
                    }
                    {
                        confirm ? <BoldText text={t("menu_info_12")}  customStyle={{color:"#021AEE"}} /> : null
                    }
                    {
                        numCheck ? <BoldText text={t("alert_pincode_2")}  customStyle={{color:"#EE1818"}} /> : null
                    }
                </View>
                <TextInput value={pin} ref={inputRef} autoFocus={true} keyboardType={"numeric"} maxLength={6} style={{width:0,height:0,fontFamily:"NotoSans-Regular"}} onChangeText={text=>{onSetDots(text)}}/>
            </SafeAreaView>
        </>
    )
}
const styles = StyleSheet.create({
    dotsWrap:{
        borderBottomWidth:2,
        borderBottomColor:"#B6B6B6",
        width:50,
        justifyContent:"center",
        alignItems:"center",
        padding:10
    },
    dots : {
        borderRadius:100,
        backgroundColor:"#8D3981",
        width:15,
        height:15
    }
})

export default PinCode;