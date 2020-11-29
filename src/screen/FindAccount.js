import React,{useState} from 'react';
import {StyleSheet,Image,View,TouchableWithoutFeedback,SafeAreaView} from 'react-native'
import { BoldText,ExtraBoldText } from '../components/customComponents';
import CommonStatusbar from '../components/CommonStatusbar';
import FindIdWrap from '../components/FindAccount/FindIdWrap';
import FindPwWrap from '../components/FindAccount/FindPwWrap';


const FindAccount = (props)=>{
    const [form,setForm] = useState("ID");
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
                    <TouchableWithoutFeedback onPress={()=>props.navigation.goBack()}>
                        <Image source={require('../../assets/img/ico_back.png')} style={{resizeMode:"contain", width:10,position:'absolute',left:20}} />
                    </TouchableWithoutFeedback>
                    <ExtraBoldText text="아이디/비밀번호 찾기" customStyle={{color:"#2B2B2B",fontSize:16}}/>
                </View>
                <View style={{padding:16,flex:1}}>
                    <View style={{flexDirection:"row"}}>
                        <TouchableWithoutFeedback onPress={()=>{onFormChange("ID")}}>
                            <View style={[styles.boxWrap,{backgroundColor:idBox.bgColor,borderColor:idBox.borderColor}]}>
                                <BoldText text={"아이디 찾기"} customStyle={{color:idBox.textColor,fontSize:13}}/>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={()=>{onFormChange("PW")}}>
                            <View style={[styles.boxWrap,{backgroundColor:pwBox.bgColor,borderColor:pwBox.borderColor}]}>
                                <BoldText text={"비밀번호 찾기"} customStyle={{color:pwBox.textColor,fontSize:13}}/>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    {
                        form === "ID" ? <FindIdWrap navigation={props.navigation}/> : <FindPwWrap navigation={props.navigation}/>
                    }    
                </View>
            </SafeAreaView>
        </>
    )
}
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
    boxWrap:{
        justifyContent:"center",
        alignItems:"center",
        flex:1,
        paddingVertical:16,
        borderWidth:1
    }
});

export default FindAccount;