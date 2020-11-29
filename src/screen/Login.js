import React, { useEffect, useCallback,useState } from 'react';
import { Image,View,SafeAreaView,TextInput,StyleSheet,TouchableWithoutFeedback } from 'react-native';
import CheckBox from 'react-native-check-box'
import { useDispatch } from 'react-redux';
import * as actions from '../actions/authentication'
import AsyncStorage from '@react-native-community/async-storage';
import * as spinner from '../actions/spinner'
import {BoldText, RegularText} from '../components/customComponents';
import CommonStatusbar from '../components/CommonStatusbar';



const LoginScreen = (props) =>{
    const dispatch = useDispatch();
    const [autoLogin, setautoLogin] = useState(false);
    const [id,setId] = useState("");
    const [pw,setPw] = useState("");
    const [focusColor, setFocusColor] = useState("#A9A9A9");
    const [focusColor2, setFocusColor2] = useState("#A9A9A9");
    const [erorText,setErrorText] = useState("#FFFFFF");

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
    
    const requestLogin = useCallback((_id,_pw)=>{
        setErrorText("#FFFFFF");
        if(_id === '' || _pw === '') {
            setErrorText("#EE1818");
        } else {
            dispatch(spinner.showSpinner());
            dispatch(actions.loginRequest(_id,_pw)).then((result)=>{
                if(result.stat === "SUCCESS"){
                    AsyncStorage.mergeItem("@loginStorage",JSON.stringify({id:_id,password:_pw}));
                    dispatch(spinner.hideSpinner());
                    props.navigation.goBack();
                } else {
                    dispatch(spinner.hideSpinner());
                    setErrorText("#EE1818");
                }
            })
        }
    },[dispatch]);

    return (
        <SafeAreaView style={{flex:1,backgroundColor:"#FFF"}}>
            <CommonStatusbar backgroundColor="#FFFFFF"/>
            <View style={{position:"absolute",top:20,right:20}}>
                <TouchableWithoutFeedback onPress={()=>{
                    props.navigation.goBack()
                }}>
                    <Image source={require('../../assets/img/ico_close_bl.png')} style={{resizeMode:"contain",width:20}} />    
                </TouchableWithoutFeedback>   
            </View>
            <View style={{marginTop:60,justifyContent:"center",alignItems:"center"}}>
                <Image source={require('../../assets/img/mileverse_letter_2.png')} style={{resizeMode:'contain',height:25}} />
            </View>
            <View style={{marginTop:50,paddingHorizontal:30}}>
                <TextInput placeholder="아이디를 입력해주세요." style={[styles.inputForm,{color:focusColor,borderColor:focusColor}]} 
                    onChangeText={(text)=>setId(text)} 
                    value={id} 
                    onFocus={()=>setFocusColor('#8D3981')} 
                    onBlur={()=>setFocusColor('#A9A9A9')}/>
                <TextInput placeholder="비밀번호를 입력해주세요." style={[styles.inputForm,{color:focusColor2,borderColor:focusColor2,marginTop:10}]} 
                    onChangeText={(text)=>setPw(text)} 
                    secureTextEntry={true} 
                    value={pw} 
                    onFocus={()=>setFocusColor2('#8D3981')} 
                    onBlur={()=>setFocusColor2('#A9A9A9')}/>
                <View style={{marginTop:8,paddingLeft:4}}>
                    <BoldText text={"* 아이디 및 비밀번호를 확인해주세요."} customStyle={{fontSize:10,color:erorText}}/>
                </View>
                <TouchableWithoutFeedback onPress={()=>{requestLogin(id,pw);}}>
                    <View style={{marginTop:10,width:"100%",height:46,backgroundColor:"#8D3981",borderRadius:8,justifyContent:"center",alignItems:"center"}}>
                        <BoldText text={"로그인"} customStyle={{color:"#FFF",fontWeight:'bold',fontSize:14}}/>
                    </View>
                </TouchableWithoutFeedback>
                <View style={{marginTop:12,paddingBottom:16,borderBottomWidth:1,borderBottomColor:"#D8D8D8",flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
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
                        <BoldText text={"자동 로그인"} customStyle={{color:'#444444',lineHeight:25,fontSize:12,marginLeft:4}}/>
                    </View>
                    <TouchableWithoutFeedback onPress={()=>props.navigation.navigate("FindAccount")}>
                        <View>
                            <BoldText text={"아이디/비밀번호 찾기"} customStyle={{color:'#444444',fontSize:12}}/>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <View style={{marginTop:16,flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
                    <TouchableWithoutFeedback onPress={()=> props.navigation.navigate("SignUp01")}>
                        <View>
                            <RegularText text={"회원가입"} customStyle={{color:'#676767',fontSize:12}} />
                        </View>
                    </TouchableWithoutFeedback>
                    <RegularText text={"|"} customStyle={{color:'#676767',fontSize:12,marginHorizontal:8}} />
                    <TouchableWithoutFeedback onPress={()=> props.navigation.navigate("Contact")}>
                        <View>
                            <RegularText text={"가맹점 문의"} customStyle={{color:'#676767',fontSize:12}} />
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </View>
        </SafeAreaView>
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