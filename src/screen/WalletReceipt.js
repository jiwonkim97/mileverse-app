import React, {useState,useEffect} from 'react';
import { View,StyleSheet,SafeAreaView,TouchableOpacity,Image,Linking } from 'react-native';

import CommonStatusbar from '../components/CommonStatusbar';
import { ExtraBoldText,BoldText } from '../components/customComponents';
import Axios from '../modules/Axios';


const WalletReceipt = ({navigation,route}) =>{
    const [gas,setGas] = useState(0);
    useEffect(()=>{
        const getGasFee = async()=>{
            if(route.params.symbol === "ETH") {
                if(route.params.transactionId !== undefined) {
                    const {data} = await Axios.get('/api/henesis/eth/tx/gas',{params:{txId:route.params.transactionId}});
                    if(data.result === "success") {
                        setGas(parseFloat(data.gas))
                    }
                 }
            }
        }
        if(route.params.hash === null) {
            setGas("수수료 면제")
        } else {
            getGasFee()
        }
    },[])
    const openWebBrowser = async()=>{
        if (route.params.symbol === "BTC") {
            await Linking.openURL(`https://blockstream.info/testnet/tx/${route.params.hash}`);
        } else if(route.params.symbol === "ETH") {
            await Linking.openURL(`https://ropsten.etherscan.io/tx/${route.params.hash}`);
        }
    }
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
                        <ExtraBoldText text={"상세 거래내역"} customStyle={{fontSize:16}}/>
                    </View>
                    <TouchableOpacity onPress={()=>navigation.navigate("Wallet")}>
                        <View style={styles.headerIcoWrap}>
                            <Image source={require("../../assets/img/ico_close_bl.png")} style={{width:14,height:14}}/>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{paddingHorizontal:16}}>
                    <View style={styles.item}>
                        <BoldText text={"거래시간"}/>
                        <View style={styles.boxWrap}>
                            <BoldText text={route.params.trTime} customStyle={styles.contentText}/>
                        </View>
                    </View>
                    <View style={styles.item}>
                        <BoldText text={"거래수량"}/>
                        <View style={styles.boxWrap}>
                            <BoldText text={`${route.params.amount} ${route.params.symbol}`} customStyle={styles.contentText}/>
                        </View>
                    </View>
                    {
                        gas !== 0 ? 
                            <View style={styles.item}>
                                <BoldText text={"전송 수수료"}/>
                                <View style={styles.boxWrap}>
                                    <BoldText text={`${gas} ETH`} customStyle={styles.contentText}/>
                                </View>
                            </View>
                        :
                            null    
                    }
                    
                    <View style={styles.item}>
                        <BoldText text={"보낸 사람"}/>
                        <View style={styles.boxWrap}>
                            <BoldText text={route.params.fromAddr===null?"외부지갑":route.params.fromAddr} customStyle={styles.contentText}/>
                        </View>
                    </View>
                    <View style={styles.item}>
                        <BoldText text={"받는 사람"}/>
                        <View style={styles.boxWrap}>
                            <BoldText text={route.params.toAddr} customStyle={styles.contentText}/>
                        </View>
                    </View>
                    <View style={styles.item}>
                        <BoldText text={"거래 ID(TX Hash)"}/>
                        <View style={styles.boxWrap}>
                            <TouchableOpacity onPress={openWebBrowser}>
                                <BoldText text={route.params.hash} customStyle={styles.contentText,{lineHeight:18,textDecorationLine: "underline",color:"blue"}}/>
                            </TouchableOpacity>
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