import React, {useState,useEffect,useRef,useCallback} from 'react';
import { useDispatch } from 'react-redux';
import { View,StyleSheet,SafeAreaView,TouchableWithoutFeedback,Image,TextInput,ScrollView,TouchableOpacity } from 'react-native';
import EthFees from '../components/WalletFees/EthFees';
import BtcFees from '../components/WalletFees/BtcFees';
import CommonStatusbar from '../components/CommonStatusbar';
import { ExtraBoldText,BoldText } from '../components/customComponents';
import Modal from 'react-native-modal';
import Axios from '../modules/Axios';
import * as spinner from '../actions/spinner';

const WalletWithDraw = ({navigation,route}) =>{
    const dispatch = useDispatch();    
    const [type,setType] = useState(0);
    const [amount,setAmount] = useState(0);
    const [inputAmount,setInputAmount] = useState("");
    const [amountFromDB,setAmountFromDB] = useState(0);
    const [fromAddr,setFromAddr] = useState("");
    const [amountError,setAmountError] = useState({text:"-",color:"#FFFFFF"});
    const [address,setAddress] = useState("");
    const [verifiedAddr,setVerifiedAddr] = useState(false);
    const [addressError,setAddressError] = useState({text:"-",color:"#FFFFFF"});
    const totalGasFee = useRef(0);
    const gasprice = useRef(0);
    const gasLimit = useRef(0);
    const [modal,setModal] = useState(false);

    const [bitGasFees,setBitGasFees] = useState({});

    
    useEffect(()=>{
        const defaultSetting = async()=>{
            dispatch(spinner.showSpinner());
            if(route.params.symbol === "BTC") {
                const {data} = await Axios.get("/api/henesis/btc/balance");
                setAmountFromDB(data.balance)
                setFromAddr(data.address)
            } else {
                const {data} = await Axios.get("/api/henesis/eth/balance",{params:{symbol:route.params.symbol}});
                setAmountFromDB(data.balance)
                setFromAddr(data.address)
            }
            dispatch(spinner.hideSpinner());
        }
        defaultSetting();
    },[]);

    const calcAmount = (_amount)=>{
        if(route.params.symbol === "BTC") {
            setInputAmount(String(Number(amount).toFixed(8)))
        } else {
            if(amount !== 0 && type !== 0) {
                const _calcRst = (amount-totalGasFee.current).toFixed(6);
                if(_calcRst>0) setInputAmount(String(_calcRst))
            }
        }
    }

    const onPercentPress = (num)=>{
        if(num !== type) {
            setAmount(String(amountFromDB * num / 100));
            setType(num);
        } else {
            setType(0)
        }
    }
    useEffect(()=>{
        if(type !== 0) {
            calcAmount();
        }
    },[type])

    const selectBg = (num)=>{
        return num === type ? {backgroundColor:"#8D3981",borderColor:"#8D3981"} : {backgroundColor:"#FFFFFF",borderColor:"#E5E5E5"}
    }
    const selectText = (num)=>{
        return num === type ? {color:"#FFFFFF"} : {color:"#707070"}
    }
    const onConfirm = ()=>{
        if(inputAmount === "") {
            setAmountError({text:"* 수량을 입력해주세요.",color:"#EE1818"});
        } else if(route.params.symbol === "ETH" && inputAmount+totalGasFee>amountFromDB){
            setAmountError({text:"* 잔액이 부족합니다.",color:"#EE1818"});
        } else if(route.params.symbol === "MVC" && inputAmount>amountFromDB) {
            setAmountError({text:"* 수량이 부족합니다.",color:"#EE1818"});
        } else if(route.params.symbol === "BTC" && inputAmount>amountFromDB){
            setAmountError({text:"* 수량이 부족합니다.",color:"#EE1818"});
        } else if(address === "" || verifiedAddr === false) {
            setAddressError({text:"* 주소가 유효하지 않습니다.",color:"#EE1818"});
        } else {
            setModal(!modal)
        }
    }
    const onSendToken = async()=>{
        let _flag = false;
        if(route.params.symbol !== "BTC") {
            const {data} = await Axios.post("/api/henesis/eth/transfer",{
                symbol:route.params.symbol,
                toAddr:address,
                gasPrice:String(gasprice.current),
                gasLimit:String(gasLimit.current),
                amount:String(inputAmount)
            });
            data.result === "success" ? _flag = true : null; 
        } else {
            const {data} = await Axios.post("/api/henesis/btc/transfer",{
                symbol:route.params.symbol,
                toAddr:address,
                fromAddr:fromAddr,
                amount:String(inputAmount)
            });
            data.result === "success" ? _flag = true : null; 
        }
        
        if(_flag) {
            setModal(!modal);
            navigation.navigate("WalletResult",{amount:inputAmount,symbol:route.params.symbol});
        } else {
            alert("오류로 인해 전송이 취소되었습니다.")
        }
    }

    const onVerifiedAddr = async(_addr)=>{
        const p_addr = _addr === undefined ? address : _addr
        setAddressError({text:"-",color:"#FFFFFF"})
        if(route.params.symbol === "BTC") {
            const {data} = await Axios.get("/api/henesis/btc/verified",{params:{address:p_addr}});
            if(data.result === "success") setVerifiedAddr(true);
            else setAddressError({text:"* 주소가 유효하지 않습니다.",color:"#EE1818"})
        } else {
            const {data} = await Axios.get("/api/henesis/eth/verified",{params:{address:p_addr}});
            if(data.result === "success") setVerifiedAddr(true);
            else setAddressError({text:"* 주소가 유효하지 않습니다.",color:"#EE1818"})
        }
    }

    useEffect(()=>{
        setVerifiedAddr(false);
    },[address]);

    useEffect(()=>{
        setAmountError({text:"* -",color:"#FFFFFF"})
    },[inputAmount]);

    const rederETHFees = useCallback(()=>{
        return (
            <EthFees symbol={route.params.symbol} toGasFee={({total,limit,price})=>{
                totalGasFee.current = total;
                gasLimit.current = limit;
                gasprice.current = price;
                calcAmount()
            }}/>
        )
    },[amount,type])


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
                        <ExtraBoldText text={`${route.params.symbol} 출금`} customStyle={{fontSize:16}}/>
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
                                <BoldText text={"금액입력"}/>
                                <View style={[styles.boxWrap,{flexDirection:"row",justifyContent:"space-between",alignItems:"center"}]}>
                                    <View>
                                        <TextInput placeholderTextColor={"#D5C2D3"} placeholder={"금액을 입력해주세요"} style={[styles.input,{maxWidth:250}]} value={inputAmount} onChangeText={(text)=>{
                                            if(type !== 0) setType(0)
                                            setInputAmount(text)
                                        }}/>
                                    </View>
                                    <BoldText text={route.params.symbol}/>
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
                                    <BoldText text={"주소 입력"}/>
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
                                    <TextInput placeholderTextColor={"#D5C2D3"} placeholder={"주소를 입력해주세요"} style={styles.input} value={address} onBlur={()=>onVerifiedAddr()} onChangeText={(text)=>setAddress(text)}/>
                                </View>
                                <BoldText text={addressError.text} customStyle={{color:addressError.color,fontSize:10,marginTop:8}}/>
                            </View>
                            <View style={[styles.item,{marginTop:16}]}>
                                {
                                    route.params.symbol === "BTC" ? 
                                        <BtcFees />
                                    :
                                        rederETHFees()
                                }
                            </View>
                        </View>
                    </View>
                </ScrollView>
                <TouchableWithoutFeedback onPress={onConfirm}>
                    <View style={{height:50,backgroundColor:"#8D3981",justifyContent:"center",alignItems:"center"}}>
                        <BoldText text={"전송하기"} customStyle={{color:"#FFFFFF",fontSize:16}}/>
                    </View>
                </TouchableWithoutFeedback>
                <Modal isVisible={modal} backdropTransitionOutTiming={0} style={{margin: 0,justifyContent:"center",alignItems:"center"}} useNativeDriver={true}>
                    <View style={{backgroundColor:"#FFFFFF",width:308,height:508,borderRadius:6,overflow:"hidden",justifyContent:"space-between"}}>
                        <View style={{paddingHorizontal:16,paddingVertical:20}}>
                            <BoldText text={"* 거래 전 아래 내용을 한번 더 확인해 주세요"}/>
                            <View style={{marginTop:20,borderWidth:1,borderColor:"#F2F2F2",marginBottom:10}} />
                            <View style={styles.modalItemGap}>
                                <BoldText text={"출금 수량"}/>
                                <View style={styles.modalItemBox}>
                                    <BoldText text={`${inputAmount} ${route.params.symbol}`} customStyle={styles.modalItemText}/>
                                </View>
                            </View>
                            {
                                route.params.symbol !== "BTC" ?
                                    <View style={styles.modalItemGap}>
                                        <BoldText text={"전송 수수료"}/>
                                        <View style={styles.modalItemBox}>
                                            <BoldText text={`${totalGasFee.current} ETH`} customStyle={styles.modalItemText}/>
                                        </View>
                                    </View>
                                :
                                    null
                            }
                            <View style={styles.modalItemGap}>
                                <BoldText text={"보낸 사람"}/>
                                <View style={styles.modalItemBox}>
                                    <BoldText text={fromAddr} customStyle={[styles.modalItemText,{lineHeight:18}]}/>
                                </View>
                            </View>
                            <View style={styles.modalItemGap}>
                                <BoldText text={"받는 사람"}/>
                                <View style={styles.modalItemBox}>
                                    <BoldText text={address} customStyle={[styles.modalItemText,{lineHeight:18}]}/>
                                </View>
                            </View>
                        </View>
                        <View style={{flexDirection:'row',height:46}}>
                            <TouchableWithoutFeedback onPress={()=>setModal(!modal)}>
                                <View style={[styles.modalBottomBtn,{backgroundColor:"#EBEBEB"}]}>
                                    <BoldText text={"취소"} customStyle={{color:"#8B8B8B",fontSize:14}}/>
                                </View>
                            </TouchableWithoutFeedback>
                            
                            <TouchableWithoutFeedback onPress={onSendToken}>
                                <View style={[styles.modalBottomBtn,{backgroundColor:"#8D3981"}]}>
                                    <BoldText text={"확인"} customStyle={{color:"#FFFFFF",fontSize:14}}/>
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
        justifyContent:"center",
        alignItems:"center"
    }
});