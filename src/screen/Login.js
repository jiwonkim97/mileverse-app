import React, { useEffect, useCallback,useState } from 'react';
import { Image,Text,View,SafeAreaView,TextInput,StyleSheet,Alert } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { useDispatch } from 'react-redux';
import * as actions from '../actions/authentication'
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import * as spinner from '../actions/spinner'
import * as toast from '../actions/toast'
import {BoldText, RegularText} from '../components/customComponents';



const LoginScreen : () => React$Node = (props) =>{
    const dispatch = useDispatch();
    const [saveId, setsaveId] = useState(false);
    const [autoLogin, setautoLogin] = useState(false);
    const [id,setId] = useState("");
    const [pw,setPw] = useState("");
    const [focusColor, setFocusColor] = useState("#A9A9A9");
    const [focusColor2, setFocusColor2] = useState("#A9A9A9");

    useEffect(() => {
        storageGetData()
    },[]);
    const errorToast = (msg) =>{
        dispatch(toast.onErrorAlert(msg))
    }
    
    const requestLogin = useCallback((_id,_pw)=>{
        if(_id === '') {
            errorToast("아이디를 입력해 주세요.")
        } else if (_pw === '') {
            errorToast("비밀번호를 입력해 주세요.")
        } else {
            dispatch(spinner.showSpinner());
            dispatch(actions.loginRequest(_id,_pw)).then((result)=>{
                if(result === "SUCCESS"){
                    dispatch(spinner.hideSpinner());
                    props.navigation.goBack();
                } else {
                    Alert.alert("알림","아이디 및 비밀번호를 확인해주세요.",[{text:"확인",onPress:()=>dispatch(spinner.hideSpinner())}])
                }
            })
        }
    },[dispatch]);

    const storageGetData = async() =>{
        await AsyncStorage.getItem("@loginStorage").then(value=>{
            if(value !== null) {
                let _data = JSON.parse(value);
                setId(_data.id)
                setPw(_data.password)
                setautoLogin(_data.autoLogin)
                setsaveId(_data.saveId)
            }
        })
    }

    const storageSetData = async () =>{
        let loginData = {
            autoLogin : autoLogin,
            saveId : saveId,
            id : saveId || autoLogin ? id : '',
            password : autoLogin ? pw : ''
        }
        await AsyncStorage.setItem("@loginStorage",JSON.stringify(loginData))
    }

    return (
        <SafeAreaView style={{flex:1,backgroundColor:"#FFF"}}>
            <View style={{height:20,justifyContent:'center',alignItems:"space-between",paddingRight:12,paddingTop:19}}>
                <TouchableOpacity onPress={()=>{
                    props.navigation.goBack()
                }}>
                    <Image source={require('../../assets/img/ico_close_bl.png')} style={{resizeMode:"contain",width:20}} />    
                </TouchableOpacity>
            </View>
            <View style={{marginTop:50,justifyContent:"center",alignItems:"center"}}>
                <Image source={require('../../assets/img/header_logo.png')} style={{resizeMode:'contain',height:25}} />
            </View>
            <View style={{marginTop:50,paddingHorizontal:30}}>
                <TextInput placeholder="아이디를 입력해주세요." style={[styles.inputForm,{color:focusColor,borderColor:focusColor,fontFamily:"NanumSquareR"}]} 
                    onChangeText={(text)=>setId(text)} 
                    value={id} 
                    onFocus={()=>setFocusColor('#8D3981')} 
                    onBlur={()=>setFocusColor('#A9A9A9')}/>
                <TextInput placeholder="비밀번호를 입력해주세요." style={[styles.inputForm,{color:focusColor2,borderColor:focusColor2,marginTop:20}]} 
                    onChangeText={(text)=>setPw(text)} 
                    secureTextEntry={true} 
                    value={pw} 
                    onFocus={()=>setFocusColor2('#8D3981')} 
                    onBlur={()=>setFocusColor2('#A9A9A9')}/>
                <TouchableOpacity onPress={()=>{
                            requestLogin(id,pw);
                            storageSetData();
                        }}>
                    <View style={{marginTop:20,width:"100%",height:40,backgroundColor:"#8D3981",borderRadius:8,justifyContent:"center",alignItems:"center"}}>
                        <BoldText text={"로그인"} customStyle={{color:"#FFF",fontWeight:'bold'}}/>
                    </View>
                </TouchableOpacity>
                <View style={{marginTop:20,paddingBottom:18,borderBottomWidth:1,borderBottomColor:"#D8D8D8",flexDirection:"row"}}>
                    <View style={{flexDirection:"row"}}>
                        <CheckBox
                            tintColors={{ true: '#8D3981' }}
                            value={saveId}
                            onValueChange={() => saveId ? setsaveId(false) : setsaveId(true)}
                        />
                        <BoldText text={"아이디 저장"} customStyle={{color:'#444444',lineHeight:32,fontSize:12}}/>
                    </View>
                    <View style={{flexDirection:"row",marginLeft:20}}>
                        <CheckBox
                            tintColors={{ true: '#8D3981' }}
                            value={autoLogin}
                            onValueChange={() => autoLogin ? setautoLogin(false) : setautoLogin(true)}
                        />
                        <BoldText text={"자동 로그인"} customStyle={{color:'#444444',lineHeight:32,fontSize:12}}/>
                    </View>
                </View>
                <View style={{marginTop:16,flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
                    <TouchableOpacity onPress={()=> props.navigation.navigate("SignUp")}>
                        <RegularText text={"회원가입"} customStyle={{color:'#676767',fontSize:12}} />
                    </TouchableOpacity>
                    <RegularText text={"|"} customStyle={{color:'#676767',fontSize:12,marginHorizontal:8}} />
                    <TouchableOpacity onPress={()=> props.navigation.navigate("Contact")}>
                        <RegularText text={"가맹점 문의"} customStyle={{color:'#676767',fontSize:12}} />
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}
export default LoginScreen;

const styles = StyleSheet.create({
    inputForm:{
        height:40,
        borderRadius:6,
        backgroundColor:"#F2F2F2",
        paddingLeft:10,
        borderWidth:1
    }
});