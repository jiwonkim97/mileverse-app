import React, {useState,useEffect} from 'react';
import { View,SafeAreaView,TextInput,StyleSheet,ScrollView,Image, Alert,TouchableWithoutFeedback } from 'react-native';
import { ExtraBoldText,BoldText } from '../components/customComponents';
import CommonStatusbar from '../components/CommonStatusbar';
import Axios from '../modules/Axios';

const SignUp02 = (props) =>{
    const regex = /^.*(?=^.{8,16}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;
    const [id,setId] = useState("")
    const [phone,setPhone] = useState("")
    const [password,setPassword] = useState("")
    const [password2,setPassword2] = useState("")
    const [name,setName] = useState("")
    const [mail,setMail] = useState("")
    const [doubleChk,setDoubleChk] = useState(false)
    const [pin,setPin] = useState("");

    const [errText,setErrorText] = useState({txt:"-",color:"#FFFFFF"});
    const [errText2,setErrorText2] = useState({txt:"-",color:"#FFFFFF"});
    const [errText3,setErrorText3] = useState({txt:"-",color:"#FFFFFF"});

    useEffect(()=>{
        const {name,mobileno} = props.route.params.data;
        setName(name)
        setPhone(mobileno)
    },[])

    useEffect(()=>{
        if(pin !== "") {
            Axios.post('/users/register',{id:id,name:name,phone:phone,pw:password2,email:mail,pin:pin})
            .then((response)=>{
                if(response.data.result==="success") {
                    Alert.alert("알림","회원가입이 완료되었습니다.",[{text:"확인",onPress:()=>props.navigation.navigate("Login")}])
                } else if(response.data.result==="fail"){
                    Alert.alert("알림",response.data.msg,[{text:"확인"}])
                }
            }).catch((error)=>{
                console.log(error)
            })
        }
    },[pin])

    const doSignUp = ()=>{
        if(doubleChk === false) setErrorText({txt:"* 중복확인을 진행해주세요.",color:"#EE1818"});
        else if(password !== password2) setErrorText2({txt:"* 입력하신 비밀번호가 일치하지 않습니다.",color:"#FF3B3B"});
        else if(mail === "") setErrorText3({txt:"* 이메일을 입력해주세요.",color:"#FF3B3B"});
        else {
            navigation.navigate("PinCode",{
                mode:"init",
                onGoBack:(_value)=>{setPin(_value)}
            });
        }
    }
    const doDoubleCheck = () =>{
        setErrorText({txt:"-",color:"#FFFFFF"});
        if(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(id)) {
            setErrorText({txt:"* 아이디에 한글을 사용할 수 없습니다.",color:"#EE1818"})
        }else if(id === "") {
            setErrorText({txt:"* 아이디를 입력해주세요.",color:"#EE1818"})
        } else {
            Axios.post('/users/doubleCheck',{id:id})
            .then((response)=>{
                if(response.data.result==="success") {
                    setDoubleChk(true)
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
                    <TouchableWithoutFeedback onPress={()=>props.navigation.goBack()}>
                        <Image source={require('../../assets/img/ico_back.png')} style={{resizeMode:"contain", width:10,position:'absolute',left:20}} />
                    </TouchableWithoutFeedback>
                    <ExtraBoldText text="회원가입" customStyle={{color:"#707070"}}/>
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
                            <View style={{flexDirection:"row",alignItems:"center"}}>
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
                                <View style={{flexDirection:"row",alignItems:"center"}}>
                                    <TextInput placeholder="비밀번호를 입력해주세요." secureTextEntry={true} maxLength={16} placeholderTextColor="#D5C2D3" onChangeText={text=>setPassword(text)} style={styles.input} onBlur={()=>{
                                        setErrorText2({txt:"-",color:"#FFFFFF"})
                                        if(!regex.test(password) && password!=="") setErrorText2({txt:"* 8~16자 영문, 숫자, 특수문자를 사용하세요.",color:"#FF3B3B"});
                                    }}/>
                                </View>
                            </View>
                            <View style={styles.inputBox}>
                                <BoldText text={"비밀번호 확인"} customStyle={styles.label}/>
                                <View style={{flexDirection:"row",alignItems:"center"}}>
                                    <TextInput placeholder="비밀번호를 다시 한 번 입력해주세요." secureTextEntry={true} maxLength={16} placeholderTextColor="#D5C2D3" onChangeText={text=>setPassword2(text)} style={styles.input} onBlur={()=>{
                                        setErrorText2({txt:"-",color:"#FFFFFF"})
                                        if(!regex.test(password2) && password2!=="") setErrorText2({txt:"* 8~16자 영문, 숫자, 특수문자를 사용하세요.",color:"#FF3B3B"});
                                        else if(password !== password2) setErrorText2({txt:"* 입력하신 비밀번호가 일치하지 않습니다.",color:"#FF3B3B"});
                                    }}/>
                                </View>
                            </View>
                        </View>
                        <View style={{paddingTop:8,paddingBottom:10,paddingLeft:4}}>
                            <BoldText text={errText2.txt} customStyle={{fontSize:10,color:errText2.color}}/>
                        </View>
                        <View style={{borderRadius:6,borderWidth:1,borderColor:"#E5E5E5"}}>
                            <View style={[styles.inputBox,{borderBottomWidth:1,borderBottomColor:"#ECECEC"}]}>
                                <BoldText text={"이름"} customStyle={styles.label}/>
                                <View style={{flexDirection:"row",alignItems:"center"}}>
                                    <TextInput placeholder="이름을 입력해주세요." editable={false} maxLength={10} placeholderTextColor="#D5C2D3" value={name} onChangeText={text=>setName(text)} style={styles.input}/>
                                </View>
                            </View>
                            <View style={[styles.inputBox,{borderBottomWidth:1,borderBottomColor:"#ECECEC"}]}>
                                <BoldText text={"휴대폰 번호"} customStyle={styles.label}/>
                                <View style={{flexDirection:"row",alignItems:"center"}}>
                                    <TextInput placeholder="휴대폰 번호를 입력해주세요." editable={false} maxLength={13} keyboardType={'numeric'} value={phone} placeholderTextColor="#D5C2D3" onChangeText={(text)=>onChangePhoneText(text)} style={styles.input}/>
                                </View>
                            </View>
                            <View style={styles.inputBox}>
                                <BoldText text={"이메일"} customStyle={styles.label}/>
                                <View style={{flexDirection:"row",alignItems:"center"}}>
                                    <TextInput placeholder="이메일을 입력해주세요." autoCompleteType={'email'} keyboardType={'email-address'} placeholderTextColor="#D5C2D3" onChangeText={text=>setMail(text)} style={styles.input} onBlur={()=>{
                                        if(mail !== "") setErrorText3({txt:"-",color:"#FFFFFF"})
                                    }}/>
                                </View>
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
        height:60,
        borderColor:"#CCCCCC",
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'row',
        zIndex:1
    },
    shadow:{
        elevation:2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2.22,
        backgroundColor:"white"
    },
    label:{
        color:"#707070",
        fontSize:12
    },
    input:{
        color:"#000000",
        textAlign:"right",
        height:20,
        paddingVertical:0
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