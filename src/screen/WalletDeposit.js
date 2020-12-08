import React, {useState,useEffect} from 'react';
import { useDispatch } from 'react-redux';
import { View,StyleSheet,SafeAreaView,TouchableWithoutFeedback,Image, Alert,TouchableOpacity } from 'react-native';
import Clipboard from '@react-native-community/clipboard';
import * as toast from '../components/Toast';
import * as spinner from '../actions/spinner'
import QRCode from 'react-native-qrcode-generator';

import CommonStatusbar from '../components/CommonStatusbar';
import { ExtraBoldText,BoldText } from '../components/customComponents';
import Axios from '../modules/Axios';

const WalletDeposit = ({navigation,route}) =>{
    const dispatch = useDispatch();    
    const [addr,setAddr] = useState("");

    const copyToClipboard = ()=>{
        Clipboard.setString(addr);
        toast.info("주소가 복사 되었습니다.")
    }

    useEffect(()=>{
        const setData = async()=>{
            let url = "";
            const symbol = route.params.symbol;
            if(symbol === "ETH" || symbol === "MVC") url = "/api/henesis/eth/balance";
            else if(symbol === "BTC") url = "/api/henesis/btc/balance";
            else {
                Alert.alert("알림","시스템 오류입니다.",[{
                    text:'확인',
                    onPress:()=>navigation.goBack()
                }]);
            }
            dispatch(spinner.showSpinner());
            const {data} = await Axios.get(url);
            if(data.result === "success") {
                if(symbol === "ETH" || symbol === "MVC" ) {
                    setAddr(data.eth.address);
                } else if(symbol === "BTC") {
                    setAddr(data.btc.address);
                }
            } else {
                Alert.alert("알림",data.msg,[{text:'확인'}]);
            }
            dispatch(spinner.hideSpinner());
        };
        setData();
    },[])
     
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
                        <ExtraBoldText text={`${route.params.symbol} 입금`} customStyle={{fontSize:16}}/>
                    </View>
                    <TouchableOpacity onPress={()=>navigation.navigate("Wallet")}>
                        <View style={styles.headerIcoWrap}>
                            <Image source={require("../../assets/img/ico_close_bl.png")} style={{width:14,height:14}}/>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{paddingTop:60,paddingBottom:40,justifyContent:"center",alignItems:"center"}}>
                    {
                        addr !== "" ?  
                            <QRCode
                                value={addr}
                                size={120}
                                bgColor='black'
                                fgColor='white'/> 
                        : 
                            null
                    }
                    
                </View>
                <View style={{paddingHorizontal:16}}>
                    <View style={{flexDirection:"row",alignItems:"center"}}>
                        <BoldText text={"입금주소"}/>
                        <TouchableWithoutFeedback onPress={copyToClipboard}>
                            <Image source={require("../../assets/img/ico_copy.png")} style={{width:18,height:18,marginLeft:4}}/>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={{marginTop:16,borderRadius:6,backgroundColor:"#F3F3F3",borderWidth:1,borderColor:"#E5E5E5",padding:16}}>
                        <BoldText text={addr} customStyle={{color:"#707070",fontSize:12}}/>
                    </View>
                </View>
            </SafeAreaView>
        </>
    )
}
        
export default WalletDeposit;

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