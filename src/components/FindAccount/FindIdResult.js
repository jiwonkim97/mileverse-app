import React from 'react';
import {View,TouchableWithoutFeedback} from 'react-native';
import { BoldText, ExtraBoldText } from '../customComponents';

export default (props)=>{
    return (
        <View style={{flex:1,justifyContent:"space-between"}}>
            <View style={{width:"100%",justifyContent:"center",alignItems:"center",flex:1,paddingBottom:10}}>
                <ExtraBoldText text={"고객님의 아이디는"} customStyle={{fontSize:18,color:"#5D5D5D"}}/>
                <View style={{flexDirection:"row",marginTop:10}}>
                    <ExtraBoldText text={props.userId} customStyle={{fontSize:20,color:"#2B2B2B"}}/>
                    <ExtraBoldText text={"입니다."} customStyle={{fontSize:18,color:"#5D5D5D",marginLeft:10}}/>
                </View>
            </View>
            <TouchableWithoutFeedback onPress={()=>props.navigation.navigate("Login")}>
                <View style={{backgroundColor:"#8D3981",height:46,borderRadius:6,justifyContent:"center",alignItems:"center"}}>
                    <BoldText text={"로그인"} customStyle={{color:"#FFFFFF",fontSize:13}}/>
                </View>
            </TouchableWithoutFeedback>
        </View>
    )
}