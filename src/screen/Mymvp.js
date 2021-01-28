import React, { useEffect, useState,useRef } from 'react';
import { Image,View,Alert,SafeAreaView,StyleSheet,TouchableOpacity,FlatList,TouchableWithoutFeedback,useWindowDimensions,Animated} from 'react-native';
import { useSelector } from 'react-redux';
import Axios from '../modules/Axios';
import { RegularText, BoldText,ExtraBoldText } from '../components/customComponents';
import CommonStatusbar from '../components/CommonStatusbar';
import Modal from 'react-native-modal';
import RNPickerSelect from 'react-native-picker-select';
import { useTranslation } from 'react-i18next';


const MymvpScreen = (props) =>{
    const { t } = useTranslation();
    const stat = useSelector(state => state.authentication.status.isLoggedIn);
    const mvp = useSelector(state => state.authentication.userInfo.mvp.toString().replace(/\B(?=(\d{3})+(?!\d))/g,","));
    const name = useSelector(state => state.authentication.userInfo.currentUser);
    const [data,setData] = useState([]);
    const [count,setCount] = useState(0);
    const [modal,setModal] = useState(false);
    const [type,setType] = useState("all"); 
    const dimentionHeight = useWindowDimensions().height;
    const [listHeight,setListHeight] = useState(dimentionHeight-323.6);
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
            setListHeight(dimentionHeight-323.6)
        } else {
            Animated.timing(animatedController,{
                duration:200,
                toValue:1,
                useNativeDriver:false
            }).start()
            setListHeight(dimentionHeight-436.9)
        }
        setToggle(!toggle)
    }

    const commaFormat = (num)=>{
        const parts = String(num).split(".")
        return parts[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") +(parts[1] ? "."+parts[1] : "");
    }

    const renderItem = item =>{
        let _item = item.item
        let _lastItem = {};
        if(count-1 === item.index) {
            _lastItem = {borderBottomWidth:0}
        }
        if(_item.C_CODE === 'D1') {
            return (
                <View style={[styles.listRowWrap,_lastItem]} key={item.index}>
                    <View style={{flex:2}}>
                        <View style={{flexDirection:"row"}}>
                            <BoldText text={_item.CREA_DT} customStyle={{color:"#707070"}}/>
                            <BoldText customStyle={{marginLeft:20,color:"#707070"}} text={t(_item.C_NAME)}/>
                        </View>
                        <BoldText customStyle={{marginTop:8,color:"#707070"}} text={`${_item.BRD_NAME} ${commaFormat(_item.AMOUNT)} MVP`}/>
                        <BoldText text={_item.CORE} customStyle={{color:"#707070",marginTop:4}}/>
                    </View>
                    <View style={[styles.listIconWrap]}>
                        <Image source={require('../../assets/img/ico_use.png')} style={{resizeMode:"contain",height:25,width:40}} />
                    </View>
                </View>
            );
        } else {
            return (
                <View style={[styles.listRowWrap,_lastItem]} key={item.index}>
                    <View style={{flex:2}}>
                        <View style={{flexDirection:"row"}}>
                            <BoldText text={_item.CREA_DT} customStyle={{color:"#707070"}}/>
                            <BoldText customStyle={{marginLeft:20,color:"#707070"}} text={t(_item.C_NAME)}/>
                        </View>
                        <BoldText customStyle={{marginTop:8,color:"#707070"}} text={`${_item.BRD_NAME} ${_item.CORE} -> ${commaFormat(_item.AMOUNT)} MVP`} />
                    </View>
                    <View style={[styles.listIconWrap]}>
                        <Image source={require('../../assets/img/ico_change.png')} style={{resizeMode:"contain",height:28,width:40}}></Image>
                    </View>
                </View>
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
                    setCount(_response.data.length);
                    setData(_response.data);
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
    const emptyComponent = ()=>(
        <View style={[styles.listRowWrap,{borderBottomWidth:0}]}>
            <BoldText text={t("mymvp_7")} customStyle={{color:"#707070"}}/>
        </View>
    )
    return (
        <>
            <CommonStatusbar backgroundColor="#F9F9F9"/>
            <SafeAreaView style={{backgroundColor:"#FFFFFF",flex:1}}>
                <View style={[styles.header,styles.shadow]}>
                    <View style={{width:50}}></View>
                    <View style={[styles.headerIcoWrap,{flex:1}]}>
                        <ExtraBoldText text={t('menu_4')} customStyle={{fontSize:16}}/>
                    </View>
                    <TouchableOpacity onPress={()=>props.navigation.goBack()}>
                        <View style={styles.headerIcoWrap}>
                            <Image source={require("../../assets/img/ico_close_bl.png")} style={{width:20,height:20}}/>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{paddingHorizontal:16}}>
                    <View style={[styles.shadow,styles.headerCard]}>
                        <BoldText text={name+t("main_23")} customStyle={{fontSize:15}}/>
                        <View style={{marginTop:8,flexDirection:"row"}}>
                            <ExtraBoldText text={mvp+" MVP"} customStyle={{color:"#8D3981",fontSize:20}}/>
                        </View>
                    </View>
                    <View style={[styles.shadow,styles.contentsCard]}>
                        <View style={{paddingHorizontal:16,paddingTop:16,flexDirection:"row",justifyContent:"space-between"}}>
                            <TouchableWithoutFeedback onPress={()=>{setType("all")}}>
                            <View style={[styles.typeBtn,{borderBottomColor:type==="all"?"#8D3981":"white"}]}>
                                    <BoldText text={t('mymvp_5')} customStyle={{fontSize:14}}/>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={()=>{setType("use")}}>
                            <View style={[styles.typeBtn,{borderBottomColor:type==="use"?"#8D3981":"white"}]}>
                                    <BoldText text={t('mymvp_2')} customStyle={{fontSize:14}}/>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={()=>{setType("change")}}>
                                <View style={[styles.typeBtn,{borderBottomColor:type==="change"?"#8D3981":"white"}]}>
                                    <BoldText text={t('mymvp_3')} customStyle={{fontSize:14}}/>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                        <View style={[styles.countResultWrap]}>
                            <View style={{flexDirection:"row"}}>
                                <RegularText text={count} customStyle={{color:"#8D3981"}}/>
                                <RegularText text={t("mymvp_6")} customStyle={{color:"#6B6B6B"}}/>
                            </View>
                            <TouchableWithoutFeedback onPress={toggleFilter}>
                                <Image source={require('../../assets/img/ico_filter.png')} style={{resizeMode:'contain',height:24,width:24}} />
                            </TouchableWithoutFeedback>
                        </View>
                        <Animated.View style={{height:bodyHeight,overflow:'hidden'}}>
                            <View style={{flexDirection:'row',justifyContent:"space-between",padding:10}}>
                                <TouchableWithoutFeedback onPress={()=>{updateDateByBtn('1w')}}>
                                    <View style={styles.simpleDateBtn}>
                                        <BoldText text={t('mymvp_8')} customStyle={{color:"#6B6B6B"}}/>
                                    </View>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={()=>{updateDateByBtn('1m')}}>
                                <View style={styles.simpleDateBtn}>
                                        <BoldText text={t("mymvp_9")} customStyle={{color:"#6B6B6B"}}/>
                                    </View>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={()=>{updateDateByBtn('3m')}}>
                                <View style={styles.simpleDateBtn}>
                                        <BoldText text={t("mymvp_10")} customStyle={{color:"#6B6B6B"}}/>
                                    </View>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={()=>{updateDateByBtn('6m')}}>
                                    <View style={styles.simpleDateBtn}>
                                        <BoldText text={t("mymvp_11")} customStyle={{color:"#6B6B6B"}}/>
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
                            ListEmptyComponent={emptyComponent}
                            style={{flexGrow:0,maxHeight:listHeight,backgroundColor:"#FFFFFF",borderBottomRightRadius:10,borderBottomLeftRadius:10}}
                        />
                    </View>
                </View>
                <Modal isVisible={modal} backdropTransitionOutTiming={0} style={{margin: 0}} useNativeDriver={true}>
                    <View style={{justifyContent:"center",alignItems:"center"}}>
                        <View style={{backgroundColor:"#FFFFFF",paddingVertical:16,borderRadius:10,width:"97%",alignItems:"center"}}>
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
                                        doneText={t("alert_date_2")}
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
                                        doneText={t("alert_date_2")}
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
                                        doneText={t("alert_date_2")}
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
                                            <BoldText text={t("common_cancel_1")} customStyle={{color:"#9E9E9E"}}/>
                                        </View>
                                    </TouchableWithoutFeedback>
                                    <TouchableWithoutFeedback onPress={()=>{
                                        const {formatedToDate,formatedFromDate} = getFormatDate();
                                        const _from = new Date(formatedFromDate).getTime();
                                        const _to = new Date(formatedToDate).getTime();
                                        if (_from > _to) {
                                            Alert.alert(t("alert_title_1"),
                                            t("alert_date_1"),
                                            [{text:t("common_confirm_1")}])
                                        } else {
                                            setDateBox(mode.current);
                                            setModal(!modal);
                                        }
                                    }}>
                                        <View style={{height:20,justifyContent:"center"}}>
                                            <BoldText text={t("common_confirm_1")} customStyle={{color:"#8D3981",marginLeft:38}}/>
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
export default MymvpScreen;

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
    headerCard:{
        backgroundColor:"#FFFFFF",
        marginTop:16,
        borderRadius:10,
        paddingVertical:20,
        paddingLeft:16
    },
    contentsCard:{
        marginTop:16,
        backgroundColor:"#FFFFFF",
        borderRadius:10
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
        paddingVertical:16,
        paddingLeft:16,
        paddingRight:12,
        borderBottomWidth:1,
        borderColor:"#E5E5E5"
    },
    listIconWrap:{
        justifyContent:"center",
        alignItems:"flex-end",
        flex:1
    }
});