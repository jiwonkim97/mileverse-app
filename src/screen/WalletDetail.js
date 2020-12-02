import React, { useEffect, useState,useRef } from 'react';
import { Image,View,Alert,SafeAreaView,StyleSheet,FlatList,TouchableWithoutFeedback,useWindowDimensions,Animated } from 'react-native';
import { useSelector } from 'react-redux';
import Axios from '../modules/Axios';
import { RegularText, BoldText,ExtraBoldText } from '../components/customComponents';
import CommonStatusbar from '../components/CommonStatusbar';
import Modal from 'react-native-modal';
import RNPickerSelect from 'react-native-picker-select';


const WalletDetail = ({navigation,route}) =>{
    const stat = useSelector(state => state.authentication.status.isLoggedIn);
    const mvp = useSelector(state => state.authentication.userInfo.mvp.toString().replace(/\B(?=(\d{3})+(?!\d))/g,","));
    const name = useSelector(state => state.authentication.userInfo.currentUser);
    const [data,setData] = useState([]);
    const [count,setCount] = useState(0);
    const [modal,setModal] = useState(false);
    const [type,setType] = useState("all"); 
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

    const renderItem = item =>{
        let _item = item.item
        if(_item.C_CODE === 'D1') {
            return (
                <TouchableWithoutFeedback onPress={()=>navigation.navigate("WalletReceipt")}>
                    <View style={[styles.listRowWrap]}>
                        <View>
                            <BoldText text={"01x123123....123"} customStyle={{color:"#707070",fontSize:12}}/>
                            <BoldText text={_item.CREA_DT} customStyle={{color:"#707070",fontSize:12,marginTop:6}}/>
                        </View>
                        <View>
                            <BoldText text={"+ 100,000 MVC"} customStyle={{color:"#021AEE",fontSize:12}}/>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            );
        } else {
            return (
                <TouchableWithoutFeedback onPress={()=>navigation.navigate("WalletReceipt")}>
                    <View style={[styles.listRowWrap]}>
                        <View>
                            <BoldText text={"01x123123....456"} customStyle={{color:"#707070",fontSize:12}}/>
                            <BoldText text={_item.CREA_DT} customStyle={{color:"#707070",fontSize:12,marginTop:6}}/>
                        </View>
                        <View>
                            <BoldText text={"- 100,000 MVC"} customStyle={{color:"#EE1818",fontSize:12}}/>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            );
        }
    }

    useEffect(()=>{
        updateDateByBtn('1w')
    },[])
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
    const getFormatDate = ()=>{
        const addZero = (_num)=>{
            return parseInt(_num, 10) < 10 ? "0" + _num : _num;
        }
        return {
            formatedToDate : toYear.current+"-"+addZero(toMonth.current)+"-"+addZero(toDay.current),
            formatedFromDate : fromYear.current+"-"+addZero(fromMonth.current)+"-"+addZero(fromDay.current)
        }
    }
    const getHistory = ()=>{
        const {formatedToDate,formatedFromDate} = getFormatDate();
        if(stat){
            Axios.post('/api/point/filtered-history',{start:formatedFromDate,end:formatedToDate,type:type})
            .then((response)=>{
                var _response = response.data
                if(_response.result === "success") {
                    setData(_response.data);
                    setCount(_response.data.length)
                } else {
                    alert("사용기록을 불러오는데 실패했습니다.")
                }
            }).catch((error)=>{
                alert("사용기록을 불러오는데 실패했습니다.")
            });
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
    return (
        <>
            <CommonStatusbar backgroundColor="#F9F9F9"/>
            <SafeAreaView>
                <View style={[styles.shodow,styles.header]}>
                    <ExtraBoldText text={route.params.header} customStyle={{fontSize:16}} />
                    <TouchableWithoutFeedback onPress={()=>navigation.navigate("Wallet")}>
                        <Image source={require("../../assets/img/ico_close_bl.png")} style={{width:14,height:14,position:'absolute',right:20}}/>
                    </TouchableWithoutFeedback>
                </View>
                <View style={{paddingHorizontal:16}}>
                    <View style={[styles.shodow,{borderRadius:12,backgroundColor:"#FFFFFF",marginTop:16}]}>
                        <View style={{paddingVertical:36,justifyContent:"center",alignItems:"center"}}>
                            <ExtraBoldText text={"1,000,000 BTC"} customStyle={{fontSize:16}}/>
                            <BoldText text={"1,000,000 KRW"} customStyle={{color:"#707070",fontSize:10,marginTop:6}}/>
                        </View>
                            <View style={{height:50,borderTopWidth:2,borderTopColor:"#F2F2F2",flexDirection:"row"}}>
                                <TouchableWithoutFeedback onPress={()=>navigation.navigate("WalletDeposit" )}>
                                    <View style={{flex:1,justifyContent:"center",alignItems:"center",borderRightWidth:1,borderRightColor:"#F2F2F2"}}>
                                        <BoldText text={"입금"} customStyle={{fontSize:14}}/>
                                    </View>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={()=>navigation.navigate("WalletWithDraw" )}>
                                    <View style={{flex:1,justifyContent:"center",alignItems:"center",borderLeftWidth:1,borderLeftColor:"#F2F2F2"}}>
                                        <BoldText text={"출금"} customStyle={{fontSize:14}}/>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                    </View>
                    <View style={[styles.shodow,styles.contentsCard]}>
                        <View style={{paddingHorizontal:16,paddingTop:16,flexDirection:"row",justifyContent:"space-between"}}>
                            <TouchableWithoutFeedback onPress={()=>{setType("all")}}>
                            <View style={[styles.typeBtn,{borderBottomColor:type==="all"?"#8D3981":"white"}]}>
                                    <BoldText text={"전체"} customStyle={{fontSize:14}}/>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={()=>{setType("use")}}>
                            <View style={[styles.typeBtn,{borderBottomColor:type==="use"?"#8D3981":"white"}]}>
                                    <BoldText text={"입금"} customStyle={{fontSize:14}}/>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={()=>{setType("change")}}>
                                <View style={[styles.typeBtn,{borderBottomColor:type==="change"?"#8D3981":"white"}]}>
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
                        <Animated.View style={{height:bodyHeight}}>
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
                            style={{flexGrow:0,maxHeight:listHeight,backgroundColor:"#FFFFFF"}}
                            onEndReached={(aa)=>{
                                console.log(aa)
                                console.log(aa)
                            }}
                        />
                    </View>
                </View>
                <Modal isVisible={modal} backdropTransitionOutTiming={0} style={{margin: 0}} useNativeDriver={true}>
                    <View style={{justifyContent:"center",alignItems:"center"}}>
                        <View style={{backgroundColor:"#FFFFFF",padding:16,borderRadius:10}}>
                            <View style={{flexDirection:"row"}}>
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
                                    <View>
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
                                    <View>
                                        <BoldText text={"확인"} customStyle={{color:"#8D3981",marginLeft:38}}/>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        </>
        
    )
}
export default WalletDetail;

const styles = StyleSheet.create({
    header:{
        backgroundColor:"white",
        height:60,
        justifyContent:'center',
        alignItems:'center'
    },
    contentsCard:{
        marginTop:16,
        backgroundColor:"#FFFFFF",
        borderRadius:10,
        overflow:"hidden"
    },
    shodow:{
        elevation:5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2.22
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
        width:110,
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
        borderColor:"#CCCCCC",
        justifyContent:"space-between",
        alignItems:"center"
    },
    listIconWrap:{
        justifyContent:"center",
        alignItems:"flex-end",
        flex:1
    }
});