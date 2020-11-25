import React, {useState} from 'react';
import { useDispatch } from 'react-redux';
import { View,StyleSheet,SafeAreaView,TouchableWithoutFeedback,Image,TextInput, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import CommonStatusbar from '../components/CommonStatusbar';
import { ExtraBoldText,BoldText } from '../components/customComponents';
import Axios from '../modules/Axios';
import * as dialog from '../actions/dialog';

const Profile = (props) =>{
    const dispatch = useDispatch();
    const [password,setPassword] = useState("");
    const [newPassword,setNewPassword] = useState("");
    const [newConfirmPassword,setNewConfirmPassword] = useState("");
    const [currentError,setCurrentError] = useState("#FFFFFF");
    const [newError,setNewError] = useState("#FFFFFF");
    const [newErrorTxt,setNewErrorTxt] = useState("");

    const onChangePassword = ()=>{
        const regex = /^.*(?=^.{8,16}$)(?=.*\d)(?=.*[a-zA-Z])(?=.*[!@#$%^&+=]).*$/;
        setCurrentError("#FFFFFF");
        setNewError("#FFFFFF");
        if(password===""){
            setCurrentError("#FF3B3B");
        } else if(newPassword==="" || newConfirmPassword==="") {
            setNewErrorTxt("* 비밀번호가 일치하지 않습니다.");
            setNewError("#FF3B3B");
        } else if(newPassword !== newConfirmPassword) {
            setNewErrorTxt("* 비밀번호가 일치하지 않습니다.");
            setNewError("#FF3B3B");
        } else if(!regex.test(newPassword)) {
            setNewErrorTxt("* 8~16자 영문, 숫자, 특수문자를 사용하세요.");
            setNewError("#FF3B3B");
        } else {
            Keyboard.dismiss();
            Axios.put("/users/passwords",{password:password,newPassword:newPassword}).then(({data})=>{
                if(data.result === "success") {
                    if(data.code === "S1") {
                        dispatch(dialog.openDialog("alert",(
                            <>
                                <BoldText text={data.msg} customStyle={{textAlign:"center",lineHeight:20}}/>
                            </>
                        ),()=>{
                            AsyncStorage.mergeItem("@loginStorage",JSON.stringify({password:newPassword}));
                            dispatch(dialog.closeDialog());
                            props.navigation.goBack();
                        }));
                    } else if(data.code === "E1") {
                        setCurrentError("#FF3B3B");
                    }
                } else {
                    dispatch(dialog.openDialog("alert",(
                        <>
                            <BoldText text={data.msg} customStyle={{textAlign:"center",lineHeight:20}}/>
                        </>
                    )));
                }
            })
        }
    }

    return (
        <>
            <CommonStatusbar backgroundColor="#F9F9F9"/>
            <SafeAreaView style={{backgroundColor:"#FFFFFF",flex:1}}>
                <View style={[styles.header,styles.shadow]}>
                    <TouchableWithoutFeedback onPress={()=>props.navigation.goBack()}>
                        <Image source={require('../../assets/img/ico_back.png')} style={{resizeMode:"contain", width:10,position:'absolute',left:20}} />
                    </TouchableWithoutFeedback>
                    <ExtraBoldText text="비밀번호 변경 " customStyle={{color:"#707070"}}/>
                </View>
                <View style={{padding:16}}>
                    <View style={{borderRadius:6,borderColor:"#E5E5E5",borderWidth:1,padding:16,flexDirection:'row',justifyContent:"space-between",alignItems:"center"}}>
                        <BoldText text={"현재 비밀번호"} customStyle={styles.itemLabel}/>
                        <TextInput placeholder={"비밀번호를 입력해주세요."} onChangeText={text=>setPassword(text)}
                            secureTextEntry={true} maxLength={16} placeholderTextColor="#D5C2D3" style={styles.input}/>
                    </View>
                    <View style={{paddingLeft:16,paddingTop:8}}>
                        <BoldText text={"* 비밀번호가 일치하지 않습니다."} customStyle={{color:currentError,fontSize:10}}/>
                    </View>
                    <View style={{marginTop:10,borderRadius:6,borderColor:"#E5E5E5",borderWidth:1}}>
                        <View style={{borderBottomColor:"#E5E5E5",borderBottomWidth:1,padding:16,flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
                            <BoldText text={"새로운 비밀번호 확인"} customStyle={styles.itemLabel}/>
                            <TextInput placeholder={"비밀번호를 입력해주세요."} onChangeText={text=>setNewPassword(text)}
                                secureTextEntry={true} maxLength={16} placeholderTextColor="#D5C2D3" style={styles.input}/>
                        </View>
                        <View style={{padding:16,flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
                            <BoldText text={"비밀번호 확인"} customStyle={styles.itemLabel}/>
                            <TextInput placeholder={"비밀번호를 입력해주세요."} onChangeText={text=>setNewConfirmPassword(text)}
                                secureTextEntry={true} maxLength={16} placeholderTextColor="#D5C2D3" style={styles.input}/>
                        </View>
                    </View>
                    <View style={{paddingLeft:16,paddingTop:8}}>
                        <BoldText text={newErrorTxt} customStyle={{color:newError,fontSize:10}}/>
                    </View>
                    <TouchableWithoutFeedback onPress={onChangePassword}>
                        <View style={{marginTop:10,borderRadius:6,justifyContent:"center",alignItems:"center",height:44,backgroundColor:"#8D3981"}}>
                            <BoldText text={"확인"} customStyle={{color:"#FFFFFF",fontSize:14}}/>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </SafeAreaView>
        </>
    )
}
        
export default Profile;

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
    input:{
        textAlign:"right",
        height:20,
        paddingVertical:0,
        fontFamily:"NanumSquareB",
        fontSize:13
    },
    itemLabel:{
        color:"#707070",
        fontSize:13
    }
});