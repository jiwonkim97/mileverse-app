import React, { useEffect, useState,useRef } from 'react';
import { Image,View,Alert,SafeAreaView,StyleSheet,TouchableOpacity,FlatList,TouchableWithoutFeedback,useWindowDimensions,Animated } from 'react-native';
import { useSelector } from 'react-redux';
import Axios from '../modules/Axios';
import { RegularText, BoldText,ExtraBoldText } from '../components/customComponents';
import CommonStatusbar from '../components/CommonStatusbar';
import Modal from 'react-native-modal';
import RNPickerSelect from 'react-native-picker-select';


const MymvpScreen : () => React$Node = (props) =>{
    const stat = useSelector(state => state.authentication.status.isLoggedIn);
    const mvp = useSelector(state => state.authentication.userInfo.mvp.toString().replace(/\B(?=(\d{3})+(?!\d))/g,","));
    const name = useSelector(state => state.authentication.userInfo.currentUser);
    const [data,setData] = useState([]);
    const [modal,setModal] = useState(false);
    const [type,useType] = useState(""); 
    const dimentionHeight = useWindowDimensions().height;
    const [listHeight,setListHeight] = useState(dimentionHeight-313.6);
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

    useEffect(()=>{
        if(stat){
            Axios.post('/api/point/getHistory')
            .then((response)=>{
                var _response = response.data
                if(_response.result === "success") {
                    setData(_response.data);
                } else {
                    alert("사용기록을 불러오는데 실패했습니다.")
                }
            }).catch((error)=>{
                alert("사용기록을 불러오는데 실패했습니다.")
            });
        }
    },[mvp])

    const toggleFilter = () =>{
        if(toggle) {
            Animated.timing(animatedController,{
                duration:200,
                toValue:0,
                useNativeDriver:false
            }).start();
            setListHeight(dimentionHeight-313.6)
        } else {
            Animated.timing(animatedController,{
                duration:200,
                toValue:1,
                useNativeDriver:false
            }).start()
            setListHeight(dimentionHeight-426.9)
        }
        setToggle(!toggle)
    }

    const renderItem = item =>{
        let _item = item.item
        if(_item.C_NAME === '교환') {
            return (
                <View style={{flexDirection:'row',paddingVertical:16,paddingLeft:16,paddingRight:12,borderBottomWidth:1,borderColor:"#CCCCCC"}}>
                    <View style={{flex:2}}>
                        <View style={{flexDirection:"row"}}>
                            <BoldText text={_item.CREA_DT} customStyle={{color:"#707070"}}/>
                            <BoldText customStyle={{marginLeft:20,color:"#707070"}} text={_item.C_NAME}/>
                        </View>
                        <BoldText customStyle={{marginTop:8,color:"#707070"}} text={_item.COMP_NAME+" "+_item.COMP_AMT+ " -> "+_item.AMOUNT+" MVP"} />
                    </View>
                    <View style={{justifyContent:"center",alignItems:"flex-end",flex:1}}>
                        <Image source={require('../../assets/img/ico_change.png')} style={{resizeMode:"contain",height:28,width:40}}></Image>
                    </View>
                </View>
            );
        } else {
            return (
                <View style={{flexDirection:'row',paddingVertical:16,paddingLeft:16,paddingRight:12,borderBottomWidth:1,borderColor:"#CCCCCC"}}>
                    <View style={{flex:2}}>
                        <View style={{flexDirection:"row"}}>
                            <BoldText text={_item.CREA_DT} customStyle={{color:"#707070"}}/>
                            <BoldText customStyle={{marginLeft:20,color:"#707070"}} text={_item.C_NAME}/>
                        </View>
                        <BoldText customStyle={{marginTop:8,color:"#707070"}} text={_item.COMP_NAME +" "+_item.AMOUNT+" MVP"}/>
                        <BoldText text={_item.COMP_AMT} customStyle={{color:"#707070",marginTop:4}}/>
                    </View>
                    <View style={{justifyContent:"center",alignItems:"flex-end",flex:1}}>
                        <Image source={require('../../assets/img/ico_use.png')} style={{resizeMode:"contain",height:25,width:40}} />
                    </View>
                </View>
            );
        }
    }

    useEffect(()=>{
        updateDateByBtn('1w')
    },[])

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
        getHistory();
    }
    const setDateBox = (_target) =>{
        if(_target === "from") {
            setFromStringDate(fromYear.current+"."+fromMonth.current+"."+fromDay.current)
        } else if(_target === "to") {
            setToStringDate(toYear.current+"."+toMonth.current+"."+toDay.current);
        } else {
            setFromStringDate(fromYear.current+"."+fromMonth.current+"."+fromDay.current)
            setToStringDate(toYear.current+"."+toMonth.current+"."+toDay.current);
        }
    }
    const getHistory = ()=>{
        console.log(fromYear.current,fromMonth.current,fromDay.current)
        console.log(toYear.current,toMonth.current,toDay.current)
        console.log('get History!!')
    }
    const select = (when)=>{
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

    const asdf = ()=>{
        const _year = prevYear.current;
        const _month = prevMonth.current;
        const _day = prevDay.current;
        _year !== 0 ? mode.current === "to" ? toYear.current = _year : fromYear.current = _year : null;
        _month !== 0 ? mode.current === "to" ? toMonth.current = _month : fromMonth.current = _month : null;
        _day !== 0 ? mode.current === "to" ? toDay.current = _day : fromDay.current = _day : null;
    }

    return (
        <>
            <CommonStatusbar backgroundColor="#F9F9F9"/>
            <SafeAreaView>
                <View style={styles.header}>
                    <ExtraBoldText text={"나의 MVP"} customStyle={{color:"#707070",fontSize:16}} />
                    <TouchableOpacity onPress={()=>props.navigation.goBack()}style={{position:'absolute',top:-10,left:20}}>
                        <Image source={require('../../assets/img/ico_back.png')} style={{resizeMode:"contain", width:10}}></Image>
                    </TouchableOpacity>
                </View>
                <View style={{paddingHorizontal:16,height:"100%"}}>
                    <View style={{backgroundColor:"#fff",marginTop:16,borderRadius:10,paddingVertical:16,paddingLeft:16}}>
                        <BoldText text={name+" 님의 MVP"} customStyle={{fontSize:15}}/>
                        <View style={{marginTop:12,flexDirection:"row"}}>
                            <ExtraBoldText text={mvp+" MVP"} customStyle={{color:"#8D3981",fontSize:20}}/>
                            <ExtraBoldText text={">"} customStyle={{color:"#8D3981",fontSize:20,marginLeft:20}}/>
                        </View>
                    </View>
                    <View style={{marginTop:16,backgroundColor:"#FFFFFF",borderRadius:10,overflow:"hidden"}}>
                        <View style={{paddingLeft:16,paddingVertical:16}}>
                            <BoldText text={"사용 및 교환내역"} customStyle={{fontSize:16}}/>
                        </View>
                        <View style={{backgroundColor:"#F7F7F7",paddingHorizontal:16,paddingVertical:16,flexDirection:'row',alignItems:"center",justifyContent:"space-between"}}>
                            <View style={{flexDirection:"row"}}>
                                <RegularText text={"총 "} customStyle={{color:"#6B6B6B"}}/>
                                <RegularText text={"0"} customStyle={{color:"#8D3981"}}/>
                                <RegularText text={"건의 조회결과 입니다."} customStyle={{color:"#6B6B6B"}}/>
                            </View>
                            <TouchableWithoutFeedback onPress={toggleFilter}>
                                <Image source={require('../../assets/img/ico_filter.png')} style={{resizeMode:'contain',height:24,width:24}} />
                            </TouchableWithoutFeedback>
                        </View>
                        <Animated.View style={{height:bodyHeight}}>
                            <View style={{flexDirection:'row',justifyContent:"space-between",padding:10}}>
                                <TouchableWithoutFeedback onPress={()=>{updateDateByBtn('1w')}}>
                                    <View style={{justifyContent:"center",alignItems:"center",paddingVertical:10,borderColor:"#D4D4D4",borderWidth:1,borderRadius:4,width:"24%"}}>
                                        <BoldText text={"1주일"} customStyle={{color:"#6B6B6B"}}/>
                                    </View>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={()=>{updateDateByBtn('1m')}}>
                                    <View style={{justifyContent:"center",alignItems:"center",paddingVertical:10,borderColor:"#D4D4D4",borderWidth:1,borderRadius:4,width:"24%"}}>
                                        <BoldText text={"1개월"} customStyle={{color:"#6B6B6B"}}/>
                                    </View>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={()=>{updateDateByBtn('3m')}}>
                                    <View style={{justifyContent:"center",alignItems:"center",paddingVertical:10,borderColor:"#D4D4D4",borderWidth:1,borderRadius:4,width:"24%"}}>
                                        <BoldText text={"3개월"} customStyle={{color:"#6B6B6B"}}/>
                                    </View>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={()=>{updateDateByBtn('6m')}}>
                                    <View style={{justifyContent:"center",alignItems:"center",paddingVertical:10,borderColor:"#D4D4D4",borderWidth:1,borderRadius:4,width:"24%"}}>
                                        <BoldText text={"6개월"} customStyle={{color:"#6B6B6B"}}/>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                            <View style={{flexDirection:"row",justifyContent:"space-between",paddingHorizontal:10}}>
                                <TouchableWithoutFeedback onPress={()=>select('from')}>
                                    <View style={{backgroundColor:"#F7F7F7",paddingVertical:15,paddingLeft:15,width:"49%",borderRadius:8}}>
                                        <BoldText text={fromStringDate} customStyle={{color:"#9E9E9E"}}/>
                                    </View>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={()=>select('to')}>
                                    <View style={{backgroundColor:"#F7F7F7",paddingVertical:15,paddingLeft:15,width:"49%",borderRadius:8}}>
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
                        />
                    </View>
                </View>
                <Modal isVisible={modal} backdropTransitionOutTiming={0} style={{margin: 0}} useNativeDriver={true}>
                    <View style={{justifyContent:"center",alignItems:"center"}}>
                        <View style={{backgroundColor:"#FFFFFF",padding:16,borderRadius:10}}>
                            <View style={{flexDirection:"row"}}>
                                <View style={{backgroundColor:"#F7F7F7",height:40,width:110,borderRadius:8,alignItems:"center",justifyContent:"center"}}>
                                    <RNPickerSelect
                                        onValueChange={(value) => {
                                            prevYear.current = mode.current === "to" ? toYear.current : fromYear.current;
                                            mode.current === "to" ? toYear.current = value : fromYear.current = value;
                                            setFake(!fake);
                                        }}
                                        value={mode.current === "to" ? toYear.current : fromYear.current}
                                        placeholder={{}}
                                        doneText={"완료"}
                                        items={yearArr}
                                        itemKey={"year"}
                                    />
                                </View>
                                <View style={{backgroundColor:"#F7F7F7",height:40,width:90,borderRadius:8,alignItems:"center",justifyContent:"center",marginLeft:4}}>
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
                                        items={monthArr}
                                        itemKey={"month"}
                                    />
                                </View>
                                <View style={{backgroundColor:"#F7F7F7",height:40,width:90,borderRadius:8,alignItems:"center",justifyContent:"center",marginLeft:4}}>
                                    <RNPickerSelect
                                        onValueChange={(value) => {
                                            prevDay.current = mode.current === "to" ? toDay.current : fromDay.current;
                                            mode.current === "to" ? toDay.current=value : fromDay.current=value
                                            setFake(!fake)
                                        }}
                                        value={mode.current === "to" ? toDay.current : fromDay.current}
                                        placeholder={{}}
                                        doneText={"완료"}
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
                                    setDateBox(mode.current)
                                    setModal(!modal)
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
export default MymvpScreen;

const styles = StyleSheet.create({
    header:{
        backgroundColor:"white",
        height:60,
        justifyContent:'center',
        alignItems:'center',
        elevation:2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2.22
    },
    cardWrap:{
        borderRadius:10,
        marginTop:20,
        backgroundColor:"white",
        elevation:2, 
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2.22
    },
    myMvp:{
        alignItems:"center",
        resizeMode:"contain",
        height:220
    },
    listWrap:{
        overflow:"hidden", 
        marginTop:20,
        backgroundColor:"#FFFFFF",
        borderRadius:10,
        shadowColor:"#000",
        elevation:2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2.22
    },
    mvpCardPointText:{
        color:"#8D3981",
        fontSize:18
    }
});