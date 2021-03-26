import React, { useState,useEffect } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { View,StyleSheet,SafeAreaView,TouchableWithoutFeedback,Image,ScrollView } from 'react-native';
import CommonStatusbar from '../components/CommonStatusbar';
import { ExtraBoldText,BoldText } from '../components/customComponents';
import Axios from '../modules/Axios';
import * as spinner from '../actions/spinner'
import * as dialog from '../actions/dialog';

const Wallet = ({navigation,route}) =>{
    const dispatch = useDispatch();
    const {mvp} = useSelector(state => state.authentication.userInfo);
    const [commaMvp,setCommaMvp] = useState(mvp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    const [eth,setEth] = useState({amount:0,balance:0});
    const [btc,setBtc] = useState({amount:0,balance:0});
    const [mvc,setMvc] = useState({amount:0,balance:0});
    const [total,setTotal] = useState(0);
    useEffect(()=>{
        setCommaMvp(mvp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))
    },[mvp]);

    const commaFormat = (num)=>{
        const parts = String(num).split(".")
        return parts[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") +(parts[1] ? "."+parts[1] : "");
    }

    const setBlanceFormat = (num) =>{
        const _fixedNum = Number(num).toFixed(8);
        const _floatNum = parseFloat(_fixedNum);
        if(_floatNum<0.000001) {
            const __str_FixedNum = String(_fixedNum);
            if( __str_FixedNum === 0 ) {
                return 0
            }else if(__str_FixedNum.slice(-1) === "0") 
                return __str_FixedNum.slice(0,-1);
            else 
                return __str_FixedNum;
        }
        else return _floatNum ;
    }

    useEffect(()=>{
        const unsubscribe = navigation.addListener('focus', async() => {
            dispatch(spinner.showSpinner());
            const {data} = await Axios.get("/api/henesis/assets");
            dispatch(spinner.hideSpinner());
            if(data.result === 'success') {
                setEth({amount:commaFormat(Number(setBlanceFormat(data.eth.amount))),balance:commaFormat(data.eth.balance)});
                setBtc({amount:commaFormat(Number(setBlanceFormat(data.btc.amount))),balance:commaFormat(data.btc.balance)});
                setMvc({amount:commaFormat(Number(setBlanceFormat(data.mvc.amount))),balance:commaFormat(data.mvc.balance)});
                setTotal(commaFormat(Number(data.eth.balance)+Number(data.btc.balance)+Number(data.mvc.balance)+Number(mvp)));
            } else {
                dispatch(dialog.openDialog("alert",(
                    <BoldText text={"시스템 오류입니다. 다시 시도하여 주세요."} customStyle={{textAlign:"center",lineHeight:20}}/>
                ),()=>{
                    dispatch(dialog.closeDialog());
                    navigation.navigate("Home");
                }));    
            }
        });
          return unsubscribe;
    },[navigation])

    return (
        <>
            <CommonStatusbar backgroundColor="#F9F9F9"/>
            <SafeAreaView style={{backgroundColor:"#FFFFFF",flex:1}}>
                <View style={[styles.header,styles.shadow]}>
                    <ExtraBoldText text="내 지갑" customStyle={{fontSize:16}}/>
                </View>
                <ScrollView>
                    <View style={{paddingHorizontal:16,paddingVertical:20}}>
                        <View style={[styles.shadow,{borderRadius:12,alignItems:"center",paddingVertical:22}]}>
                            <BoldText text={"총 자산"} />
                            <ExtraBoldText text={`${total} 원`} customStyle={{marginTop:12,fontSize:16}}/>
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
                                        <BoldText text={`${commaMvp} MVP`} />
                                    </View>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={()=>navigation.navigate("WalletDetail",{header:"Mileverse",symbol:"MVC"})}>
                                    <View style={[styles.itemOffset,{borderTopWidth:1,borderTopColor:"#ECECEC"}]}>
                                        <View style={styles.symbolWrap}>
                                            <Image source={require("../../assets/img/symbol_mvc.png")} style={styles.symbolIco}/>
                                            <BoldText text={"MVC"} />
                                        </View>
                                        <View style={styles.priceWrap}>
                                            <BoldText text={`${mvc.amount} MVC`} />
                                            <BoldText text={`${mvc.balance} KRW`} customStyle={styles.textKrw}/>
                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                        <TouchableWithoutFeedback onPress={()=>{
                            dispatch(dialog.openDialog("alert",(
                                <BoldText text={"※ MVP/MVC 교환 기능이 점검중입니다."} customStyle={{textAlign:"center",lineHeight:20}}/>
                            )));
                        }}>
                            <View style={{marginTop:10,backgroundColor:"#8D3981",justifyContent:"center",alignItems:"center",borderRadius:6,height:46}}>
                                <BoldText text={"MVP/ MVC 교환"} customStyle={{fontSize:14,color:"#FFFFFF"}}/>
                            </View>
                        </TouchableWithoutFeedback>
                        <View style={{marginTop:27}}>
                            <BoldText text={"자산"} />
                            <View style={{marginTop:16}}>
                                <TouchableWithoutFeedback onPress={()=>navigation.navigate("WalletDetailOnBtc",{header:"Bitcoin",symbol:"BTC"})}>
                                    <View style={[styles.itemOffset,styles.itemBorder]}>
                                        <View style={styles.symbolWrap}>
                                            <Image source={require("../../assets/img/symbol_btc.png")} style={styles.symbolIco}/>
                                            <BoldText text={"BTC"} />
                                        </View>
                                        <View style={styles.priceWrap}>
                                            <BoldText text={`${btc.amount} BTC`} />
                                            <BoldText text={`${btc.balance } KRW`} customStyle={styles.textKrw}/>
                                        </View>
                                    </View>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={()=>navigation.navigate("WalletDetail",{header:"Ethereum",symbol:"ETH"})}>
                                    <View style={[styles.itemOffset,styles.itemBorder,{marginTop:10}]}>
                                        <View style={styles.symbolWrap}>
                                            <Image source={require("../../assets/img/symbol_eth.png")} style={styles.symbolIco}/>
                                            <BoldText text={"ETH"} />
                                        </View>
                                        <View style={styles.priceWrap}>
                                            <BoldText text={`${eth.amount} ETH`} />
                                            <BoldText text={`${eth.balance} KRW`} customStyle={styles.textKrw}/>
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
        marginRight:10,
        width:24,
        height:24
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