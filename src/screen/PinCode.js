import React, { useEffect, useRef, useState } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import {View,SafeAreaView,TextInput,StyleSheet,TouchableWithoutFeedback,Keyboard,BackHandler} from 'react-native';
import CommonStatusbar from '../components/CommonStatusbar';
import {ExtraBoldText,BoldText} from '../components/customComponents';
import * as actions from '../actions/authentication'
const PinCode = ({navigation,route})=>{
    const dispatch = useDispatch();
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
    const [firstChk,setFirstChk] = useState(false);
    const [firstPin,setFirstPin] = useState("");

    
    useEffect(()=>{
        Keyboard.addListener('keyboardDidHide',()=>{
            Keyboard.dismiss();
        })
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
        error ? setError(!error) :null;
        confirm ? setConfirm(!confirm) :null;
        let _dots = {};
        for(let i = 1 ; i<=6 ; i++) {
            if(i<=text.length) {
                _dots["dots"+i] = {active:true}
            } else {
                _dots["dots"+i] = {active:false}
            }
        }
        setPin(text);
        setDots(_dots);
    }

    return (
        <>
            <CommonStatusbar backgroundColor="#F9F9F9"/>
            <SafeAreaView style={{flex:1}}>
                <View style={{paddingLeft:40,paddingTop:70}}>
                    <View style={{flexDirection:"row"}}>
                        <ExtraBoldText text={"PIN번호"} customStyle={{fontSize:30}}/>
                        <BoldText text={"를"} customStyle={{fontSize:30}}/>
                    </View>
                    <BoldText text={"입력해주세요."} customStyle={{fontSize:30,marginTop:8}}/>
                </View>
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
                        error ? <BoldText text={"Pin코드가 일치하지 않습니다."}  customStyle={{color:"#EE1818"}} /> : null
                    }
                    {
                        confirm ? <BoldText text={"한 번 더 입력해 주세요."}  customStyle={{color:"#021AEE"}} /> : null
                    }
                </View>
                <TextInput value={pin} ref={inputRef} autoFocus={true} keyboardType={"numeric"} maxLength={6} style={{width:0,height:0}} onChangeText={text=>{onSetDots(text)}}/>
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