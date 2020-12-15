import React, { useState,useEffect } from 'react';
import {Image,View,StyleSheet,TouchableWithoutFeedback} from 'react-native';
import CommonStatusbar from '../components/CommonStatusbar';
import { BoldText } from '../components/customComponents';
import QRCodeScanner from 'react-native-qrcode-scanner';

export default ({navigation,route})=>{
    const onSuccess = (e)=>{
        route.params.onGoBack(e.data);
        navigation.goBack();
    }
    return(
        <>
            <CommonStatusbar backgroundColor="#F9F9F9"/>
            <QRCodeScanner
            showMarker={true}
            onRead={onSuccess}
            topContent={
                <TouchableWithoutFeedback onPress={()=>navigation.goBack()}>
                    <View style={{backgroundColor:"#FFFFFF",width:"100%",height:"100%",alignItems:"flex-end",paddingTop:20,paddingRight:20}}>
                        <Image source={require("../../assets/img/ico_close_bl.png")} style={{width:20,height:20}}/>
                    </View>
                </TouchableWithoutFeedback>
            }
            bottomContent={
                <View style={{backgroundColor:"#FFFFFF",justifyContent:"center",alignItems:"center",width:"100%",height:"100%"}}>
                    <BoldText text={"QR코드를 스캔해주세요."} customStyle={{fontSize:20}}/>
                </View>
            }
            />
        </>
    )
}
const styles = StyleSheet.create({

})