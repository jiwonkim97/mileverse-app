import React, { useEffect, useCallback,useState } from 'react';
import { Image,View,SafeAreaView,TextInput,StyleSheet,Alert } from 'react-native';
import CheckBox from 'react-native-check-box'
import { useDispatch } from 'react-redux';
import * as actions from '../actions/authentication'
import { TouchableOpacity } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-community/async-storage';
import * as spinner from '../actions/spinner'
import * as toast from '../components/Toast'
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
    
    const requestLogin = useCallback((_id,_pw)=>{
        if(_id === '') {
            toast.error("아이디를 입력해 주세요.")
        } else if (_pw === '') {
            toast.error("비밀번호를 입력해 주세요.")
        } else {
            dispatch(spinner.showSpinner());
            dispatch(actions.loginRequest(_id,_pw)).then((result)=>{
                if(result.stat === "SUCCESS"){
                    dispatch(spinner.hideSpinner());
                    props.navigation.goBack();
                } else {
                    Alert.alert("알림",result.msg,[{text:"확인",onPress:()=>dispatch(spinner.hideSpinner())}])
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
            <View style={{height:60,justifyContent:'center',alignItems:"flex-end",paddingRight:12,paddingTop:20}}>
                <TouchableOpacity onPress={()=>{
                    props.navigation.goBack()
                }}>
                    <Image source={require('../../assets/img/ico_close_bl.png')} style={{resizeMode:"contain",width:20}} />    
                </TouchableOpacity>
            </View>
            <View style={{marginTop:22,justifyContent:"center",alignItems:"center"}}>
                <Image source={require('../../assets/img/mileverse_letter_2.png')} style={{resizeMode:'contain',height:25}} />
            </View>
            <View style={{marginTop:53,paddingHorizontal:30}}>
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
                            isChecked={saveId}
                            checkedCheckBoxColor={'#8D3981'}
                            uncheckedCheckBoxColor={"#999999"}
                            style={{marginHorizontal:4}}
                            onClick={() => saveId ? setsaveId(false) : setsaveId(true)}
                        />
                        <BoldText text={"아이디 저장"} customStyle={{color:'#444444',lineHeight:25,fontSize:12}}/>
                    </View>
                    <View style={{flexDirection:"row",marginLeft:20}}>
                        <CheckBox
                            isChecked={autoLogin}
                            checkedCheckBoxColor={'#8D3981'}
                            uncheckedCheckBoxColor={"#999999"}
                            style={{marginHorizontal:4}}
                            onClick={() => autoLogin ? setautoLogin(false) : setautoLogin(true)}
                        />
                        <BoldText text={"자동 로그인"} customStyle={{color:'#444444',lineHeight:25,fontSize:12}}/>
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