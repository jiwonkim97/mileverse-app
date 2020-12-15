import React, {useState} from 'react';
import { useDispatch } from 'react-redux';
import { View,StyleSheet,SafeAreaView,TouchableWithoutFeedback,Image,TextInput, Keyboard,TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import CommonStatusbar from '../components/CommonStatusbar';
import { ExtraBoldText,BoldText } from '../components/customComponents';
import Axios from '../modules/Axios';
import * as dialog from '../actions/dialog';
import * as actions from '../actions/authentication'

const WithDraw = ({navigation,route}) =>{
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
                            navigation.navigate("Home");
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
                    <TouchableOpacity onPress={()=>navigation.goBack()}>
                        <View style={styles.headerIcoWrap}>
                            <Image source={require('../../assets/img/ico_back.png')} style={{width:8,height:16}} />
                        </View>
                    </TouchableOpacity>
                    <View style={[styles.headerIcoWrap,{flex:1}]}>
                        <ExtraBoldText text="회원탈퇴" customStyle={{fontSize:16}}/>
                    </View>
                    <TouchableOpacity onPress={()=>navigation.navigate("Home")}>
                        <View style={styles.headerIcoWrap}>
                            <Image source={require("../../assets/img/ico_close_bl.png")} style={{width:20,height:20}}/>
                        </View>
                    </TouchableOpacity>
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
        backgroundColor:"white",
        height:50,
        alignItems:'center',
        flexDirection:"row",
        justifyContent:"space-between"
    },
    headerIcoWrap:{
        width:50,
        height:50,
        justifyContent:'center',
        alignItems:'center'
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
        fontFamily:"NotoSans-Regular"
    }
});