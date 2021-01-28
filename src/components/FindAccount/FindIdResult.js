import React from 'react';
import {View,TouchableWithoutFeedback} from 'react-native';
import { BoldText, ExtraBoldText } from '../customComponents';
import { useTranslation } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

export default (props)=>{
    const { t } = useTranslation();

    return (
        <View style={{flex:1,justifyContent:"space-between"}}>
            <View style={{width:"100%",justifyContent:"center",alignItems:"center",flex:1,paddingBottom:10}}>
                {
                    RNLocalize.getLocales()[0].languageCode === "ko" ? 
                        <>
                            <ExtraBoldText text={t("alert_find_7")} customStyle={{fontSize:18,color:"#5D5D5D"}}/>
                            <View style={{flexDirection:"row",marginTop:10}}>
                                <ExtraBoldText text={props.userId} customStyle={{fontSize:20,color:"#2B2B2B"}}/>
                                <ExtraBoldText text={"입니다."} customStyle={{fontSize:18,color:"#5D5D5D",marginLeft:10}}/>
                            </View>
                        </>
                    :
                        <>
                            <ExtraBoldText text={t("alert_find_7")} customStyle={{fontSize:18,color:"#5D5D5D"}}/>
                            <ExtraBoldText text={props.userId} customStyle={{fontSize:20,color:"#2B2B2B"}}/>
                        </>

                }
                
            </View>
            <TouchableWithoutFeedback onPress={()=>props.navigation.navigate("Login")}>
                <View style={{backgroundColor:"#8D3981",height:46,borderRadius:6,justifyContent:"center",alignItems:"center"}}>
                    <BoldText text={t("login_1")} customStyle={{color:"#FFFFFF",fontSize:13}}/>
                </View>
            </TouchableWithoutFeedback>
        </View>
    )
}