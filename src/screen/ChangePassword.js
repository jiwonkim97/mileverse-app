import React, {useState} from 'react';
import { useDispatch } from 'react-redux';
import { View,StyleSheet,SafeAreaView,TouchableWithoutFeedback,Image,TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import CommonStatusbar from '../components/CommonStatusbar';
import { ExtraBoldText,BoldText } from '../components/customComponents';
import Axios from '../modules/Axios';
import * as dialog from '../actions/dialog';
import { useTranslation } from 'react-i18next';

const Profile = (props) =>{
    const dispatch = useDispatch();
    const { t } = useTranslation();
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
            setNewErrorTxt(t('alert_pw_1'));
            setNewError("#FF3B3B");
        } else if(newPassword !== newConfirmPassword) {
            setNewErrorTxt(t('alert_pw_1'));
            setNewError("#FF3B3B");
        } else if(!regex.test(newPassword)) {
            setNewErrorTxt(t('alert_pw_2'));
            setNewError("#FF3B3B");
        } else {
            Axios.put("/users/passwords",{password:password,newPassword:newPassword}).then(({data})=>{
                if(data.result === "success") {
                    if(data.code === "S1") {
                        dispatch(dialog.openDialog("alert",(
                            <>
                                <BoldText text={t("alert_find_8")} customStyle={{textAlign:"center",lineHeight:20}}/>
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
                            <BoldText text={t("alert_common_1")} customStyle={{textAlign:"center",lineHeight:20}}/>
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
                    <TouchableOpacity onPress={()=>props.navigation.goBack()}>
                        <View style={styles.headerIcoWrap}>
                            <Image source={require('../../assets/img/ico_back.png')} style={{width:21,height:21}} />
                        </View>
                    </TouchableOpacity>
                    <View style={[styles.headerIcoWrap,{flex:1}]}>
                        <ExtraBoldText text={t('menu_info_4')} customStyle={{fontSize:16}}/>
                    </View>
                    <TouchableOpacity onPress={()=>props.navigation.navigate("Home")}>
                        <View style={styles.headerIcoWrap}>
                            <Image source={require("../../assets/img/ico_close_bl.png")} style={{width:20,height:20}}/>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{padding:16}}>
                    <View style={{borderRadius:6,borderColor:"#E5E5E5",borderWidth:1,padding:16,flexDirection:'row',justifyContent:"space-between",alignItems:"center"}}>
                        <BoldText text={t('menu_info_7')} customStyle={styles.itemLabel}/>
                        <TextInput placeholder={t('menu_info_8')} onChangeText={text=>setPassword(text)}
                            secureTextEntry={true} maxLength={16} placeholderTextColor="#D5C2D3" style={styles.input}/>
                    </View>
                    <View style={{paddingLeft:16,paddingTop:8}}>
                        <BoldText text={t('alert_pw_1')} customStyle={{color:currentError,fontSize:10}}/>
                    </View>
                    <View style={{marginTop:10,borderRadius:6,borderColor:"#E5E5E5",borderWidth:1}}>
                        <View style={{borderBottomColor:"#E5E5E5",borderBottomWidth:1,padding:16,flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
                            <BoldText text={t('menu_info_9')} customStyle={styles.itemLabel}/>
                            <TextInput placeholder={t('menu_info_8')} onChangeText={text=>setNewPassword(text)}
                                secureTextEntry={true} maxLength={16} placeholderTextColor="#D5C2D3" style={styles.input}/>
                        </View>
                        <View style={{padding:16,flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
                            <BoldText text={t("menu_info_10")} customStyle={styles.itemLabel}/>
                            <TextInput placeholder={t('menu_info_8')} onChangeText={text=>setNewConfirmPassword(text)}
                                secureTextEntry={true} maxLength={16} placeholderTextColor="#D5C2D3" style={styles.input}/>
                        </View>
                    </View>
                    <View style={{paddingLeft:16,paddingTop:8}}>
                        <BoldText text={newErrorTxt} customStyle={{color:newError,fontSize:10}}/>
                    </View>
                    <TouchableWithoutFeedback onPress={onChangePassword}>
                        <View style={{marginTop:10,borderRadius:6,justifyContent:"center",alignItems:"center",height:44,backgroundColor:"#8D3981"}}>
                            <BoldText text={t('common_confirm_1')} customStyle={{color:"#FFFFFF",fontSize:14}}/>
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
    input:{
        textAlign:"right",
        height:20,
        paddingVertical:0,
        fontFamily:"NotoSans-Regular",
        fontSize:13
    },
    itemLabel:{
        color:"#707070",
        fontSize:13
    }
});