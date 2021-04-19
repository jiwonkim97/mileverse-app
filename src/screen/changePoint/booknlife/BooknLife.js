import React,{useState} from 'react';
import {SafeAreaView,StyleSheet,View,Image,TouchableWithoutFeedback,ScrollView} from 'react-native';
import CommonStatusbar from '../../../components/CommonStatusbar';
import { ExtraBoldText, BoldText } from '../../../components/customComponents';
import { useTranslation } from 'react-i18next';
import { TabView,TabBar } from 'react-native-tab-view';
import LoginChange from './LoginChange';
import PinChange from './PinChange';
import { useDispatch } from 'react-redux';
import * as dialog from '../../../actions/dialog';
import * as auth from '../../../actions/authentication';
import {formmatedNumber} from '../../../modules/CommonHelper'
import Axios from '../../../modules/Axios';

export default ({navigation})=>{
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'pin', title: 'Pin번호 교환' },
        { key: 'login', title: 'ID로 교환' }
    ]);
    const [pinData,setPinData] = useState({});
    const [loginData,setLoginData] = useState({});
    const [balance,setBalance] = useState(0);
    const [toPoints,setToPoints] = useState(0);
    const [voucher,setVoucher] = useState(0);

    const confirmChangePoint = (mode,original)=>{
        const calcPoints = Math.floor(Number(original) * 0.92);
        dispatch(dialog.openDialog("confirm",(
            <>
                <BoldText text={`북앤라이프캐시 ${formmatedNumber(original)}원을`} customStyle={{lineHeight:24,fontSize:14,color:"#3D3D3D"}}/>
                <View style={{alignItems:'center',flexDirection:'row'}}>
                    <ExtraBoldText text={`${formmatedNumber(calcPoints)} MVP`} customStyle={{lineHeight:24,fontSize:18,color:"#EE1818"}}/>
                    <BoldText text={"로"} customStyle={{lineHeight:24,fontSize:14,color:"#3D3D3D"}}/>
                </View>
                <BoldText text={"전환하시겠습니까?"} customStyle={{lineHeight:24,fontSize:14,color:"#3D3D3D"}}/>
                <BoldText text={"(*수수료 8% 차감)"} customStyle={{lineHeight:24,fontSize:12,color:"#3D3D3D"}}/>
            </>
        ),()=>{
            dispatch(dialog.closeDialog());
            navigation.navigate("PinCode",{
                mode:"confirm",
                onGoBack:(_value)=>{if(_value) requestChangePoint(mode,original,calcPoints);}
            });
        }));
    }

    const requestChangePoint = async(mode,original,calcPoints)=>{
        let url = `/api/booknlifeRouter/${mode}/change`;
        let params = {}
        if(mode === 'users') {
            params = {
                id:loginData.id,
                pw:loginData.pw,
                original:original,
                toMvp:calcPoints
            }
        } else {
            params = {
                pin:pinData.pin,
                pass:pinData.pass,
                original:original,
                toMvp:calcPoints
            }
        }
        const {data} = await Axios.post(url,params);
        if(data.success) {
            dispatch(auth.udpateMvp(data.mvp));
            navigation.navigate("ChangeResult",{amount:calcPoints,header:'북앤라이프'})
        } else {
            dispatch(dialog.openDialog("alert",(
                <>
                    <BoldText text={data.message} customStyle={{textAlign:"center",lineHeight:20}}/>
                </>
            ))); 
        }
    }
     
    const handleChangeBtn = async()=>{
        if(index === 0) {
            if(Object.keys(pinData).length !== 0 ) {
                confirmChangePoint('pin',voucher);
            } else {
                dispatch(dialog.openDialog("alert",(
                    <>
                        <BoldText text={"Pin번호를 확안해주세요."} customStyle={{textAlign:"center"}}/>
                    </>
                )));
            }
        } else {
            let message = "";
            if(Object.keys(loginData).length === 0 ) {
                message = "북앤라이프에 로그인해주세요.";
            } else if(parseInt(toPoints) === 0 || parseInt(toPoints) === "") {
                message = "0원을 교환할 수 없습니다.";
            } else if(parseInt(toPoints) > parseInt(balance)) {
                message = "보유한 캐시보다 많이 교환할 수 없습니다.";
            } else {
                confirmChangePoint('users',toPoints);
                return;
            }
            dispatch(dialog.openDialog("alert",(
                <>
                    <BoldText text={message} customStyle={{textAlign:"center"}}/>
                </>
            )));
        }
    }
    
    const onPinData = (data)=>{
        setPinData(data)
    }
    const onLoginData = (data)=>{
        setLoginData(data)
    }
    const onBalance = (data)=>{
        setBalance(data)
    }
    const onToPoints = (data)=>{
        setToPoints(data)
    }
    const onVoucher = (data)=>{
        setVoucher(data)
    }

    return (
        <>
            <CommonStatusbar backgroundColor="#F9F9F9"/>
            <SafeAreaView style={{flex:1}}>
                <View style={[styles.header,styles.shadow]}>
                    <TouchableWithoutFeedback onPress={()=>navigation.goBack()}>
                        <View style={styles.headerIcoWrap}>
                            <Image source={require('../../../../assets/img/ico_back.png')} style={{width:21,height:21}} />
                        </View>
                    </TouchableWithoutFeedback>
                    <View style={[styles.headerIcoWrap,{flex:1}]}>
                        <ExtraBoldText text={'북앤라이프'} customStyle={{fontSize:16}}/>
                    </View>
                    <TouchableWithoutFeedback onPress={()=>navigation.goBack()}>
                        <View style={styles.headerIcoWrap}>
                            <Image source={require("../../../../assets/img/ico_close_bl.png")} style={{width:20,height:20}}/>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <View style={{justifyContent:"space-between",flex:1,backgroundColor:"#FFFFFF"}}>
                    <ScrollView style={{flex:1}}>
                        <View style={{marginHorizontal:16,flex:1}}>
                            <View style={[styles.shadow,{borderRadius:10,justifyContent:"center",alignItems:"center",marginTop:26,height:82}]}>
                                <Image source={require("../../../../assets/img/logo_booknlife.png")} style={{resizeMode:"contain",width:200}}/>
                            </View>
                            <TabView
                                style={{marginTop:40,height:280,borderBottomWidth:2,borderColor:'#F2F2F2'}}
                                navigationState={{ index, routes }}
                                renderScene={({route})=>{
                                    switch (route.key) {
                                        case 'pin':
                                          return <PinChange pinHandler={(data)=>setPinData(data)} voucherHandler={(data)=>setVoucher(data)}/>;
                                        case 'login':
                                          return <LoginChange loginHandler={(data)=>setLoginData(data)} balanceHandler={(data)=>setBalance(data)} changePointsHandler={(data)=>setToPoints(data)}/>;
                                        default:
                                          return null;
                                      }
                                }}
                                onIndexChange={setIndex}
                                renderTabBar={props => {
                                    return (
                                        <TabBar 
                                            {...props}
                                            style={{ backgroundColor: '#FFFFFF',borderBottomWidth:2,borderBottomColor:"#F2F2F2",height:45,elevation:0 }}
                                            indicatorStyle={{ backgroundColor: '#8D3981',bottom:-2,height:2 }}
                                            renderLabel={({route,focused,color})=>
                                                <ExtraBoldText text={route.title} customStyle={{fontSize:15,color:focused?'#8D3981':"#AFAFAF"}}/>}
                                        />)
                                    }
                                }
                            />
                            <View style={{paddingTop:25}}>
                                <BoldText
                                    text={"[포인트 전환 안내]"}
                                    customStyle={{color:"#3A3A3A",fontSize:12}}
                                />
                                <BoldText
                                    text={
                                        "- 북앤라이프 캐신 전환 시,발행자가 부과하는\n   수수료 등 8%를 공제한 금액(북앤라이프 액면금의 92%)\n   에 해당하는 MVP가 교환됩니다.\n"+
                                        "- 1원은 1MVP(1원)으로 교환 됩니다.\n"+
                                        "- 교환완료된 MVP는 현금영수증 발급대상이 아닙니다.\n"+
                                        "- 1원단위로 월 최대 300,000원까지 교환 가능합니다.\n"+
                                        "- 교환된 MVP는 바로 사용 가능하며, 교환취소 및 출금,\n   타포인트 교환은 불가합니다.\n"
                                    }
                                    multi
                                    customStyle={{color:"#3A3A3A",fontSize:12,marginTop:8,lineHeight:18}}
                                />
                            </View>
                        </View>
                    </ScrollView>
                    <TouchableWithoutFeedback onPress={handleChangeBtn}>
                        <View style={{height:50,backgroundColor:"#8D3981",justifyContent:"center",alignItems:"center"}}>
                            <BoldText text={t("exchange_27")} customStyle={{color:"#FFFFFF",fontSize:16}}/>
                        </View>
                    </TouchableWithoutFeedback>
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
        zIndex:2
    }
});