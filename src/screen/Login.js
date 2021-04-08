import React, { useEffect, useState } from 'react';
import { Image,View,SafeAreaView,TextInput,StyleSheet,TouchableWithoutFeedback,Linking } from 'react-native';
import CheckBox from 'react-native-check-box'
import { useDispatch } from 'react-redux';
import * as actions from '../actions/authentication'
import AsyncStorage from '@react-native-community/async-storage';
import * as spinner from '../actions/spinner'
import {BoldText, RegularText} from '../components/customComponents';
import CommonStatusbar from '../components/CommonStatusbar';
import { useTranslation } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';
import {checkAbusing} from '../modules/AbusingHelper';
import {updatePushToken} from '../modules/FireBaseHelper';
import Axios from '../modules/Axios'

const LoginScreen = (props) =>{
    const dispatch = useDispatch();
    const [autoLogin, setautoLogin] = useState(false);
    const [id,setId] = useState("");
    const [pw,setPw] = useState("");
    const [focusColor, setFocusColor] = useState("#E5E5E5");
    const [focusColor2, setFocusColor2] = useState("#E5E5E5");
    const [textColor,setTextColor] = useState("#2B2B2B");
    const [textColor2,setTextColor2] = useState("#A9A9A9")
    const [erorText,setErrorText] = useState(false);
    const { t } = useTranslation();

    useEffect(() => {
        const storageGetData = async() =>{
            await AsyncStorage.getItem("@loginStorage").then(value=>{
                if(value !== null) {
                    let _data = JSON.parse(value);
                    setautoLogin(_data.autoLogin)
                    if(_data.autoLogin === true) {
                        setId(_data.id)
                        setPw(_data.password)
                    }
                }
            })
        }
        storageGetData()
    },[]);
    
    const requestLogin = async(_id,_pw)=>{
        setErrorText(false);
        if(_id === '' || _pw === '') {
            setErrorText(true);
        } else {
            dispatch(spinner.showSpinner());
            dispatch(actions.loginRequest(_id,_pw)).then( async(result)=>{
                if(result.stat === "SUCCESS"){
                    AsyncStorage.mergeItem("@loginStorage",JSON.stringify({id:_id,password:_pw}));
                    await checkAbusing(_id);
                    await updatePushToken(_id);
                    dispatch(spinner.hideSpinner());
                    props.navigation.goBack();
                } else {
                    dispatch(spinner.hideSpinner());
                    setErrorText(true);
                }
            })
        }
    };

    const linkBanner = async()=>{
        const {data} = await Axios.get("/get/storage",{params:{key:"SQUARE_NOTE_URL"}});
        Linking.openURL(data.value);
    }

    return (
        <>
            <CommonStatusbar backgroundColor="#F9F9F9"/>
            <SafeAreaView style={{flex:1,backgroundColor:"#FFFFFF"}}>
                <View style={{alignItems:"flex-end",paddingHorizontal:30,justifyContent:"center",height:50}}>
                    <TouchableWithoutFeedback onPress={()=>{
                        props.navigation.goBack()
                    }}>
                        <Image source={require('../../assets/img/ico_close_bl.png')} style={{resizeMode:"stretch",width:20,height:20}} />    
                    </TouchableWithoutFeedback>   
                </View>
                <View style={{marginTop:6,justifyContent:"center",alignItems:"center"}}>
                    <Image source={require('../../assets/img/mileverse_letter_2.png')} style={{resizeMode:'contain',height:25}} />
                </View>
                <View style={{marginTop:40,paddingHorizontal:30}}>
                    <TextInput placeholder={t('login_2')} placeholderTextColor={"#D5C2D3"} style={[styles.inputForm,{color:textColor,borderColor:focusColor}]} 
                        onChangeText={(text)=>setId(text)} 
                        value={id} 
                        onFocus={()=>{
                            setFocusColor('#8D3981');
                            setTextColor("#8D3981");
                        }}
                        onChange={()=>{setErrorText(false)}}
                        onBlur={()=>{
                            setFocusColor('#E5E5E5');
                            setTextColor("#2B2B2B");
                        }}
                    />
                    <TextInput placeholder={t('login_3')} placeholderTextColor={"#D5C2D3"} style={[styles.inputForm,{color:textColor2,borderColor:focusColor2,marginTop:10}]} 
                        onChangeText={(text)=>setPw(text)} 
                        secureTextEntry={true} 
                        value={pw} 
                        onFocus={()=>{
                            setFocusColor2('#8D3981');
                            setTextColor2('#8D3981');
                        }} 
                        onChange={()=>{setErrorText(false)}}
                        onBlur={()=>{
                            setFocusColor2('#E5E5E5');
                            setTextColor2('#2B2B2B');
                        }}/>
                    {
                        erorText?
                            <View style={{marginTop:8,paddingLeft:4}}>
                                <BoldText text={t("alert_login_1")} customStyle={{fontSize:10,color:"#EE1818"}}/>
                            </View>
                        :
                            null
                    }
                    
                    <TouchableWithoutFeedback onPress={()=>{requestLogin(id,pw);}}>
                        <View style={{marginTop:10,width:"100%",height:46,backgroundColor:"#8D3981",borderRadius:8,justifyContent:"center",alignItems:"center"}}>
                            <BoldText text={t('login_1')} customStyle={{color:"#FFF",fontSize:14}}/>
                        </View>
                    </TouchableWithoutFeedback>
                    <View style={{marginTop:12,paddingBottom:12,borderBottomWidth:1,borderBottomColor:"#D8D8D8",flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
                        <View style={{flexDirection:"row"}}>
                            <CheckBox
                                isChecked={autoLogin}
                                checkedCheckBoxColor={'#8D3981'}
                                uncheckedCheckBoxColor={"#999999"}
                                onClick={() => {
                                    setautoLogin(!autoLogin);
                                    AsyncStorage.mergeItem("@loginStorage",JSON.stringify({autoLogin:!autoLogin}));
                                }}
                            />
                            <BoldText text={t('login_4')} customStyle={{color:'#444444',lineHeight:25,fontSize:12,marginLeft:4}}/>
                        </View>
                        <TouchableWithoutFeedback onPress={()=>props.navigation.navigate("FindAccount")}>
                            <View>
                                <BoldText text={t('login_find_1')} customStyle={{color:'#444444',fontSize:12}}/>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={{marginTop:16,flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
                        <TouchableWithoutFeedback onPress={()=> {
                            if(RNLocalize.getLocales()[0].languageCode === "ko") {
                                props.navigation.navigate("SignUp01")
                            }else {
                                props.navigation.navigate("SignUpEn")
                            }
                        }}>
                            <View>
                                <RegularText text={t('login_5')} customStyle={{color:'#676767',fontSize:12}} />
                            </View>
                        </TouchableWithoutFeedback>
                        <RegularText text={"|"} customStyle={{color:'#676767',fontSize:12,marginHorizontal:8}} />
                        <TouchableWithoutFeedback onPress={()=> props.navigation.navigate("Contact")}>
                            <View>
                                <RegularText text={t('login_6')} customStyle={{color:'#676767',fontSize:12}} />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
                <View style={{}}>
                    <TouchableWithoutFeedback onPress={linkBanner}>
                        <Image
                            source={require("../../assets/img/banner_bottom_square_note.png")}
                            style={{resizeMode:"contain",width:'100%'}}
                        />
                    </TouchableWithoutFeedback>
                </View>
            </SafeAreaView>
        </>
        
    )
}
export default LoginScreen;

const styles = StyleSheet.create({
    inputForm:{
        height:46,
        borderRadius:6,
        backgroundColor:"#FFFFFF",
        borderWidth:1,
        paddingVertical:12,
        paddingHorizontal:18,
        fontFamily:"NotoSans-Regular"
    }
});