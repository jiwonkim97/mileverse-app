import React,{useState,useEffect} from 'react';
import {View,StyleSheet,SafeAreaView,Image,TouchableWithoutFeedback} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';
import CommonStatusbar from '../../components/CommonStatusbar';
import {BoldText,ExtraBoldText,RegularText} from '../../components/customComponents'
import Axios from "../../modules/Axios";
import ProductWrap from './ProductWrap';
import { useDispatch } from 'react-redux';
import * as dialog from '../../actions/dialog';
export default({navigation})=>{
    const [prodtList,setProdtList] = useState([]);
    const dispatch = useDispatch();
    const [img,setImg] = useState("");
    const stat = useSelector(state => state.authentication.status.isLoggedIn);
    useEffect(()=>{
        const getLists = async()=>{
           const {data} = await Axios.get("/api/gifticon/v2/gifticon-list/event");
           if(data.success) {
               setProdtList(data.lists)
           }
        }
        const getImg = async()=>{
            const {data} = await Axios.get("/get/storage",{params:{key:"MAIN_BANNER"}});
            setImg(data.value)
        }
        getLists();
        getImg();
    },[]);

    const checkLimit = async(target)=>{
        const amount = target === "M10" ? 9500 : 4750;
        const {data} = await Axios.get('/api/point/buy/limit',{params:{amount:amount}});
        if(data.result === 'success') {
            navigation.navigate("DanalPg",{item:target,amount:amount});
        } else {
            dispatch(dialog.openDialog("alert",(
                <>
                    <BoldText text={data.msg} customStyle={{textAlign:"center",lineHeight:20}}/>
                </>
            )));
        }
    }
    const buyVoucher = (target)=>{
        if(stat) {
            const _text = target === "M10" ? "MVP 1만원권을 구매하시겠습니까?" : "MVP 5천원권을 구매하시겠습니까?";
            dispatch(dialog.openDialog("confirm",(
                <>
                    <BoldText text={_text} customStyle={{fontSize:14,lineHeight:20}}/>
                    <BoldText text={"* MVP 월 구매 한도는 50,000원 입니다."} customStyle={{textAlign:"center",marginTop:14,fontSize:11,color:"#EE1818"}}/>
                </>
            ),()=>{
                dispatch(dialog.closeDialog());
                checkLimit(target)
            }));


        } else{
            dispatch(dialog.openDialog("alert",(
                <>
                    <BoldText text={"로그인 이후 사용 가능합니다."} customStyle={{textAlign:"center",lineHeight:20}}/>
                </>
            ),()=>{
                dispatch(dialog.closeDialog());
                navigation.navigate("Login");
            }));
        }
    }

    return (
        <>
            <CommonStatusbar backgroundColor="#F9F9F9"/>
            <SafeAreaView style={{flex:1,backgroundColor:"#FFFFFF"}}>
                <View style={styles.header}>
                    <View style={{width:50}}></View>
                    <View style={[styles.headerIcoWrap,{flex:1}]}>
                        <ExtraBoldText text={"이벤트"} customStyle={{fontSize:16}}/>
                    </View>
                    <TouchableWithoutFeedback onPress={()=>navigation.goBack()}>
                        <View style={styles.headerIcoWrap}>
                            <Image source={require("../../../assets/img/ico_close_bl.png")} style={{width:20,height:20}}/>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <ScrollView>
                    <View style={{backgroundColor:"#F2F2F2"}}>
                        {
                            img !== "" ?
                                <Image
                                    source={{uri:img}}
                                    style={{width:'100%',aspectRatio:1,marginVertical:6}}
                                />
                            :
                                null
                        }
                        
                    </View>
                    <View style={{paddingHorizontal:16,marginTop:26,marginBottom:78}}>
                        <BoldText text={"MVP 상품권 구매"} customStyle={{fontSize:15}}/>
                        <View style={{marginTop:16,flexDirection:"row"}}>
                            <TouchableWithoutFeedback onPress={()=>buyVoucher("M10")}>
                                <View style={{flex:1,paddingRight:8}}>
                                    <View style={[styles.shadow,{borderRadius:10}]}>
                                        <View style={styles.cardImgWrap}>
                                            <Image
                                                source={require("../../../assets/img/mvp_gift_10.png")}
                                                style={{width:86,height:56,resizeMode:'contain'}}
                                            />
                                        </View>
                                        <View style={styles.cardTextWrap}>
                                            <BoldText text={'MVP 1만원권'} customStyle={{fontSize:14}}/>
                                            <View style={{flexDirection:"row",alignItems:'center'}}>
                                                <ExtraBoldText text={'5%'} customStyle={{fontSize:15,color:"#EE1818"}}/>
                                                <ExtraBoldText text={'9,500'} customStyle={{fontSize:15,marginLeft:7}}/>
                                                <RegularText text={'원'} customStyle={{fontSize:13}}/>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={()=>buyVoucher("M05")}>
                                <View style={{flex:1,paddingLeft:8}}>
                                    <View style={[styles.shadow,{borderRadius:10}]}>
                                        <View style={styles.cardImgWrap}>
                                            <Image
                                                source={require("../../../assets/img/mvp_gift_05.png")}
                                                style={{width:86,height:56,resizeMode:'contain'}}
                                            />
                                        </View>
                                        <View style={styles.cardTextWrap}>
                                            <BoldText text={'MVP 5천원권'} customStyle={{fontSize:14}}/>
                                            <View style={{flexDirection:"row",alignItems:'center'}}>
                                                <ExtraBoldText text={'5%'} customStyle={{fontSize:15,color:"#EE1818"}}/>
                                                <ExtraBoldText text={'4,750'} customStyle={{fontSize:15,marginLeft:7}}/>
                                                <RegularText text={'원'} customStyle={{fontSize:13}}/>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                        {
                            prodtList.map((item,index)=>{
                                return <ProductWrap {...item} key={index} navigation={navigation}/>
                            })
                        }
                        <View style={{marginTop:30,borderTopWidth:1,borderTopColor:'#F2F2F2',paddingTop:25}}>
                            <BoldText text={"이벤트 유의사항 안내"} />
                            <BoldText 
                                customStyle={{marginTop:10,lineHeight:18}}
                                text={
                                    '- 본 상품은 마일벌스 회원 전용 상품입니다.\n'+
                                    '- 본 상품들은 이벤트 기간에만 할인된 가격에 구매가 가능합니다.\n'+
                                    '- MVP 구매와 도서문화상품권 구매는 이벤트 기간동안 월 50,000원까지로 구매가 제한됩니다.\n'+
                                    '- 구매하신 이벤트 상품은 환불 및 교환이 불가한 상품이므로 구매 시 유의 바랍니다.\n'+
                                    '- 이벤트 구성 및 스케줄은 당사 사정에 따라 변경 또는 종료될 수 있으며 행사수량 소진 시 조기종료 될 수 있습니다.\n'+
                                    '- 비정상적인 방법에 의한 교환으로 부당이득을 취함이 확인되는 경우, 마일벌스 앱 이용제한 및 교환금액 전체 회수, 법적인 책임을 지게 될 수 있음을 안내드립니다.'
                                }
                            />
                        </View>
                    </View>
                </ScrollView>
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
    },
    cardImgWrap:{
        height:120,justifyContent:'center',alignItems:"center"
    },
    cardTextWrap:{
        height:86,backgroundColor:"#F6F6F6",padding:12,justifyContent:"space-between"
    }
})