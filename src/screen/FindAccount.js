import React,{useState} from 'react';
import {StyleSheet,Image,View,TouchableWithoutFeedback,SafeAreaView,TouchableOpacity} from 'react-native'
import { BoldText,ExtraBoldText } from '../components/customComponents';
import CommonStatusbar from '../components/CommonStatusbar';
import FindIdWrap from '../components/FindAccount/FindIdWrap';
import FindPwWrap from '../components/FindAccount/FindPwWrap';
import FindIdWrapEn from '../components/FindAccount/en/FindIdWrapEn';
import FindPwWrapEn from '../components/FindAccount/en/FindPwWrapEn';

import { useTranslation } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

const FindAccount = (props)=>{
    const [form,setForm] = useState("ID");
    const { t } = useTranslation();
    const [idBox,setIdBox] = useState({textColor:"#2B2B2B",bgColor:"#FFFFFF",borderColor:"#F6F6F6"});
    const [pwBox,setPwBox] = useState({textColor:"#A7A7A7",bgColor:"#E5E5E5",borderColor:"#E5E5E5"});
    
    const onFormChange = (form)=>{
        if(form === "ID") {
            setIdBox({textColor:"#2B2B2B",bgColor:"#FFFFFF",borderColor:"#F6F6F6"});
            setPwBox({textColor:"#A7A7A7",bgColor:"#E5E5E5",borderColor:"#E5E5E5"});
        } else {
            setIdBox({textColor:"#A7A7A7",bgColor:"#E5E5E5",borderColor:"#E5E5E5"});
            setPwBox({textColor:"#2B2B2B",bgColor:"#FFFFFF",borderColor:"#F6F6F6"});
        }
        setForm(form)
    };

    return (
        <>
            <CommonStatusbar backgroundColor="#F9F9F9"/>
            <SafeAreaView style={{flex:1,backgroundColor:"#FFFFFF"}}>
                <View style={[styles.header,styles.shadow]}>
                    <TouchableOpacity onPress={()=>props.navigation.goBack()}>
                        <View style={styles.headerIcoWrap}>
                            <Image source={require('../../assets/img/ico_back.png')} style={{width:21,height:21}} />
                        </View>
                    </TouchableOpacity>
                    <View style={[styles.headerIcoWrap,{flex:1}]}>
                        <ExtraBoldText text={t("login_find_1")} customStyle={{fontSize:16}}/>
                    </View>
                    <View style={{width:50}}>
                    </View>
                </View>
                <View style={{padding:16,flex:1}}>
                    <View style={{flexDirection:"row"}}>
                        <TouchableWithoutFeedback onPress={()=>{onFormChange("ID")}}>
                            <View style={[styles.boxWrap,{backgroundColor:idBox.bgColor,borderColor:idBox.borderColor}]}>
                                <BoldText text={t("login_find_2")} customStyle={{color:idBox.textColor,fontSize:13}}/>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={()=>{onFormChange("PW")}}>
                            <View style={[styles.boxWrap,{backgroundColor:pwBox.bgColor,borderColor:pwBox.borderColor}]}>
                                <BoldText text={t("login_find_7")} customStyle={{color:pwBox.textColor,fontSize:13}}/>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    {
                        RNLocalize.getLocales()[0].languageCode === "ko" ? 
                            form === "ID" ? <FindIdWrap navigation={props.navigation}/> : <FindPwWrap navigation={props.navigation}/>
                            :
                            form === "ID" ? <FindIdWrapEn navigation={props.navigation}/> : <FindPwWrapEn navigation={props.navigation}/>
                    }
                </View>
            </SafeAreaView>
        </>
    )
}
const styles = StyleSheet.create({
    header:{
        height:50,
        borderColor:"#CCCCCC",
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'row',
        zIndex:1
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
    headerIcoWrap:{
        width:50,
        height:50,
        justifyContent:'center',
        alignItems:'center'
    },
    boxWrap:{
        justifyContent:"center",
        alignItems:"center",
        flex:1,
        paddingVertical:16,
        borderWidth:1
    }
});

export default FindAccount;