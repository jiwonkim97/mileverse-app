import React, { useEffect, useState,useRef } from 'react';
import { Image,View,Alert,SafeAreaView,StyleSheet,FlatList,TouchableWithoutFeedback,useWindowDimensions,Animated,TouchableOpacity } from 'react-native';
import Axios from '../modules/Axios';
import { RegularText, BoldText,ExtraBoldText } from '../components/customComponents';
import CommonStatusbar from '../components/CommonStatusbar';
import Modal from 'react-native-modal';
import RNPickerSelect from 'react-native-picker-select';
import moment from "moment";
import {useFocusEffect} from '@react-navigation/native';

const WalletDetailOnBtc = ({navigation,route}) =>{
    const [page,setPage] = useState(0);
    const [nextPage,setNextPage] = useState(false);
    const [data,setData] = useState([]);
    const [count,setCount] = useState(0);
    const [modal,setModal] = useState(false);
    const [type,setType] = useState("ALL"); 
    const dimentionHeight = useWindowDimensions().height;
    const [listHeight,setListHeight] = useState(dimentionHeight-388.6);
    const [toggle,setToggle] = useState(false)
    const animatedController = useRef(new Animated.Value(0)).current;
    const bodyHeight = animatedController.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 113.3],
    });
    const mode = useRef("");
    const [fromStringDate, setFromStringDate] = useState("");
    const [toStringDate, setToStringDate] = useState("");
    const fromYear = useRef("");
    const fromMonth = useRef("");
    const fromDay = useRef("");
    const toYear = useRef("");
    const toMonth = useRef("");
    const toDay = useRef("");
    const prevYear = useRef(0);
    const prevMonth = useRef(0);
    const prevDay = useRef(0);
    const [fake,setFake] = useState(true);
    const thisYear = new Date().getFullYear();
    const [yearArr,setYearArr] = useState(()=>{
        const _arr = []
        for(let i = thisYear-2 ; i<=thisYear+2;i++ ){
            _arr.push({label:String(i),value:i})
        }
        return _arr;
    });
    const [monthArr,setMonthArr] = useState(()=>{
        const _arr = []
        for(let i = 1 ; i<=12;i++ ){
            _arr.push({label:String(i),value:i})
        }
        return _arr;
    });
    const [dayArr,setDayArr] = useState([]);
    const [symbol,setSymbol] = useState("");
    const [balance,setBalance] = useState("");
    const [amount,setAmount] = useState("");
    const toggleFilter = () =>{
        if(toggle) {
            Animated.timing(animatedController,{
                duration:200,
                toValue:0,
                useNativeDriver:false
            }).start();
            setListHeight(dimentionHeight-388.6)
        } else {
            Animated.timing(animatedController,{
                duration:200,
                toValue:1,
                useNativeDriver:false
            }).start()
            setListHeight(dimentionHeight-501.8)
        }
        setToggle(!toggle)
    }

    const renderItem = low =>{
        const {item} = low
        let _lastItem = {};
        if(count-1 === low.index) {
            _lastItem = {borderBottomWidth:0}
        }
        if(item.BTC_TYPE === 'DEPOSIT') {
            return (
                <TouchableWithoutFeedback key={low.index} onPress={()=>navigation.navigate("WalletReceipt",{
                    trTime:dateFormatByUnixTime(item.BTC_TIME),symbol:"BTC",amount:parseFloat(commaFormat(changeBtc(item.BTC_AMOUNT))),fromAddr:item.BTC_FROM,toAddr:item.BTC_TO||item.BTC_RECV,hash:item.BTC_HASH,member:item.BTC_MEMBER})} 
                     >
                    <View style={[styles.listRowWrap,_lastItem]}>
                        <View>
                            <BoldText text={item.BTC_FROM!==null?implyAddr(item.BTC_FROM):"외부 지갑"} customStyle={{color:"#707070",fontSize:12}}/>
                            <BoldText text={dateFormatByUnixTime(item.BTC_TIME)} customStyle={{color:"#707070",fontSize:12,marginTop:6}}/>
                        </View>
                        <View>
                            <BoldText text={`+ ${parseFloat(commaFormat(changeBtc(item.BTC_AMOUNT)))} BTC`} customStyle={{color:"#021AEE",fontSize:12}}/>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            );
        } else {
            return (
                <TouchableWithoutFeedback key={low.index} onPress={()=>navigation.navigate("WalletReceipt",{
                    trTime:dateFormatByUnixTime(item.BTC_TIME),symbol:"BTC",amount:parseFloat(commaFormat(changeBtc(item.BTC_AMOUNT))),fromAddr:item.BTC_FROM,toAddr:item.BTC_TO,hash:item.BTC_HASH,member:item.BTC_MEMBER})}
                    >
                    <View style={[styles.listRowWrap,_lastItem]}>
                        <View>
                            <BoldText text={implyAddr(item.BTC_TO)} customStyle={{color:"#707070",fontSize:12}}/>
                            <BoldText text={dateFormatByUnixTime(item.BTC_TIME)} customStyle={{color:"#707070",fontSize:12,marginTop:6}}/>
                        </View>
                        <View>
                            <BoldText text={`- ${parseFloat(commaFormat(changeBtc(item.BTC_AMOUNT)))} BTC`} customStyle={{color:"#EE1818",fontSize:12}}/>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            );
        }
    }
    const dateFormatByUnixTime = (unix) =>{
        const _date = new Date(Number(unix));
        return `${_date.getFullYear()}-${addZero(_date.getMonth()+1)}-${addZero(_date.getDate())} ${addZero(_date.getHours())}:${addZero(_date.getMinutes())}:${addZero(_date.getSeconds())}`
    }
    const changeBtc = (num)=>{
        return Number(parseInt(num, 16) * 0.00000001).toFixed(8)
    }
    const implyAddr = (addr)=>{
        return `${addr.slice(0,10)}....${addr.slice(-10)}`
    }
    const commaFormat = (num)=>{
        const parts = String(num).split(".")
        return parts[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") +(parts[1] ? "."+parts[1] : "");
    }

    useFocusEffect(
        React.useCallback(() => {
            const setCardData = async()=>{
                const {data} = await Axios.get("/api/henesis/btc/balance")
                if(data.result === "success") {
                    setBalance(commaFormat(String(data.btc.balance)));
                    setAmount(commaFormat(parseFloat(String(Number(data.btc.amount).toFixed(8)))));
                }
            }
            setType("ALL")
            setSymbol(route.params.symbol)
            setCardData();
            updateDateByBtn('1w')
        }, [])
    );

    useEffect(()=>{
        getHistory();
    },[type])

    const updateDateByBtn = (term) =>{
        const date = new Date();
        toYear.current = date.getFullYear();
        toMonth.current = date.getMonth()+1;
        toDay.current = date.getDate();
        if(term === '1w') {
            date.setDate(date.getDate() - 7)
        } else if(term === '1m') {
            date.setMonth(date.getMonth() -1);
        } else if(term === '3m') {
            date.setMonth(date.getMonth() -3);
        } else if(term === '6m') {
            date.setMonth(date.getMonth() -6);
        }
        fromYear.current = date.getFullYear();
        fromMonth.current = date.getMonth()+1;
        fromDay.current = date.getDate();
        setDateBox();
    }
    const setDateBox = (_target) =>{
        const {formatedToDate,formatedFromDate} = getFormatDate();
        if(_target === "from") {
            setFromStringDate(formatedFromDate)
        } else if(_target === "to") {
            setToStringDate(formatedToDate);
        } else {
            setToStringDate(formatedToDate);
            setFromStringDate(formatedFromDate)
        }
        getHistory();
    }
    const addZero = (_num)=>{
        return parseInt(_num, 10) < 10 ? "0" + _num : _num;
    }
    const getFormatDate = ()=>{
        return {
            formatedToDate : toYear.current+"-"+addZero(toMonth.current)+"-"+addZero(toDay.current),
            formatedFromDate : fromYear.current+"-"+addZero(fromMonth.current)+"-"+addZero(fromDay.current)
        }
    }
    const getUnixTime = ({formatedToDate,formatedFromDate})=>{
        return {
            unixToDate:Number(moment(`${formatedToDate} 23:59:59`).unix()*1000),
            unixFromDate:Number(moment(`${formatedFromDate} 00:00:00`).unix()*1000)
        }
    }
    const getHistory = async()=>{
        const {unixToDate,unixFromDate} =getUnixTime(getFormatDate());
        const {data:low} = await Axios.get('/api/henesis/btc/history',{params:{start:unixFromDate,end:unixToDate,type:type}});
        if(low.result === "success") {
            setCount(low.history.length);
            setData(low.history);
        } else {
            alert("사용기록을 불러오는데 실패했습니다.")
        }
    }
    const openDateModal = (when)=>{
        prevYear.current = 0;
        prevMonth.current = 0;
        prevDay.current = 0;
        mode.current = when
        let dd = 31;
        if(when === "from") {
            dd = new Date(fromYear.current,fromMonth.current,0).getDate();
        } else if (when === "to") {
            dd = new Date(toYear.current,toMonth.current,0).getDate();
        }
        setDayArr(()=>{
            const _arr = []
            for(let i = 1 ; i <=dd; i++) {
                _arr.push({label:String(i),value:i});
            }
            return _arr;
        })
        setModal(!modal)
    }
    const emptyComponent = ()=>(
        <View style={[styles.listRowWrap,{borderBottomWidth:0}]}>
            <BoldText text={"조회된 내역이 없습니다."} customStyle={{color:"#707070"}}/>
        </View>
    )
    return (
        <>
            <CommonStatusbar backgroundColor="#F9F9F9"/>
            <SafeAreaView style={{backgroundColor:"#FFFFFF",flex:1}}>
                <View style={[styles.header,styles.shadow]}>
                    <View style={{width:50}}></View>
                    <View style={[styles.headerIcoWrap,{flex:1}]}>
                        <ExtraBoldText text={route.params.header} customStyle={{fontSize:16}}/>
                    </View>
                    <TouchableOpacity onPress={()=>navigation.navigate("Wallet")}>
                        <View style={styles.headerIcoWrap}>
                            <Image source={require("../../assets/img/ico_close_bl.png")} style={{width:20,height:20}}/>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{paddingHorizontal:16}}>
                    <View style={[styles.shadow,{borderRadius:12,backgroundColor:"#FFFFFF",marginTop:16}]}>
                        <View style={{paddingVertical:36,justifyContent:"center",alignItems:"center"}}>
                            <ExtraBoldText text={`${amount} ${symbol}`} customStyle={{fontSize:16}}/>
                            <BoldText text={`${balance} KRW`} customStyle={{color:"#707070",fontSize:10,marginTop:6}}/>
                        </View>
                            <View style={{height:50,borderTopWidth:2,borderTopColor:"#F2F2F2",flexDirection:"row"}}>
                                <TouchableWithoutFeedback onPress={()=>navigation.navigate("WalletDeposit",{symbol:symbol})}>
                                    <View style={{flex:1,justifyContent:"center",alignItems:"center",borderRightWidth:1,borderRightColor:"#F2F2F2"}}>
                                        <BoldText text={"입금"} customStyle={{fontSize:14}}/>
                                    </View>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={()=>navigation.navigate("WalletWithDraw",{symbol:symbol})}>
                                    <View style={{flex:1,justifyContent:"center",alignItems:"center",borderLeftWidth:1,borderLeftColor:"#F2F2F2"}}>
                                        <BoldText text={"출금"} customStyle={{fontSize:14}}/>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                    </View>
                    <View style={[styles.shadow,styles.contentsCard]}>
                        <View style={{paddingHorizontal:16,paddingTop:16,flexDirection:"row",justifyContent:"space-between"}}>
                            <TouchableWithoutFeedback onPress={()=>{setType("ALL")}}>
                            <View style={[styles.typeBtn,{borderBottomColor:type==="ALL"?"#8D3981":"white"}]}>
                                    <BoldText text={"전체"} customStyle={{fontSize:14}}/>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={()=>{setType("DEPOSIT")}}>
                            <View style={[styles.typeBtn,{borderBottomColor:type==="DEPOSIT"?"#8D3981":"white"}]}>
                                    <BoldText text={"입금"} customStyle={{fontSize:14}}/>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={()=>{setType("WITHDRAW")}}>
                                <View style={[styles.typeBtn,{borderBottomColor:type==="WITHDRAW"?"#8D3981":"white"}]}>
                                    <BoldText text={"출금"} customStyle={{fontSize:14}}/>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                        <View style={[styles.countResultWrap]}>
                            <View style={{flexDirection:"row"}}>
                                <RegularText text={"총 "} customStyle={{color:"#6B6B6B"}}/>
                                <RegularText text={count} customStyle={{color:"#8D3981"}}/>
                                <RegularText text={"건의 조회결과 입니다."} customStyle={{color:"#6B6B6B"}}/>
                            </View>
                            <TouchableWithoutFeedback onPress={toggleFilter}>
                                <Image source={require('../../assets/img/ico_filter.png')} style={{resizeMode:'contain',height:24,width:24}} />
                            </TouchableWithoutFeedback>
                        </View>
                        <Animated.View style={{height:bodyHeight,overflow:"hidden"}}>
                            <View style={{flexDirection:'row',justifyContent:"space-between",padding:10}}>
                                <TouchableWithoutFeedback onPress={()=>{updateDateByBtn('1w')}}>
                                    <View style={styles.simpleDateBtn}>
                                        <BoldText text={"1주일"} customStyle={{color:"#6B6B6B"}}/>
                                    </View>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={()=>{updateDateByBtn('1m')}}>
                                <View style={styles.simpleDateBtn}>
                                        <BoldText text={"1개월"} customStyle={{color:"#6B6B6B"}}/>
                                    </View>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={()=>{updateDateByBtn('3m')}}>
                                <View style={styles.simpleDateBtn}>
                                        <BoldText text={"3개월"} customStyle={{color:"#6B6B6B"}}/>
                                    </View>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={()=>{updateDateByBtn('6m')}}>
                                    <View style={styles.simpleDateBtn}>
                                        <BoldText text={"6개월"} customStyle={{color:"#6B6B6B"}}/>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                            <View style={{flexDirection:"row",justifyContent:"space-between",paddingHorizontal:10}}>
                                <TouchableWithoutFeedback onPress={()=>openDateModal('from')}>
                                    <View style={[styles.dateBoxWrap]}>
                                        <BoldText text={fromStringDate} customStyle={{color:"#9E9E9E"}}/>
                                    </View>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={()=>openDateModal('to')}>
                                <View style={[styles.dateBoxWrap]}>
                                        <BoldText text={toStringDate} customStyle={{color:"#9E9E9E"}}/>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        </Animated.View>
                        <FlatList
                            data={data}
                            renderItem={renderItem}
                            keyExtractor={(item) =>item.CREA_DT}
                            style={{flexGrow:0,maxHeight:listHeight,backgroundColor:"#FFFFFF",borderBottomRightRadius:10,borderBottomLeftRadius:10}}
                            ListEmptyComponent={emptyComponent}
                            onEndReached={()=>{}}
                        />
                    </View>
                </View>
                <Modal isVisible={modal} backdropTransitionOutTiming={0} style={{margin: 0}} useNativeDriver={true}>
                    <View style={{justifyContent:"center",alignItems:"center"}}>
                        <View style={{backgroundColor:"#FFFFFF",paddingVertical:16,borderRadius:10,width:"97%",alignItems:"center"}}>
                            <View style={{flexDirection:"row",justifyContent:"center"}}>
                                <View style={[styles.datePickerWrap]}>
                                    <RNPickerSelect
                                        onValueChange={(value) => {
                                            prevYear.current = mode.current === "to" ? toYear.current : fromYear.current;
                                            mode.current === "to" ? toYear.current = value : fromYear.current = value;
                                            setFake(!fake);
                                        }}
                                        value={mode.current === "to" ? toYear.current : fromYear.current}
                                        placeholder={{}}
                                        doneText={"완료"}
                                        style={{inputIOS:{paddingLeft:10,height:'100%'}}}
                                        items={yearArr}
                                    />
                                </View>
                                <View style={[styles.datePickerWrap,{marginLeft:4}]}>
                                    <RNPickerSelect
                                        onValueChange={(value) => {
                                            prevMonth.current = mode.current === "to" ? toMonth.current : fromMonth.current;
                                            mode.current === "to" ? toMonth.current=value : fromMonth.current=value
                                            setDayArr(()=>{
                                                const _arr = []
                                                const dd = new Date(fromYear.current,value,0).getDate();
                                                for(let i = 1 ; i <=dd; i++) {
                                                    _arr.push({label:String(i),value:i});
                                                }
                                                return _arr;
                                            })
                                        }}
                                        value={mode.current === "to" ? toMonth.current : fromMonth.current}
                                        placeholder={{}}
                                        doneText={"완료"}
                                        style={{inputIOS:{paddingLeft:10,height:'100%'}}}
                                        items={monthArr}
                                    />
                                </View>
                                <View style={[styles.datePickerWrap,{marginLeft:4}]}>
                                    <RNPickerSelect
                                        onValueChange={(value) => {
                                            prevDay.current = mode.current === "to" ? toDay.current : fromDay.current;
                                            mode.current === "to" ? toDay.current=value : fromDay.current=value
                                            setFake(!fake)
                                        }}
                                        value={mode.current === "to" ? toDay.current : fromDay.current}
                                        placeholder={{}}
                                        doneText={"완료"}
                                        style={{inputIOS:{paddingLeft:10,height:'100%'}}}
                                        items={dayArr}
                                    />
                                </View>
                            </View>
                            <View style={{width:'100%',paddingHorizontal:16}}>
                                <View style={{marginTop:24,flexDirection:"row",justifyContent:"flex-end",alignItems:"center"}}>
                                    <TouchableWithoutFeedback onPress={()=>{
                                        setModal(!modal);
                                        setTimeout(()=>{
                                            const _year = prevYear.current;
                                            const _month = prevMonth.current;
                                            const _day = prevDay.current;
                                            _year !== 0 ? mode.current === "to" ? toYear.current = _year : fromYear.current = _year : null;
                                            _month !== 0 ? mode.current === "to" ? toMonth.current = _month : fromMonth.current = _month : null;
                                            _day !== 0 ? mode.current === "to" ? toDay.current = _day : fromDay.current = _day : null;    
                                        },500)
                                    }}>
                                        <View style={{height:20,justifyContent:"center"}}>
                                            <BoldText text={"취소"} customStyle={{color:"#9E9E9E"}}/>
                                        </View>
                                    </TouchableWithoutFeedback>
                                    <TouchableWithoutFeedback onPress={()=>{
                                        const {formatedToDate,formatedFromDate} = getFormatDate();
                                        const _from = new Date(formatedFromDate).getTime();
                                        const _to = new Date(formatedToDate).getTime();
                                        if (_from > _to) {
                                            Alert.alert("알림",
                                            "시작일이 종료일보다 클 수 없습니다.",
                                            [{text:"확인"}])
                                        } else {
                                            setDateBox(mode.current);
                                            setModal(!modal);
                                        }
                                    }}>
                                        <View style={{height:20,justifyContent:"center"}}>
                                            <BoldText text={"확인"} customStyle={{color:"#8D3981",marginLeft:38}}/>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        </>
        
    )
}
export default WalletDetailOnBtc;

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
    contentsCard:{
        marginTop:16,
        backgroundColor:"#FFFFFF",
        borderRadius:10
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
    simpleDateBtn:{
        justifyContent:"center",
        alignItems:"center",
        paddingVertical:10,
        borderColor:"#D4D4D4",
        borderWidth:1,
        borderRadius:4,
        width:"24%"
    },
    countResultWrap:{
        backgroundColor:"#F7F7F7",
        padding:16,
        flexDirection:'row',
        alignItems:"center",
        justifyContent:"space-between"
    },
    typeBtn:{
        width:"25%",
        borderBottomWidth:2,
        justifyContent:"center",
        alignItems:"center",
        paddingBottom:16
    },
    datePickerWrap:{
        backgroundColor:"#F7F7F7",
        height:40,
        width:100,
        borderRadius:8,
        alignItems:"center",
        justifyContent:"center"
    },
    dateBoxWrap:{
        backgroundColor:"#F7F7F7",
        paddingVertical:15,
        paddingLeft:15,
        width:"49%",
        borderRadius:8
    },
    listRowWrap:{
        flexDirection:'row',
        padding:16,
        borderBottomWidth:1,
        borderColor:"#E5E5E5",
        justifyContent:"space-between",
        alignItems:"center"
    },
    listIconWrap:{
        justifyContent:"center",
        alignItems:"flex-end",
        flex:1
    }
});