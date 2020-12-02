import React, {useState,useEffect} from 'react';
import { useSelector } from 'react-redux';
import { View,StyleSheet,SafeAreaView,TouchableWithoutFeedback,Image } from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import * as toast from '../components/Toast';
import QRCode from 'react-native-qrcode-generator';

import CommonStatusbar from '../components/CommonStatusbar';
import { ExtraBoldText,BoldText } from '../components/customComponents';


const WalletDeposit = ({navigation,route}) =>{
    
    const copyToClipboard = ()=>{
        Clipboard.setString("0xe5497a0463a617588210979ae669ab2f757efb0a");
        toast.info("주소가 복사 되었습니다.")
    }
     
    return (
        <>
            <CommonStatusbar backgroundColor="#F9F9F9"/>
            <SafeAreaView style={{backgroundColor:"#FFFFFF",flex:1}}>
                <View style={[styles.header,styles.shadow]}>
                    <TouchableWithoutFeedback onPress={()=>navigation.goBack()}>
                        <Image source={require('../../assets/img/ico_back.png')} style={{resizeMode:"contain", width:10,position:'absolute',left:20}} />
                    </TouchableWithoutFeedback>
                    <ExtraBoldText text="MVC 입금" customStyle={{fontSize:16}}/>
                    <TouchableWithoutFeedback onPress={()=>navigation.navigate("Wallet")}>
                        <Image source={require("../../assets/img/ico_close_bl.png")} style={{width:14,height:14,position:'absolute',right:20}}/>
                    </TouchableWithoutFeedback>
                </View>
                <View style={{paddingTop:60,paddingBottom:40,justifyContent:"center",alignItems:"center"}}>
                    <QRCode
                        value={"0xe5497a0463a617588210979ae669ab2f757efb0a"}
                        size={120}
                        bgColor='black'
                        fgColor='white'/>
                </View>
                <View style={{paddingHorizontal:16}}>
                    <View style={{flexDirection:"row",alignItems:"center"}}>
                        <BoldText text={"입금주소"}/>
                        <TouchableWithoutFeedback onPress={copyToClipboard}>
                            <Image source={require("../../assets/img/ico_copy.png")} style={{width:18,height:18,marginLeft:4}}/>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={{marginTop:16,borderRadius:6,backgroundColor:"#F3F3F3",borderWidth:1,borderColor:"#E5E5E5",padding:16}}>
                        <BoldText text={"0xe5497a0463a617588210979ae669ab2f757efb0a"} customStyle={{color:"#707070",fontSize:12}}/>
                    </View>
                </View>
            </SafeAreaView>
        </>
    )
}
        
export default WalletDeposit;

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
    item:{
        marginTop:26
    },
    boxWrap:{
        marginTop:10,
        borderRadius:6,
        backgroundColor:"#F3F3F3",
        borderColor:"#E5E5E5",
        borderWidth:1,
        paddingVertical:13,
        paddingHorizontal:16
    },
    contentText:{
        color:"#3A3A3A"
    }
});