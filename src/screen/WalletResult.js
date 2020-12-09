import React,{useEffect} from 'react';
import { View,StyleSheet,SafeAreaView,TouchableWithoutFeedback,Image,TouchableOpacity,BackHandler } from 'react-native';

import CommonStatusbar from '../components/CommonStatusbar';
import { ExtraBoldText,BoldText } from '../components/customComponents';


const WalletResult = ({navigation,route}) =>{
    useEffect(()=>{
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            ()=>{
                return true;
            });
            return ()=> backHandler.remove();
    },[]);

    const navigateWallet = ()=>{
        if(route.params.symbol === "MVC") {
            navigation.navigate("WalletDetail",{header:"Mileverse",symbol:"MVC"})
        } else if(route.params.symbol === "ETH") {
            navigation.navigate("WalletDetail",{header:"Ethereum",symbol:"ETH"})
        } else if(route.params.symbol === "BTC") {
            navigation.navigate("WalletDetailOnBtc",{header:"Bitcoin",symbol:"BTC"})
        }
    }

    return (
        <>
            <CommonStatusbar backgroundColor="#F9F9F9"/>
            <SafeAreaView style={{backgroundColor:"#FFFFFF",flex:1}}>
                <View style={[styles.header,styles.shadow]}>
                    <View style={{width:50}}>
                    </View>
                    <View style={[styles.headerIcoWrap,{flex:1}]}>
                        <ExtraBoldText text={`${route.params.symbol} 출금`} customStyle={{fontSize:16}}/>
                    </View>
                    <TouchableOpacity onPress={navigateWallet}>
                        <View style={styles.headerIcoWrap}>
                            <Image source={require("../../assets/img/ico_close_bl.png")} style={{width:14,height:14}}/>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{flex:1,justifyContent:"space-between"}}>
                    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                        <ExtraBoldText text={`${route.params.amount} ${route.params.symbol} 전송이\n성공하였습니다.`} customStyle={{fontSize:18,lineHeight:26,textAlign:"center"}}/>
                    </View>
                    <TouchableWithoutFeedback onPress={navigateWallet}>
                        <View style={{height:50,backgroundColor:"#8D3981",justifyContent:"center",alignItems:"center"}}>
                            <BoldText text={"확인"} customStyle={{color:"#FFFFFF",fontSize:16}}/>
                        </View>
                    </TouchableWithoutFeedback>
                    
                </View>
            </SafeAreaView>
        </>
    )
}
        
export default WalletResult;

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
        marginTop:16,
        borderRadius:6,
        borderColor:"#E5E5E5",
        borderWidth:1,
        paddingHorizontal:16,
        height:46
    },
    percentBox:{
        borderWidth:1,
        borderRadius:6,
        borderColor:"#E5E5E5",
        paddingVertical:11,
        paddingHorizontal:12 
    },
    percentText:{
        color:"#707070"
    },
    input:{
        padding:0,
        fontFamily:"NotoSans-Regular",
        maxWidth:200
    },
    noticeText:{
        color:"#3A3A3A",
        fontSize:12
    },
    modalItemGap:{
        marginTop:16
    },
    modalItemBox:{
        marginTop:10,
        backgroundColor:"#F3F3F3",
        borderColor:"#F3F3F3",
        borderRadius:6,
        paddingVertical:13,
        paddingHorizontal:16
    },
    modalItemText:{
        fontSize:12,
        color:'#3A3A3A'
    },
    modalBottomBtn:{
        flex:1,
        justifyContent:"center",
        alignItems:"center"
    }
});