import React,{useEffect, useState} from 'react';
import {View,StyleSheet,SafeAreaView,TouchableOpacity,Image} from 'react-native';
import CommonStatusbar from '../../components/CommonStatusbar';
import { ExtraBoldText,BoldText,RegularText } from '../../components/customComponents';
import Axios from '../../modules/Axios'

export default ({navigation,route})=>{
    const [rate,setRate] = useState(0)
    const commaFormat = (num)=>{
        return String(num).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    useEffect(()=>{
        const getRate = async()=>{
            const {data} = await Axios.get("/api/henesis/mvc/rate");
            setRate(Number(data.rate.toFixed(2)))
        }
        getRate();
    },[]);
    return (
        <>
            <CommonStatusbar backgroundColor="#F9F9F9"/>
            <SafeAreaView style={{flex:1}}>
                <View style={[styles.header,styles.shadow]}>
                    <View style={{width:50}}>
                    </View>
                    <View style={[styles.headerIcoWrap,{flex:1}]}>
                        <ExtraBoldText text={"MVP/MVC 교환"} customStyle={{fontSize:16}}/>
                    </View>
                    <TouchableOpacity onPress={()=>navigation.goBack()}>
                        <View style={styles.headerIcoWrap}>
                            <Image source={require("../../../assets/img/ico_close_bl.png")} style={{width:20,height:20}}/>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{padding:16,backgroundColor:'#FFFFFF',flex:1}}>
                    <View style={[styles.shadow,{borderRadius:12,justifyContent:"center",alignItems:"center",height:86,backgroundColor:"#FFFFFF"}]}>
                        <BoldText text={"MVC 현재 가격"}/>
                        <ExtraBoldText text={`${String(rate)} 원`} customStyle={{marginTop:10,fontSize:16}}/>
                    </View>
                    <View style={[styles.shadow,{borderRadius:12,justifyContent:"center",alignItems:"center",height:120,backgroundColor:"#FFFFFF",marginTop:20}]}>
                        <View style={{paddingVertical:6,paddingLeft:16,flexDirection:"row",alignItems:"center",justifyContent:"space-between",height:60,width:"100%"}}>
                            <View style={{flexDirection:"row",alignItems:"center"}}>
                                <Image source={require("../../../assets/img/symbol_mvp.png")} style={{width:24,height:24,resizeMode:'stretch'}}/>
                                <BoldText text={"MVP"} customStyle={{marginLeft:10}}/>
                            </View>
                            <TouchableOpacity onPress={()=>navigation.navigate("MvpToMvc")}>
                                <View style={{borderLeftWidth:1,borderLeftColor:"#E5E5E5",justifyContent:"center",height:"100%",paddingHorizontal:20}}>
                                    <BoldText text={"MVC로 교환"}/>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{paddingVertical:6,paddingLeft:16,flexDirection:"row",alignItems:"center",justifyContent:"space-between",height:60,width:"100%",borderTopWidth:1,borderTopColor:'#ECECEC'}}>
                            <View style={{flexDirection:"row",alignItems:"center"}}>
                                <Image source={require("../../../assets/img/symbol_mvc.png")} style={{width:24,height:24,resizeMode:'stretch'}}/>
                                <BoldText text={"MVC"} customStyle={{marginLeft:10}}/>
                            </View>
                            <TouchableOpacity onPress={()=>navigation.navigate("MvcToMvp")}>
                                <View style={{borderLeftWidth:1,borderLeftColor:"#E5E5E5",justifyContent:"center",height:"100%",paddingHorizontal:20}}>
                                    <BoldText text={"MVP로 교환"}/>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{paddingTop:26,marginTop:26,borderTopWidth:2,borderTopColor:'#E5E5E5'}}>
                        <BoldText text={"[유의사항]"} customStyle={{}}/>
                        <View style={{marginTop:12}}>
                            <BoldText text={
                                "- 교환 후 취소가 불가능합니다.\n"+
                                "- 현재 시세에 따라 교환됩니다.\n"+
                                "- 월 교환한도 이상 교환이 불가능합니다." 
                            } customStyle={{lineHeight:20}}/>
                        </View>
                        <BoldText text={"[월 교환 한도]"} customStyle={{marginTop:20}}/>
                        <View style={{marginTop:12}}>
                            <BoldText text={
                                "- MVC to MVP -> 5,000MVC\n"+
                                "- MVP to MVC -> 50,000MVP" 
                            } customStyle={{lineHeight:20}}/>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        </>
    )
}
const styles = StyleSheet.create({
    header:{
        backgroundColor:"white",
        height:50,
        alignItems:'center',
        flexDirection:"row",
        justifyContent:"space-between",
        zIndex:1
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
    }
});