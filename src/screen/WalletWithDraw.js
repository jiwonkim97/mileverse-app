import React, {useState,useEffect, useRef} from 'react';
import { useDispatch,useSelector } from 'react-redux';
import { View,StyleSheet,SafeAreaView,TouchableWithoutFeedback,Image,TextInput,ScrollView,TouchableOpacity } from 'react-native';
import CommonStatusbar from '../components/CommonStatusbar';
import { ExtraBoldText,BoldText } from '../components/customComponents';
import Modal from 'react-native-modal';
import Axios from '../modules/Axios';
import * as spinner from '../actions/spinner';
import * as dialog from '../actions/dialog';

const WalletWithDraw = ({navigation,route}) =>{
    const {pin:auth_pin} = useSelector(state => state.authentication.userInfo);
    const dispatch = useDispatch();    
    const [type,setType] = useState(0);
    const [inputAmount,setInputAmount] = useState("");
    const [sendAmount,setSendAmount] = useState(0);
    const [amountFromDB,setAmountFromDB] = useState(0);
    const [fromAddr,setFromAddr] = useState("");
    const [amountError,setAmountError] = useState({text:"-",color:"#FFFFFF"});
    const [address,setAddress] = useState("");
    const [verifiedAddr,setVerifiedAddr] = useState(false);
    const [addressError,setAddressError] = useState({text:"-",color:"#FFFFFF"});
    const [fee,setFee] = useState("");
    const [modal,setModal] = useState(false);
    const member = useRef(false);
    const toID = useRef(null)
    const [symbol,setSymbol] = useState(route.params.symbol);
    const [sendTokenFee,setSendTokenFee] = useState(0);

    useEffect(()=>{
        const defaultSetting = async()=>{
            dispatch(spinner.showSpinner());
            if(symbol === "BTC") {
                const {data} = await Axios.get("/api/henesis/btc/balance");
                setAmountFromDB(String(parseFloat(Number(data.btc.amount).toFixed(8))))
                setFromAddr(data.btc.address)
            } else {
                const {data} = await Axios.get("/api/henesis/eth/balance");
                if(symbol === "ETH") {
                    setAmountFromDB(String(parseFloat((Number(data.eth.amount)).toFixed(8))))
                    setFromAddr(data.eth.address)
                } else if(symbol === "MVC") {
                    setAmountFromDB(String(parseFloat(Number(data.mvc.amount).toFixed(8))));
                    setFromAddr(data.mvc.address)
                    setSendTokenFee(String(parseFloat(Number(data.eth.amount).toFixed(8))));
                }
            }
            dispatch(spinner.hideSpinner());
        }
        defaultSetting();
    },[]);

    const onPercentPress = (num)=>{
        if(num !== type) {
            if(symbol === "ETH" || symbol === "BTC") {
                console.log(amountFromDB)
                setInputAmount(String(parseFloat((amountFromDB * num / 100).toFixed(6).slice(0,-1))));
            } else if(symbol === "MVC") {
                setInputAmount(String(Math.floor(parseFloat((amountFromDB * num / 100).toFixed(5)))));
            }

            setType(num);
        } else {
            setType(0)
        }
    }

    const selectBg = (num)=>{
        return num === type ? {backgroundColor:"#8D3981",borderColor:"#8D3981"} : {backgroundColor:"#FFFFFF",borderColor:"#E5E5E5"}
    }
    const selectText = (num)=>{
        return num === type ? {color:"#FFFFFF"} : {color:"#707070"}
    }
    const decimalCheck = (num)=>{
        const spl = String(num).split('.');
        if(spl.length===1) return true;
         else if(spl.length>2) return false;
        else if(spl[1].length>5) return false;
        else return true;
    }
    const onConfirm = async()=>{
        if(inputAmount === "") {
            setAmountError({text:"* ????????? ??????????????????.",color:"#EE1818"});
        } else if(symbol === "ETH" && Number(inputAmount)>Number(amountFromDB)){
            setAmountError({text:"* ????????? ???????????????.",color:"#EE1818"});
        } else if(symbol === "MVC" && Number(inputAmount)>Number(amountFromDB)) {
            setAmountError({text:"* ????????? ???????????????.",color:"#EE1818"});
        } else if(symbol === "BTC" && Number(inputAmount)>Number(amountFromDB)){
            setAmountError({text:"* ????????? ???????????????.",color:"#EE1818"});
        } else if(address === fromAddr){
            setAddressError({text:"* ????????? ?????? ?????? ?????? ????????? ???????????????.",color:"#EE1818"})
        } else if(address === "" || verifiedAddr === false) {
            setAddressError({text:"* ????????? ???????????? ????????????.",color:"#EE1818"});
        } else if(symbol === "ETH" && Number(inputAmount)-0.005<0){
            setAmountError({text:"* ?????? ????????? 0.005ETH ?????????.",color:"#EE1818"});
        } else if(symbol === "BTC" && Number(inputAmount)-0.0002<0){
            setAmountError({text:"* ?????? ????????? 0.0002 BTC ?????????",color:"#EE1818"});
        } else if(symbol === "BTC" && Number(inputAmount)-0.0002===0){
            setAmountError({text:"* ????????? ???????????????.",color:"#EE1818"});
        } else if(symbol === "MVC" && Number.isInteger(Number(inputAmount))===false){
            setAmountError({text:"* ??????????????? ?????? ???????????????.",color:"#EE1818"});
        } else if(!decimalCheck(inputAmount)){
            setAmountError({text:"* ????????? ?????? 5??? ???????????? ?????????????????????.",color:"#EE1818"});
        } else {
            let url = "";
            member.current = false;
            toID.current = null;
            if(symbol === "ETH" || symbol === "MVC") url = "/api/henesis/eth/wallets/users";
            else if(symbol === "BTC") url = "/api/henesis/btc/wallets/users";
            const {data} = await Axios.get(url,{params:{address:address}});
            if(data.result === "success") {
                if(data.check === true) {
                    setFee("?????? ??? ????????? ??????");
                    setSendAmount(inputAmount)
                    member.current = true;
                    toID.current = data.to;
                } else if(data.check === false && symbol === "BTC") {
                    setFee("0.0002 BTC");
                    setSendAmount(parseFloat((Number(inputAmount) - 0.0002).toFixed(8)))
                } else if(data.check === false && symbol === "ETH") {
                    setFee(`0.005 ETH`);
                    setSendAmount(parseFloat((Number(inputAmount) - 0.005).toFixed(8)))
                } else if(data.check === false && symbol === "MVC") {
                    if(sendTokenFee < 0.005) {
                        setAmountError({text:"* ?????? ???????????? ???????????? ????????????.",color:"#EE1818"});
                        return;
                    } else {
                        setFee(`0.005 ETH`);
                        setSendAmount(inputAmount);
                    }
                }
                setModal(true)
            } else {
                Alert.alert("??????",data.msg,[{text:'??????'}]);
            }
        }
    }
    const onSendToken = async()=>{
        setModal(false);       
        if(auth_pin === "" || auth_pin === undefined || auth_pin === null) {
            dispatch(dialog.openDialog("alert",(
                <>
                    <BoldText text={"PINCODE??? ?????? ??????????????????.\n??????->?????????->PinCode ??????"} customStyle={{textAlign:"center",lineHeight:20}}/>
                </>
            )));
        }else {
            setTimeout(()=>{
                navigation.navigate("PinCode",{
                    mode:"confirm",
                    onGoBack:(_value)=>{requestSendToken(_value)}
                });
            },600)
        }
    }

    const requestSendToken =async(pin)=>{
        if(pin === true) {
            let _flag = false;
            dispatch(spinner.showSpinner());
            if(symbol !== "BTC") {
                const {data} = await Axios.post("/api/henesis/eth/transfer",{
                    symbol:symbol,
                    toAddr:address,
                    fromAddr:fromAddr,
                    input_amount:inputAmount,
                    send_amount:sendAmount,
                    member:member.current,
                    to:toID.current
                });
                data.result === "success" ? _flag = true : null; 
            } else {
                const {data} = await Axios.post("/api/henesis/btc/transfer",{
                    symbol:symbol,
                    toAddr:address,
                    fromAddr:fromAddr,
                    input_amount:inputAmount,
                    send_amount:sendAmount,
                    member:member.current
                });
                data.result === "success" ? _flag = true : null; 
            }
            dispatch(spinner.hideSpinner());
            
            if(_flag) {
                navigation.navigate("WalletResult",{amount:inputAmount,symbol:symbol});
            } else {
                alert("????????? ?????? ????????? ?????????????????????.")
            }
        }
    }

    const onVerifiedAddr = async(_addr)=>{
        const p_addr = _addr === undefined ? address : _addr
        setAddressError({text:"-",color:"#FFFFFF"});
        if(fromAddr === p_addr) {
            setAddressError({text:"* ????????? ?????? ?????? ?????? ????????? ???????????????.",color:"#EE1818"})
        } else {
            if(symbol === "BTC") {
                const {data} = await Axios.get("/api/henesis/btc/verified",{params:{address:p_addr}});
                if(data.result === "success") setVerifiedAddr(true);
                else setAddressError({text:"* ????????? ???????????? ????????????.",color:"#EE1818"})
            } else {
                const {data} = await Axios.get("/api/henesis/eth/verified",{params:{address:p_addr}});
                if(data.result === "success") setVerifiedAddr(true);
                else setAddressError({text:"* ????????? ???????????? ????????????.",color:"#EE1818"})
            }
        }
    }

    useEffect(()=>{
        setVerifiedAddr(false);
    },[address]);

    useEffect(()=>{
        setAmountError({text:"* -",color:"#FFFFFF"})
    },[inputAmount]);

    return (
        <>
            <CommonStatusbar backgroundColor="#F9F9F9"/>
            <SafeAreaView style={{backgroundColor:"#FFFFFF",flex:1,justifyContent:"space-between"}}>
                <View style={[styles.header,styles.shadow]}>
                    <TouchableOpacity onPress={()=>navigation.goBack()}>
                        <View style={styles.headerIcoWrap}>
                            <Image source={require('../../assets/img/ico_back.png')} style={{width:21,height:21}} />
                        </View>
                    </TouchableOpacity>
                    <View style={[styles.headerIcoWrap,{flex:1}]}>
                        <ExtraBoldText text={`${symbol} ??????`} customStyle={{fontSize:16}}/>
                    </View>
                    <TouchableOpacity onPress={()=>navigation.navigate("Wallet")}>
                        <View style={styles.headerIcoWrap}>
                            <Image source={require("../../assets/img/ico_close_bl.png")} style={{width:20,height:20}}/>
                        </View>
                    </TouchableOpacity>
                </View>
                <ScrollView>
                    <View style={{justifyContent:"space-between",flex:1}}>
                        <View style={{paddingHorizontal:16}}>
                            <View style={styles.item}>
                                <BoldText text={"????????????"}/>
                                <View style={[styles.boxWrap,{flexDirection:"row",justifyContent:"space-between",alignItems:"center"}]}>
                                    <View>
                                        <TextInput placeholderTextColor={"#D5C2D3"} placeholder={"????????? ??????????????????"} style={[styles.input,{maxWidth:250}]} value={inputAmount} keyboardType="numeric" onChangeText={(text)=>{
                                            if(type !== 0) setType(0)
                                            if(text.indexOf("-") !== -1) {
                                                setInputAmount(text.slice(0,-1))
                                            }else {
                                                setInputAmount(text)
                                            }
                                        }}/>
                                    </View>
                                    <BoldText text={symbol}/>
                                </View>
                                <View style={{marginTop:10,flexDirection:"row"}}>
                                    <View style={{flex:1,paddingRight:5}}>
                                        <TouchableWithoutFeedback onPress={()=>onPercentPress(10)}>
                                            <View style={[styles.percentBox,selectBg(10)]}>
                                                <BoldText text="10%" customStyle={[styles.percentText,selectText(10)]}/>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    </View>
                                    <View style={{flex:1,paddingHorizontal:5}}>
                                        <TouchableWithoutFeedback onPress={()=>onPercentPress(25)}>
                                            <View style={[styles.percentBox,selectBg(25)]}>
                                                <BoldText text="25%" customStyle={[styles.percentText,selectText(25)]}/>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    </View>
                                    <View style={{flex:1,paddingHorizontal:5}}>
                                        <TouchableWithoutFeedback onPress={()=>onPercentPress(50)}>
                                            <View style={[styles.percentBox,selectBg(50)]}>
                                                    <BoldText text="50%" customStyle={[styles.percentText,selectText(50)]}/>
                                                </View>
                                        </TouchableWithoutFeedback>
                                    </View>
                                    <View style={{flex:1,paddingHorizontal:5}}>
                                        <TouchableWithoutFeedback onPress={()=>onPercentPress(75)}>
                                            <View style={[styles.percentBox,selectBg(75)]}>
                                                    <BoldText text="75%" customStyle={[styles.percentText,selectText(75)]}/>
                                                </View>
                                        </TouchableWithoutFeedback>
                                    </View>
                                    <View style={{flex:1,paddingLeft:5}}>
                                        <TouchableWithoutFeedback onPress={()=>onPercentPress(100)}>
                                            <View style={[styles.percentBox,selectBg(100)]}>
                                                <BoldText text="100%" customStyle={[styles.percentText,selectText(100)]}/>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    </View>
                                </View>
                                <BoldText text={amountError.text} customStyle={{color:amountError.color,fontSize:10,marginTop:8}}/>
                            </View>
                            <View style={[styles.item,{marginTop:15}]}>
                                <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:"center"}}>
                                    <BoldText text={"?????? ??????"}/>
                                    <TouchableWithoutFeedback onPress={()=>{
                                        navigation.navigate("ScanScreen",{
                                            onGoBack:(_value)=>{
                                                if(_value) setAddress(_value);
                                                onVerifiedAddr(_value);
                                            }
                                        });
                                    }}>
                                    
                                        <Image source={require("../../assets/img/ico_camera.png")} style={{width:24,height:24}}/>
                                    </TouchableWithoutFeedback>
                                </View>
                                <View style={[styles.boxWrap,{justifyContent:'center'}]}>
                                    <TextInput placeholderTextColor={"#D5C2D3"} placeholder={"????????? ??????????????????"} style={[styles.input,{fontSize:12}]} value={address} onBlur={()=>onVerifiedAddr()} onChangeText={(text)=>setAddress(text)}/>
                                </View>
                                <BoldText text={addressError.text} customStyle={{color:addressError.color,fontSize:10,marginTop:8}}/>
                            </View>
                            <View style={[styles.item,{marginTop:16,paddingHorizontal:2}]}>
                                <View style={{marginTop:16,borderWidth:1,borderColor:"#F2F2F2"}} >
                                </View>
                                <View style={{marginTop:26}}>
                                    <BoldText text={"[??????]"} customStyle={[styles.noticeText,{color:'red'}]}/>
                                    <View style={{flexDirection:"column",flexGrow:1}}>
                                        <BoldText text={"??? ???????????? ???????????? ?????????????????? ?????? ??? Internal Txns(????????? ????????????)?????? ?????? ?????????. Internal Txns(?????????????????????)?????? ????????? ?????? ?????? ??????????????? ????????? ?????? ?????? ??? ????????????."} customStyle={[styles.noticeText,{marginTop:9,lineHeight:18}]}/>
                                        <BoldText text={"- ????????? ?????? ?????? ??? ????????? ?????? ???????????? ???????????? ??????????????????."} customStyle={[styles.noticeText,{lineHeight:18,color:"red"}]}/>
                                    </View>
                                </View>
                                {
                                    symbol === "BTC" ? 
                                        <View style={{marginTop:26,marginBottom:100}}>
                                            <BoldText text={"[????????????]"} customStyle={styles.noticeText}/>
                                            <BoldText text={"?????? ????????? ?????? ????????? ??????????????????."} customStyle={[styles.noticeText,{marginTop:9,lineHeight:18}]}/>
                                            <BoldText text={"?????? ??? ?????? ?????????(0.0002 BTC)??? ???????????????."} customStyle={[styles.noticeText,{lineHeight:18}]}/>
                                            <BoldText text={"0.0002 BTC ???????????? ?????? ???????????????."} customStyle={[styles.noticeText,{lineHeight:18}]}/>
                                        </View>
                                        : symbol === "ETH" ? 
                                            <View style={{marginTop:26,marginBottom:100}}>
                                                <BoldText text={"[????????????]"} customStyle={styles.noticeText}/>
                                                <BoldText text={"?????? ????????? ?????? ????????? ??????????????????."} customStyle={[styles.noticeText,{marginTop:9,lineHeight:18}]}/>
                                                <BoldText text={"?????? ??? ?????? ???(0.005 ETH)??? ???????????????."} customStyle={[styles.noticeText,{lineHeight:18}]}/>
                                                <BoldText text={"0.005 ETH ???????????? ?????? ???????????????."} customStyle={[styles.noticeText,{lineHeight:18}]}/>
                                            </View>
                                            :
                                            <View style={{marginTop:26,marginBottom:100}}>
                                                <BoldText text={"[????????????]"} customStyle={styles.noticeText}/>
                                                <BoldText text={"?????? ????????? ?????? ????????? ??????????????????."} customStyle={[styles.noticeText,{marginTop:9,lineHeight:18}]}/>
                                                <BoldText text={"?????? ??? ?????? ???(0.005 ETH)??? ???????????????."} customStyle={[styles.noticeText,{lineHeight:18}]}/>
                                                <BoldText text={"1 MVC ???????????? ?????? ???????????????."} customStyle={[styles.noticeText,{lineHeight:18}]}/>
                                            </View>
                                }
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <TouchableWithoutFeedback onPress={onConfirm}>
                    <View style={{height:50,backgroundColor:"#8D3981",justifyContent:"center",alignItems:"center"}}>
                        <BoldText text={"????????????"} customStyle={{color:"#FFFFFF",fontSize:16}}/>
                    </View>
                </TouchableWithoutFeedback>
                <Modal isVisible={modal} backdropTransitionOutTiming={0} style={{margin: 0,justifyContent:"center",alignItems:"center"}} useNativeDriver={true}>
                    <View style={{backgroundColor:"#FFFFFF",width:308,borderRadius:6,overflow:"hidden"}}>
                        <View style={{paddingHorizontal:16,paddingVertical:20}}>
                            <BoldText text={"?????? ??? ?????? ????????? ?????? ??? ????????? ?????????"}/>
                            <View style={{marginTop:20,borderWidth:1,borderColor:"#F2F2F2",marginBottom:10}} />
                            <View style={styles.modalItemGap}>
                                <BoldText text={"?????? ??????"}/>
                                <View style={styles.modalItemBox}>
                                    <BoldText text={`${sendAmount} ${symbol}`} customStyle={styles.modalItemText}/>
                                </View>
                            </View>
                            <View style={styles.modalItemGap}>
                                <BoldText text={"?????? ?????????"}/>
                                <View style={styles.modalItemBox}>
                                    <BoldText text={fee} customStyle={styles.modalItemText}/>
                                </View>
                            </View>
                            <View style={styles.modalItemGap}>
                                <BoldText text={"?????? ??????"}/>
                                <View style={styles.modalItemBox}>
                                    <BoldText text={fromAddr} customStyle={[styles.modalItemText,{lineHeight:18}]}/>
                                </View>
                            </View>
                            <View style={styles.modalItemGap}>
                                <BoldText text={"?????? ??????"}/>
                                <View style={styles.modalItemBox}>
                                    <BoldText text={address} customStyle={[styles.modalItemText,{lineHeight:18}]}/>
                                </View>
                            </View>
                        </View>
                        <View style={{flexDirection:'row',height:46}}>
                            <TouchableWithoutFeedback onPress={()=>setModal(false)}>
                                <View style={[styles.modalBottomBtn,{backgroundColor:"#EBEBEB"}]}>
                                    <BoldText text={"??????"} customStyle={{color:"#8B8B8B",fontSize:14}}/>
                                </View>
                            </TouchableWithoutFeedback>
                            
                            <TouchableWithoutFeedback onPress={onSendToken}>
                                <View style={[styles.modalBottomBtn,{backgroundColor:"#8D3981"}]}>
                                    <BoldText text={"??????"} customStyle={{color:"#FFFFFF",fontSize:14}}/>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        </>
    )
}
        
export default WalletWithDraw;

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
        marginTop:16,
        borderRadius:6,
        borderColor:"#E5E5E5",
        borderWidth:1,
        paddingHorizontal:16,
        height:46
    },
    percentBox:{
        height:36,
        borderRadius:6,
        borderWidth:1,
        borderColor:"#E5E5E5",
        justifyContent:"center",
        alignItems:"center"
    },
    percentText:{
        color:"#707070"
    },
    input:{
        padding:0,
        fontFamily:"NotoSans-Regular",
        minWidth:150
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
        height:46,
        justifyContent:"center",
        alignItems:"center"
    },
    noticeText:{
        color:"#3A3A3A",
        fontSize:12
    }
});