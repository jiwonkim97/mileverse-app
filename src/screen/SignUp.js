import React, {useState,useEffect} from 'react';
import { Text,View,SafeAreaView,TextInput,StyleSheet,ScrollView,Image,TouchableOpacity, Alert } from 'react-native';
import CheckBox from 'react-native-check-box'
import axios from 'axios'
import { useDispatch } from 'react-redux';
import * as toast from '../actions/toast'
import { RegularText, ExtraBoldText,BoldText } from '../components/customComponents';
import CommonStatusbar from '../components/CommonStatusbar';


const SignUpScreen : () => React$Node = (props) =>{
    const dispatch = useDispatch();

    const [check, setCheck] = useState(false)
    const [term, setTerm] = useState("")

    const [id,setId] = useState("")
    const [phone,setPhone] = useState("")
    const [password,setPassword] = useState("")
    const [password2,setPassword2] = useState("")
    const [name,setName] = useState("")
    const [mail,setMail] = useState("")
    const [doubleChk,setDoubleChk] = useState(false)

    useEffect(()=>{
        fetch('http://13.209.142.239:3010/get/terms').then(res=>res.json()).then(data=>setTerm(data.content))
    })
    const errorToast = (msg) =>{
        dispatch(toast.onErrorAlert(msg))
    }
    const showToast = (msg) =>{
        dispatch(toast.onToastAlert(msg))
    }

    const doSignUp = ()=>{
        if(doubleChk === false) errorToast('아이디 중복확인을 해주세요.')
        else if(password !== password2) errorToast("비밀번호를 확인하여 주세요.")
        else if(name === "") errorToast('이름을 확인하여 주세요.')
        else if(phone === "") errorToast('휴대폰 번호를 확인하여 주세요.')
        else if(mail === "") errorToast('이메일을 확인하여 주세요.')
        else if(check === false) errorToast("이용약관에 동의하여 주세요.")
        else {
            axios.post('http://13.209.142.239:3010/users/register',{id:id,name:name,phone:phone,pw:password2,email:mail})
            .then((response)=>{
                if(response.data.result==="success") {
                    Alert.alert("알림","회원가입이 완료되었습니다.",[{text:"확인",onPress:()=>props.navigation.goBack()}])
                } else if(response.data.result==="fail"){
                    alert(response.data.msg)
                }
            }).catch((error)=>{
                console.log(error)
            })
        }
    }
    const doDoubleCheck = () =>{
        axios.post('http://13.209.142.239:3010/users/doubleCheck',{id:id})
        .then((response)=>{
            if(response.data.result==="success") {
                showToast('사용 가능한 아이디입니다.')
                setDoubleChk(true)
            } else {
                errorToast("중복된 아이디가 있습니다.")
                setDoubleChk(false)
            }
        }).catch((error)=>{
            console.log(error)
        })
    }

    const onChangeIDTExt = (_text) =>{
        setId(_text)
        setDoubleChk(false)
    }
    const onChangePhoneText = (_text) =>{
        setPhone(_text.replace(/[^0-9]/g, "").replace(/(^02|^0505|^1[0-9]{3}|^0[0-9]{2})([0-9]+)?([0-9]{4})/, "$1-$2-$3").replace("--", "-"))
    }
    return (
        <>
            <CommonStatusbar backgroundColor="#F9F9F9"/>
            <SafeAreaView style={{height:"100%"}}>
                <View style={styles.header}>
                    <ExtraBoldText text="회원가입" customStyle={{color:"#707070"}}/>
                    <TouchableOpacity onPress={()=>props.navigation.goBack()}style={{position:'absolute',top:-10,left:20}}>
                        <Image source={require('../../assets/img/ico_back.png')} style={{resizeMode:"contain", width:10}}></Image>
                    </TouchableOpacity>
                </View>
                <ScrollView style={{backgroundColor:"white",paddingHorizontal:20}}>
                    <View style={{marginTop:20}}>
                        <BoldText text="아이디" customStyle={styles.inputLabel} />
                        <View style={{flexDirection:"row"}}>
                            <TextInput placeholder="아이디를 입력해주세요." style={[styles.inputForm,{flex:9}]} placeholderTextColor="#8D398185" onChangeText={text => onChangeIDTExt(text)}/>
                            <View style={{flex:4,justifyContent:'center',alignItems:"flex-end",paddingLeft:16}}>
                                <TouchableOpacity style={{width:90}} onPress={doDoubleCheck}>
                                    <View style={{backgroundColor:"#8D3981",justifyContent:"center",alignItems:"center",borderRadius:6,padding:10}}>
                                        <BoldText text="중복확인" customStyle={{color:'white'}}></BoldText>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                    <View style={{marginTop:20}}>
                        <BoldText text="비밀번호" customStyle={styles.inputLabel} />
                        <TextInput secureTextEntry={true} placeholder="비밀번호를 입력해주세요." style={styles.inputForm} placeholderTextColor="#8D398185" onChangeText={text=>setPassword(text)}/>
                    </View>
                    <View style={{marginTop:20}}>
                        <BoldText text="비밀번호 확인" customStyle={styles.inputLabel} />
                        <TextInput secureTextEntry={true} placeholder="비밀번호를 다시 한 번 입력해주세요." style={styles.inputForm} placeholderTextColor="#8D398185" onChangeText={text=>setPassword2(text)}/>
                    </View>
                    <View style={{marginTop:20}}>
                        <BoldText text="이름" customStyle={styles.inputLabel} />
                        <TextInput placeholder="이름을 입력해주세요." style={styles.inputForm} placeholderTextColor="#8D398185" onChangeText={text=>setName(text)}/>
                    </View>
                    <View style={{marginTop:20}}>
                        <BoldText text="휴대폰 번호" customStyle={styles.inputLabel} />
                        <TextInput placeholder="휴대폰 번호를 입력해주세요." style={styles.inputForm} placeholderTextColor="#8D398185" keyboardType={'numeric'} value={phone} onChangeText={(text)=>onChangePhoneText(text)}/>
                    </View>
                    <View style={{marginTop:20}}>
                        <BoldText text="이메일" customStyle={styles.inputLabel} />
                        <TextInput placeholder="이메일을 입력해주세요." style={styles.inputForm} placeholderTextColor="#8D398185" onChangeText={text=>setMail(text)}/>
                    </View>
                    <View style={{marginTop:20}}>
                        <BoldText text="이용약관" customStyle={styles.inputLabel} />
                        <View style={{borderColor:"#CCCCCC",marginTop:10,height:120,borderRadius:6,borderWidth:1,padding:10}}>
                            <ScrollView nestedScrollEnabled = {true}>
                                <RegularText text={term} customStyle={{fontSize:9}} />
                            </ScrollView>
                        </View>
                        <View style={{flexDirection:'row',alignItems:"center"}}>
                            <CheckBox
                                isChecked={check}
                                checkedCheckBoxColor={'#8D3981'}
                                uncheckedCheckBoxColor={"#999999"}
                                style={{marginRight:4}}
                                onClick={() => check ? setCheck(false) : setCheck(true)}
                            />
                            <RegularText text="약관에 동의합니다." customStyle={{color:"#2D2D2D",fontSize:12}} />
                        </View>
                    </View>
                    <TouchableOpacity onPress={doSignUp}>
                        <View style={{flex:1,height:40,backgroundColor:"#8D3981",justifyContent:"center",alignItems:"center",borderRadius:4,marginTop:20,marginBottom:20}}>
                            <BoldText text="회원가입 완료" customStyle={{color:"white"}} />
                        </View>    
                    </TouchableOpacity>
                </ScrollView>            
            </SafeAreaView>
        </>
        
    )
}
        
export default SignUpScreen;

const styles = StyleSheet.create({
    header:{
        backgroundColor:"white",
        height:60,
        borderColor:"#CCCCCC",
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'row',
        elevation:2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2.22,
        zIndex:1
    },
    inputLabel:{
        color:"#2D2D2D"
    },
    inputForm:{
        height:40,
        borderBottomWidth:1,
        borderColor:"#CCCCCC",
        backgroundColor:"rgba(255,255,255,0.3)",
        color:"#555",
        paddingLeft:7,
        
    },
    btnText:{
        flex:1,
        height:40,
        borderRadius:10,
        justifyContent:"center",
        alignItems:"center"
    }
});


