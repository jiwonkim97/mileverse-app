import React, {useState,useEffect,useRef} from 'react';
import { useDispatch } from 'react-redux';
import { View,StyleSheet,SafeAreaView,TouchableWithoutFeedback,Image,TextInput, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import CommonStatusbar from '../components/CommonStatusbar';
import { ExtraBoldText,BoldText } from '../components/customComponents';
import Axios from '../modules/Axios';
import * as dialog from '../actions/dialog';
import * as actions from '../actions/authentication'

const WithDraw = (props) =>{
    const dispatch = useDispatch();
    const [password,setPassword] = useState("");
    const onWithDraw = ()=>{
        Keyboard.dismiss();
        Axios.delete("/users/profile",{data:{password:password}}).then(({data})=>{
            if(data.result === "success") {
                dispatch(dialog.openDialog("alert",(
                    <>
                        <BoldText text={data.msg} customStyle={{textAlign:"center",lineHeight:20}}/>
                    </>
                ),()=>{
                    dispatch(actions.logoutRequest()).then(rst=>{
                        if(rst === 'INIT') {
                            AsyncStorage.multiRemove(["@loginStorage","@configStorage"])
                            dispatch(dialog.closeDialog());
                            props.navigation.navigate("Home");
                        }
                    });
                }));
            } else {
                dispatch(dialog.openDialog("alert",(
                    <>
                        <BoldText text={data.msg} customStyle={{textAlign:"center",lineHeight:20}}/>
                    </>
                )));
            }
        });
    };

    return (
        <>
            <CommonStatusbar backgroundColor="#F9F9F9"/>
            <SafeAreaView style={{backgroundColor:"#FFFFFF",flex:1}}>
                <View style={[styles.header,styles.shadow]}>
                    <TouchableWithoutFeedback onPress={()=>props.navigation.goBack()}>
                        <Image source={require('../../assets/img/ico_back.png')} style={{resizeMode:"contain", width:10,position:'absolute',left:20}} />
                    </TouchableWithoutFeedback>
                    <ExtraBoldText text="회원탈퇴" customStyle={{fontSize:16}}/>
                </View>
                <View style={{padding:16}}>
                    <View style={{borderRadius:6,borderColor:"#E5E5E5",borderWidth:1,padding:16,flexDirection:'row',justifyContent:"space-between",alignItems:"center"}}>
                        <TextInput placeholder={"비밀번호를 입력해주세요."} onChangeText={text=>setPassword(text)}
                            secureTextEntry={true} maxLength={16} placeholderTextColor="#9E9E9E" style={styles.input}/>
                    </View>
                    <TouchableWithoutFeedback onPress={onWithDraw}>
                        <View style={{backgroundColor:"#8D3981",borderRadius:6,justifyContent:"center",alignItems:"center",height:44,marginTop:16}}>
                            <BoldText text={"탈퇴"} customStyle={{color:'white',fontSize:14}}/>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </SafeAreaView>
        </>
    )
}
        
export default WithDraw;

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
        height:20,
        paddingVertical:0,
        flex:1,
        fontFamily:"NanumSquareB"
    }
});