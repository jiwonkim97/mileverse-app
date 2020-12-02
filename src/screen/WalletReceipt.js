import React, {useState,useEffect} from 'react';
import { useSelector } from 'react-redux';
import { View,StyleSheet,SafeAreaView,TouchableWithoutFeedback,Image,Platform,ScrollView } from 'react-native';

import CommonStatusbar from '../components/CommonStatusbar';
import { ExtraBoldText,BoldText,RegularText } from '../components/customComponents';
import AsyncStorage from '@react-native-community/async-storage';
import Axios from '../modules/Axios';
import Modal from 'react-native-modal';


const WalletReceipt = ({navigation,route}) =>{
    return (
        <>
            <CommonStatusbar backgroundColor="#F9F9F9"/>
            <SafeAreaView style={{backgroundColor:"#FFFFFF",flex:1}}>
                <View style={[styles.header,styles.shadow]}>
                    <TouchableWithoutFeedback onPress={()=>navigation.goBack()}>
                        <Image source={require('../../assets/img/ico_back.png')} style={{resizeMode:"contain", width:10,position:'absolute',left:20}} />
                    </TouchableWithoutFeedback>
                    <ExtraBoldText text="상세 거래내역" customStyle={{fontSize:16}}/>
                    <TouchableWithoutFeedback onPress={()=>navigation.navigate("Wallet")}>
                        <Image source={require("../../assets/img/ico_close_bl.png")} style={{width:14,height:14,position:'absolute',right:20}}/>
                    </TouchableWithoutFeedback>
                </View>
                <View style={{paddingHorizontal:16}}>
                    <View style={styles.item}>
                        <BoldText text={"거래시간"}/>
                        <View style={styles.boxWrap}>
                            <BoldText text={"2020.11.25 12:00:00"} customStyle={styles.contentText}/>
                        </View>
                    </View>
                    <View style={styles.item}>
                        <BoldText text={"거래수량"}/>
                        <View style={styles.boxWrap}>
                            <BoldText text={"- 10,000 MVC"} customStyle={styles.contentText}/>
                        </View>
                    </View>
                    <View style={styles.item}>
                        <BoldText text={"전송 수수료"}/>
                        <View style={styles.boxWrap}>
                            <BoldText text={"0.0001 ETH"} customStyle={styles.contentText}/>
                        </View>
                    </View>
                    <View style={styles.item}>
                        <BoldText text={"보낸 사람"}/>
                        <View style={styles.boxWrap}>
                            <BoldText text={"0x123123123123908123809132089132089"} customStyle={styles.contentText}/>
                        </View>
                    </View>
                    <View style={styles.item}>
                        <BoldText text={"받는 사람"}/>
                        <View style={styles.boxWrap}>
                            <BoldText text={"0x123123123123908123809132089132089"} customStyle={styles.contentText}/>
                        </View>
                    </View>
                    <View style={styles.item}>
                        <BoldText text={"거래 ID(TX Hash)"}/>
                        <View style={styles.boxWrap}>
                            <BoldText text={"0x12330u91290u132u90231u9031290u13209u13209u31290u132"} customStyle={styles.contentText,{lineHeight:18}}/>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </>
    )
}
        
export default WalletReceipt;

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