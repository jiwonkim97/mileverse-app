import React, {useState,useEffect} from 'react';
import { useDispatch } from 'react-redux';
import { View,SafeAreaView,TextInput,StyleSheet,ScrollView,Image, TouchableOpacity,TouchableWithoutFeedback } from 'react-native';
import { ExtraBoldText,BoldText } from '../components/customComponents';
import CommonStatusbar from '../components/CommonStatusbar';
import Axios from '../modules/Axios';
import * as dialog from '../actions/dialog';
import { loginSuccess } from '../actions/authentication'

const SignUp02 = (props) =>{
    const dispatch = useDispatch();
    const regex = /^.*(?=^.{8,16}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;
    const [id,setId] = useState("")
    const [phone,setPhone] = useState("")
    const [password,setPassword] = useState("")
    const [password2,setPassword2] = useState("")
    const [name,setName] = useState("")
    const [mail,setMail] = useState("")
    const [doubleChk,setDoubleChk] = useState(false)
    const [pin,setPin] = useState("");
    const [conninfo,setConnInfo] = useState("");

    const [errText,setErrorText] = useState({txt:"-",color:"#FFFFFF"});
    const [errText2,setErrorText2] = useState({txt:"-",color:"#FFFFFF"});
    const [errText3,setErrorText3] = useState({txt:"-",color:"#FFFFFF"});

    useEffect(()=>{
        const {name,mobileno,conninfo} = props.route.params.data;
        setName(name)
        setPhone(mobileno)
        setConnInfo(conninfo)
    },[])

    useEffect(()=>{
        if(pin !== "") {
            Axios.post('/users/insert',{id:id,name:name,phone:phone,pw:password2,email:mail,pin:pin,conninfo:conninfo})
            .then((response)=>{
                if(response.data.result==="success") {
                    dispatch(dialog.openDialog("confirm",(<BoldText text={'회원가입이 완료되었습니다.'}/>),
                    ()=>{
                        dispatch(dialog.closeDialog());
                        dispatch(loginSuccess(response.data.username,response.data.mvp,response.data.code,response.data.pin,response.data.wallet));
                        if(new Date().getTime() <= new Date("2021/07/07 17:00:00").getTime()) {
                            props.navigation.navigate("Event");
                        } else {
                            props.navigation.navigate("Home");
                        }
                    }));
                } else if(response.data.result==="fail"){
                    dispatch(dialog.openDialog("confirm",(
                        <>
                            <BoldText text={response.data.msg}/>
                        </>
                    )));
                }
            }).catch((error)=>{
                console.log(error)
            })
            setPin("");
        }
    },[pin])

    const doSignUp = ()=>{
        const mail_regex= /^[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[@]{1}[-A-Za-z0-9_]+[-A-Za-z0-9_.]*[.]{1}[A-Za-z]{1,5}$/;
        
        if(doubleChk === false) setErrorText({txt:"* 중복확인을 진행해주세요.",color:"#EE1818"});
        else if(password !== password2) setErrorText2({txt:"* 입력하신 비밀번호가 일치하지 않습니다.",color:"#FF3B3B"});
        else if(mail === "") setErrorText3({txt:"* 이메일을 입력해주세요.",color:"#FF3B3B"});
        else if(!mail_regex.test(mail)) setErrorText3({txt:"* 이메일 형식이 잘못되었습니다.",color:"#FF3B3B"});
        else {
            props.navigation.navigate("PinCode",{
                mode:"init",
                onGoBack:(_value)=>{setPin(_value)}
            });
        }
    }
    const doDoubleCheck = () =>{
        setErrorText({txt:"-",color:"#FFFFFF"});
        if(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(id)) {
            setErrorText({txt:"* 아이디에 한글을 사용할 수 없습니다.",color:"#EE1818"})
        } else if(id === "") {
            setErrorText({txt:"* 아이디를 입력해주세요.",color:"#EE1818"})
        } else if(/[\s]/g.test(id)){
            setErrorText({txt:"* 아이디에 공백은 사용할 수 없습니다.",color:"#EE1818"})
        } else {
            Axios.post('/users/doubleCheck',{id:id})
            .then((response)=>{
                if(response.data.result==="success") {
                    setDoubleChk(true)
                    setErrorText({txt:"* 사용가능한 아이디 입니다.",color:"#021AEE"});
                } else {
                    setErrorText({txt:"* 중복된 아이디가 있습니다.",color:"#EE1818"});
                    setDoubleChk(false)
                }
            }).catch((error)=>{
                console.log(error)
            })
        }
    }

    const onChangeId = (_text) =>{
        setId(_text)
        setDoubleChk(false)
    }
    const onChangePhoneText = (_text) =>{
        setPhone(_text.replace(/[^0-9]/g, "").replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})/, "$1-$2-$3").replace("--", "-"))
    }
    return (
        <>
            <CommonStatusbar backgroundColor="#F9F9F9"/>
            <SafeAreaView style={{backgroundColor:"#FFFFFF",flex:1}}>
                <View style={[styles.header,styles.shadow]}>
                    <TouchableOpacity onPress={()=>props.navigation.goBack()}>
                        <View style={styles.headerIcoWrap}>
                            <Image source={require('../../assets/img/ico_back.png')} style={{width:21,height:21}} />
                        </View>
                    </TouchableOpacity>
                    <View style={[styles.headerIcoWrap,{flex:1}]}>
                        <ExtraBoldText text={"회원가입"} customStyle={{fontSize:16}}/>
                    </View>
                    <TouchableOpacity onPress={()=>props.navigation.navigate("Login")}>
                        <View style={styles.headerIcoWrap}>
                            <Image source={require("../../assets/img/ico_close_bl.png")} style={{width:20,height:20}}/>
                        </View>
                    </TouchableOpacity>
                </View>
                <ScrollView style={{padding:16,flex:1}} contentContainerStyle={{justifyContent:"space-between",flexGrow:1}}>
                    <View style={{flexDirection:"row",justifyContent:"flex-end",alignItems:"center"}}>
                        <Image source={require('../../assets/img/ico_progress_none.png')} style={{resizeMode:"stretch",width:10,height:10}}/>
                        <Image source={require('../../assets/img/ico_progress_02.png')} style={{marginLeft:5,resizeMode:"stretch",width:20,height:20}}/>
                    </View>
                    <View style={{marginTop:14,flex:1}}>
                        <ExtraBoldText text={"상세정보"} customStyle={{fontSize:14,color:"#707070"}}/>
                        <View style={{marginTop:14,borderRadius:6,borderWidth:1,borderColor:"#E5E5E5",paddingLeft:16,paddingRight:5,paddingVertical:5,flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
                            <BoldText text={"아이디"} customStyle={styles.label}/>
                            <View style={{flexDirection:"row",alignItems:"center",flex:1}}>
                                <TextInput placeholder="아이디를 입력해주세요." maxLength={20} placeholderTextColor="#D5C2D3" onChangeText={text => onChangeId(text)} style={[styles.input,{marginRight:15}]}/>
                                <TouchableWithoutFeedback onPress={doDoubleCheck}>
                                    <View style={[styles.btnBox,{width:76,height:36}]}>
                                        <BoldText text={"중복확인"} customStyle={{fontSize:12,color:"#FFFFFF"}}/>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                        <View style={{paddingTop:8,paddingBottom:10,paddingLeft:4}}>
                            <BoldText text={errText.txt} customStyle={{fontSize:10,color:errText.color}}/>
                        </View>
                        <View style={{borderRadius:6,borderWidth:1,borderColor:"#E5E5E5"}}>
                            <View style={[styles.inputBox,{borderBottomWidth:1,borderBottomColor:"#ECECEC"}]}>
                                <BoldText text={"비밀번호"} customStyle={styles.label}/>
                                <TextInput placeholder="비밀번호를 입력해주세요." secureTextEntry={true} maxLength={16} placeholderTextColor="#D5C2D3" onChangeText={text=>setPassword(text)} style={styles.input} onBlur={()=>{
                                        setErrorText2({txt:"-",color:"#FFFFFF"})
                                        if(!regex.test(password) && password!=="") setErrorText2({txt:"* 8~16자 영문, 숫자, 특수문자를 사용하세요.",color:"#FF3B3B"});
                                }}/>
                            </View>
                            <View style={styles.inputBox}>
                                <BoldText text={"비밀번호 확인"} customStyle={styles.label}/>
                                <TextInput placeholder="비밀번호를 한 번 더 입력해주세요." secureTextEntry={true} maxLength={16} placeholderTextColor="#D5C2D3" onChangeText={text=>setPassword2(text)} style={styles.input} onBlur={()=>{
                                        setErrorText2({txt:"-",color:"#FFFFFF"})
                                        if(!regex.test(password2) && password2!=="") setErrorText2({txt:"* 8~16자 영문, 숫자, 특수문자를 사용하세요.",color:"#FF3B3B"});
                                        else if(password !== password2) setErrorText2({txt:"* 입력하신 비밀번호가 일치하지 않습니다.",color:"#FF3B3B"});
                                }}/>
                            </View>
                        </View>
                        <View style={{paddingTop:8,paddingBottom:10,paddingLeft:4}}>
                            <BoldText text={errText2.txt} customStyle={{fontSize:10,color:errText2.color}}/>
                        </View>
                        <View style={{borderRadius:6,borderWidth:1,borderColor:"#E5E5E5"}}>
                            <View style={[styles.inputBox,{borderBottomWidth:1,borderBottomColor:"#ECECEC"}]}>
                                <BoldText text={"이름"} customStyle={styles.label}/>
                                <TextInput placeholder="이름을 입력해주세요." editable={false} maxLength={10} placeholderTextColor="#D5C2D3" value={name} onChangeText={text=>setName(text)} style={styles.input}/>
                            </View>
                            <View style={[styles.inputBox,{borderBottomWidth:1,borderBottomColor:"#ECECEC"}]}>
                                <BoldText text={"휴대폰 번호"} customStyle={styles.label}/>
                                <TextInput placeholder="휴대폰 번호를 입력해주세요." editable={false} maxLength={13} keyboardType={'numeric'} value={phone} placeholderTextColor="#D5C2D3" onChangeText={(text)=>onChangePhoneText(text)} style={styles.input}/>
                            </View>
                            <View style={styles.inputBox}>
                                <BoldText text={"이메일"} customStyle={styles.label}/>
                                <TextInput placeholder="이메일을 입력해주세요." autoCompleteType={'email'} keyboardType={'email-address'} placeholderTextColor="#D5C2D3" onChangeText={text=>setMail(text)} style={styles.input} onBlur={()=>{
                                        if(mail !== "") setErrorText3({txt:"-",color:"#FFFFFF"})
                                    }}/>
                            </View>
                        </View>
                        <View style={{marginTop:8,paddingLeft:4}}>
                            <BoldText text={errText3.txt} customStyle={{fontSize:10,color:errText3.color}}/>
                        </View>
                    </View>
                    <View style={{justifyContent:"flex-end"}}>
                        <TouchableWithoutFeedback onPress={doSignUp}>
                            <View style={[styles.btnBox,{height:46}]}>
                                <BoldText text={"회원가입 완료 "} customStyle={{fontSize:12,color:"#FFFFFF"}}/>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    )
}
        
export default SignUp02;

const styles = StyleSheet.create({
    header:{
        height:50,
        borderColor:"#CCCCCC",
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'row',
        zIndex:1
    },
    headerIcoWrap:{
        width:50,
        height:50,
        justifyContent:'center',
        alignItems:'center'
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
    label:{
        color:"#707070",
        fontSize:12
    },
    input:{
        color:"#000000",
        textAlign:"right",
        height:20,
        fontSize:13,
        paddingVertical:0,
        fontFamily:"NotoSans-Regular",
        flex:1
    },
    inputBox:{
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        padding:16
    },
    btnBox:{
        backgroundColor:"#8D3981",
        justifyContent:"center",
        alignItems:"center",
        borderRadius:6
    }
});