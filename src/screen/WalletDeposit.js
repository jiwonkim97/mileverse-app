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
    const [infoText,setInfoText] = useState("");
    const [infoText2,setInfoText2] = useState("");

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

        if(route.params.symbol === "BTC") {
            setInfoText("- 위 주소로는 BTC만 입금 가능합니다. 해당 주소로 다른 디지털 자산을 입금 시도할 경우에 발생 할 수 있는 오류/손실은 복구 불가능합니다.");
            setInfoText2("- 0.00000001 BTC 미만부터 잔고에 반영되지 않습니다. 최소 입금금액 미만 입금시에는 잔고 반영 및 입금 취소가 불가능합니다.");
        } else if(route.params.symbol === "ETH") {
            setInfoText("- 위 주소로는 ETH만 입금 가능합니다. 해당 주소로 다른 디지털 자산을 입금 시도할 경우에 발생 할 수 있는 오류/손실은 복구 불가능합니다.");
            setInfoText2("- 0.00000001 ETH 미만부터 잔고에 반영되지 않습니다. 최소 입금금액 미만 입금시에는 잔고 반영 및 입금 취소가 불가능합니다.");
        } else if(route.params.symbol === "MVC") {
            setInfoText("- 위 주소로는 MVC만 입금 가능합니다. 해당 주소로 다른 디지털 자산을 입금 시도할 경우에 발생 할 수 있는 오류/손실은 복구 불가능합니다.");
            setInfoText2("- 0.00000001 MVC 미만은 잔고에 반영되지 않습니다. 최소 입금금액 미만 입금시에는 잔고 반영 및 입금 취소가 불가능합니다.");
        }

        setData();
    },[])
     
    return (
        <>
            <CommonStatusbar backgroundColor="#F9F9F9"/>
            <SafeAreaView style={{backgroundColor:"#FFFFFF",flex:1}}>
                <View style={[styles.header,styles.shadow]}>
                    <TouchableOpacity onPress={()=>navigation.goBack()}>
                        <View style={styles.headerIcoWrap}>
                            <Image source={require('../../assets/img/ico_back.png')} style={{width:21,height:21}} />
                        </View>
                    </TouchableOpacity>
                    <View style={[styles.headerIcoWrap,{flex:1}]}>
                        <ExtraBoldText text={`${route.params.symbol} 입금`} customStyle={{fontSize:16}}/>
                    </View>
                    <TouchableOpacity onPress={()=>navigation.navigate("Wallet")}>
                        <View style={styles.headerIcoWrap}>
                            <Image source={require("../../assets/img/ico_close_bl.png")} style={{width:20,height:20}}/>
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
                    <View style={{marginTop:26}}>
                        <BoldText text={"유의사항"}/>
                        <View style={{marginTop:10}}>
                            <BoldText text={infoText} customStyle={{lineHeight:18}}/>
                            <BoldText text={infoText2} customStyle={{lineHeight:18,marginTop:8}}/>
                        </View>
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