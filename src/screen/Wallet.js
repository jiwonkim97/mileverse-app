import React, { useState,useEffect } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { View,StyleSheet,SafeAreaView,TouchableWithoutFeedback,Image } from 'react-native';
import CommonStatusbar from '../components/CommonStatusbar';
import { ExtraBoldText,BoldText } from '../components/customComponents';
import Axios from '../modules/Axios';
import { ScrollView } from 'react-native-gesture-handler';

const Wallet = ({navigation,route}) =>{
    const dispatch = useDispatch();
    const {mvp} = useSelector(state => state.authentication.userInfo);
    const [commaMvp,setCommaMvp] = useState(mvp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    useEffect(()=>{
        setCommaMvp(mvp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))
    },[mvp])

    return (
        <>
            <CommonStatusbar backgroundColor="#F9F9F9"/>
            <SafeAreaView style={{backgroundColor:"#FFFFFF",flex:1}}>
                <View style={[styles.header,styles.shadow]}>
                    <ExtraBoldText text="내 지갑 " customStyle={{fontSize:16}}/>
                </View>
                <ScrollView>
                    <View style={{paddingHorizontal:16,paddingVertical:20}}>
                        <View style={[styles.shadow,{borderRadius:12,alignItems:"center",paddingVertical:22}]}>
                            <BoldText text={"총 자산"} />
                            <ExtraBoldText text={"1,000,000 원"} customStyle={{marginTop:12,fontSize:14}}/>
                        </View>
                        <View style={{marginTop:26}}>
                            <BoldText text={"마일벌스"} />
                            <View style={[styles.itemBorder,{marginTop:16}]}>
                                <TouchableWithoutFeedback onPress={()=>navigation.navigate("MyMvp")}>
                                    <View style={[styles.itemOffset]}>
                                        <View style={styles.symbolWrap}>
                                            <Image source={require("../../assets/img/symbol_mvp.png")} style={styles.symbolIco}/>
                                            <BoldText text={"MVP"} />
                                        </View>
                                        <BoldText text={commaMvp} />
                                    </View>
                                </TouchableWithoutFeedback>
                                <View style={[styles.itemOffset,{borderTopWidth:1,borderTopColor:"#ECECEC"}]}>
                                    <View style={styles.symbolWrap}>
                                        <Image source={require("../../assets/img/symbol_mvc.png")} style={styles.symbolIco}/>
                                        <BoldText text={"MVC"} />
                                    </View>
                                    <View style={styles.priceWrap}>
                                        <BoldText text={"100,000 MVC"} />
                                        <BoldText text={"100,000,000 KRW"} customStyle={styles.textKrw}/>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={{marginTop:10,backgroundColor:"#8D3981",justifyContent:"center",alignItems:"center",borderRadius:6,height:46}}>
                            <BoldText text={"MVP/ MVC 교환"} customStyle={{fontSize:14,color:"#FFFFFF"}}/>
                        </View>
                        <View style={{marginTop:27}}>
                            <BoldText text={"자산"} />
                            <View style={{marginTop:16}}>
                                <TouchableWithoutFeedback onPress={()=>navigation.navigate("WalletDetail",{header:"Bitcoin"})}>
                                    <View style={[styles.itemOffset,styles.itemBorder]}>
                                        <View style={styles.symbolWrap}>
                                            <Image source={require("../../assets/img/symbol_btc.png")} style={styles.symbolIco}/>
                                            <BoldText text={"BTC"} />
                                        </View>
                                        <View style={styles.priceWrap}>
                                            <BoldText text={"100,000 BTC"} />
                                            <BoldText text={"100,000,000 KRW"} customStyle={styles.textKrw}/>
                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={()=>navigation.navigate("WalletDetail",{header:"Ethereum"})}>
                                    <View style={[styles.itemOffset,styles.itemBorder,{marginTop:10}]}>
                                        <View style={styles.symbolWrap}>
                                            <Image source={require("../../assets/img/symbol_eth.png")} style={styles.symbolIco}/>
                                            <BoldText text={"ETH"} />
                                        </View>
                                        <View style={styles.priceWrap}>
                                            <BoldText text={"100,000 ETH"} />
                                            <BoldText text={"100,000,000 KRW"} customStyle={styles.textKrw}/>
                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    )
}
        
export default Wallet;

const styles = StyleSheet.create({
    header:{
        height:50,
        borderColor:"#CCCCCC",
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'row',
        zIndex:1
    },
    shadow:{
        elevation:5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2.22,
        backgroundColor:"white"
    },
    itemBorder:{
        borderRadius:6,
        borderWidth:1,
        borderColor:"#E5E5E5"
    },
    itemOffset:{
        flexDirection:"row",
        justifyContent:"space-between",
        paddingHorizontal:16,
        alignItems:"center",
        height:64
    },
    symbolWrap:{
        flexDirection:"row",
        alignItems:'center'
    },
    symbolIco:{
        marginRight:10
    },
    priceWrap:{
        alignItems:"flex-end"
    },
    textKrw:{
        fontSize:10,
        color:'#707070',
        marginTop:6
    }
});