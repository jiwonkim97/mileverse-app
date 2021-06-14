import React, { useState,useRef } from 'react';
import { useDispatch } from 'react-redux';
import { Image,View,SafeAreaView,StyleSheet, TouchableWithoutFeedback,ScrollView,TouchableOpacity,Alert,Platform } from 'react-native';
import Modal from 'react-native-modal';
import CheckBox from 'react-native-check-box'
import { RegularText, ExtraBoldText, BoldText } from '../components/customComponents';
import CommonStatusbar from '../components/CommonStatusbar';
import { useTranslation } from 'react-i18next';

import * as dialog from '../actions/dialog';
import * as spinner from '../actions/spinner';
import Axios from '../modules/Axios';


const brnachList = [
    {screen:"BooknLife",text:"북앤라이프"},
    {screen:"Partnercom",text:"건강곶간",uri:"/api/partnercom/users"},
    {screen:"RealPet",text:"리얼펫",uri:"/api/realPet/users"},
    {screen:"JhealthPick",text:"제이헬스픽",uri:"/api/jHealthPick/users"}
];

const ChangeScreen = ({navigation,route}) =>{
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [visible,setVisible] = useState(false);
    const [agree,setAgree] = useState(false);
    const branchIdx = useRef(0);
    const doBuyCard = (target)=>{
        const _text = target === "M10" ? "exchange_buy_8" : "exchange_buy_9";
        dispatch(dialog.openDialog("confirm",(
            <>
                <BoldText text={t(_text)} customStyle={{fontSize:14,lineHeight:20}}/>
                <BoldText text={t("exchange_buy_10")} customStyle={{textAlign:"center",marginTop:14,fontSize:11,color:"#EE1818"}}/>
            </>
        ),()=>{
            dispatch(dialog.closeDialog());
            checkLimit(target)
        }));
    }

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

    const onChangePoint = async()=>{
        if(agree === false ) {
            Alert.alert(t("alert_title_1"),t('alert_exchange_7'),[{text:t('common_confirm_1')}])
        } else {
            const {uri,screen,text} = brnachList[branchIdx.current]
            if(screen === 'BooknLife') {
                setVisible(false);
                navigation.navigate(screen);
            } else {
                dispatch(spinner.showSpinner());
                const {data} = await Axios.get(uri);
                dispatch(spinner.hideSpinner());
                if(data.result === "success") {
                    if(data.customer) {
                        setVisible(false);
                        setTimeout(()=>{
                            navigation.navigate(screen,data.customer)
                        },500)
                    } else {
                        Alert.alert(t("alert_title_1"),t("alert_exchange_6",{company:text}),[{text:t('common_confirm_1')}]);    
                    }
                } else {
                    Alert.alert(t("alert_title_1"),t("alert_common_1"),[{text:t('common_confirm_1')}]);
                }
            }
        }
    };

    const onConfirmModal = (idx)=>{
        branchIdx.current = idx;
        setVisible(true);
    }

    return (
        <>
            <CommonStatusbar backgroundColor="#F9F9F9"/>
            <SafeAreaView style={{flex:1}}>
                <View style={[styles.shadow,styles.header]}>
                    <ExtraBoldText text={t('exchange_1')} customStyle={{fontSize:16}}/>
                </View>
                <ScrollView style={{flex:1}}>
                    <View style={{backgroundColor:"#394054",padding:24,marginVertical:6}}>
                        <View>
                            <BoldText text={t('exchange_2')} customStyle={styles.bannerTitle}/>
                            <RegularText text={t('exchange_3')} customStyle={styles.bannerText}/>
                            <BoldText text={t('exchange_4')} customStyle={[styles.bannerTitle,{marginTop:20}]}/>
                            <RegularText text={`${t('exchange_5')}\n${t('exchange_6')}`} customStyle={styles.bannerText}/>
                        </View>
                        <View>
                            <BoldText text={"[마일리지 교환 공지]"} customStyle={[styles.bannerTitle,{marginTop:20}]}/>
                            <RegularText text={"제휴사를 통해 비정상적인 방법의 교환이 발견될 경우 비정상적으로 획득한 마일리지는 모두 회수되며 강제 회원탈퇴 될 수 있음을 알려드립니다."} customStyle={styles.bannerText}/>
                            <View style={{flexDirection:"row"}}>
                                <RegularText text={"문의사항은"} customStyle={styles.bannerText}/>
                                <TouchableOpacity onPress={()=>navigation.navigate("Contact")}>
                                    <RegularText text={" [여기] "} customStyle={[styles.bannerText,{color:"#F3C839"}]}/>
                                </TouchableOpacity>
                                <RegularText text={"를 눌러 메일로 문의해주세요."} customStyle={styles.bannerText}/>
                            </View>
                        </View>
                    </View>
                    
                    <View style={{backgroundColor:"#FFFFFF",paddingHorizontal:16,paddingTop:26}}>
                        <BoldText text={t('exchange_buy_1')} customStyle={styles.itemTitle}/>
                        <View style={{marginTop:16,flexDirection:'row'}}>
                            <TouchableWithoutFeedback onPress={()=>doBuyCard("M10")}>
                                <View style={[styles.cardWrap,styles.shadow]}>
                                    <View style={styles.cardImgWrap}>
                                        <Image source={require("../../assets/img/mvp_gift_10.png")} style={styles.cardImg}/>
                                    </View>
                                    <View style={styles.cardTextWrap}>
                                        <RegularText text={t("exchange_buy_2")} customStyle={styles.salesTitle}/>
                                        <View style={styles.salesWrap}>
                                            <ExtraBoldText text={"5%"} customStyle={styles.sales}/>
                                            <ExtraBoldText text={"9,500"} customStyle={styles.salesPrice}/>
                                            <RegularText text={t('common_unit_1')} customStyle={{fontSize:13}}/>
                                        </View>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                            <View style={{width:16}} />
                            <TouchableWithoutFeedback onPress={()=>doBuyCard("M05")}>
                                <View style={[styles.cardWrap,styles.shadow]}>
                                    <View style={styles.cardImgWrap}>
                                        <Image source={require("../../assets/img/mvp_gift_05.png")} style={styles.cardImg}/>
                                    </View>
                                    <View style={styles.cardTextWrap}>
                                        <RegularText text={t('exchange_buy_5')} customStyle={styles.salesTitle}/>
                                        <View style={styles.salesWrap}>
                                            <ExtraBoldText text={"5%"} customStyle={styles.sales}/>
                                            <ExtraBoldText text={"4,750"} customStyle={styles.salesPrice}/>
                                            <RegularText text={t('common_unit_1')} customStyle={{fontSize:13}}/>
                                        </View>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                        
                        <View style={{marginVertical:26}}>
                            <BoldText text={t('exchange_7')} customStyle={[styles.itemTitle]}/>
                            <TouchableOpacity onPress={()=>onConfirmModal(0)}>
                                <View style={[styles.shadow,{marginTop:16,borderRadius:10,justifyContent:"center",alignItems:"center"}]}>
                                    <View style={{marginVertical:13}}>
                                        <Image source={require("../../assets/img/logo_booknlife.png")} style={{resizeMode:"contain",width:200,height:60}}/>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>onConfirmModal(1)}>
                                <View style={[styles.shadow,{marginTop:16,borderRadius:10,justifyContent:"center",alignItems:"center"}]}>
                                    <View style={{marginVertical:13,flexDirection:"row",justifyContent:"center",alignItems:"center"}}>
                                        <Image source={require("../../assets/img/logo_dongjin.jpeg")} style={{resizeMode:"contain",width:160,height:60}}/>
                                        <View style={{width:1,backgroundColor:'#C4C4C4',height:20,marginHorizontal:7}}></View>
                                        <Image source={require("../../assets/img/logo_ptnc.jpeg")} style={{resizeMode:"contain",width:130,height:60}}/>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>onConfirmModal(2)}>
                                <View style={[styles.shadow,{marginTop:16,borderRadius:10,justifyContent:"center",alignItems:"center"}]}>
                                    <View style={{marginVertical:13}}>
                                        <Image source={require("../../assets/img/logo_realpet.jpg")} style={{resizeMode:"contain",width:130,height:60}}/>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>onConfirmModal(3)}>
                                <View style={[styles.shadow,{marginTop:16,borderRadius:10,justifyContent:"center",alignItems:"center"}]}>
                                    <View style={{marginVertical:13}}>
                                        <Image source={require("../../assets/img/logo_healthPick.png")} style={{resizeMode:"contain",width:220,height:60}}/>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <View style={{marginTop:16,borderRadius:10,justifyContent:"center",alignItems:"center",overflow:"hidden"}}>
                                <View style={{marginVertical:13,height:57}}>
                                </View>
                                <View style={styles.mask} />
                                <ExtraBoldText text={"Coming soon"} customStyle={{fontSize:20,color:"#FFFFFF",position:"absolute"}}/>
                            </View>
                        </View>
                        
                    </View>
                </ScrollView>
                <Modal isVisible={visible}
                    onBackButtonPress={()=>setVisible(false)}
                    backdropTransitionOutTiming={0} style={{margin: 0,justifyContent:"center",alignItems:"center"}} useNativeDriver={true}>
                    <View style={{backgroundColor:"#FFFFFF",width:308,borderRadius:6,overflow:"hidden"}}>
                        <View style={{paddingHorizontal:16}}>
                            <View>
                                <View style={{height:54,justifyContent:"center",alignItems:"center"}}>
                                    <BoldText text={t('exchange_8')} customStyle={{fontSize:14}}/>
                                </View>
                                <View style={{borderWidth:1,borderColor:"#F2F2F2"}} />
                                <View style={{marginTop:25,marginBottom:19}}>
                                    <BoldText text={`${brnachList[branchIdx.current].text} ${t('exchange_9')}`} customStyle={{lineHeight:22}}/>
                                </View>
                                <ScrollView style={{borderWidth:1,borderRadius:6,borderColor:"#E5E5E5",backgroundColor:"#F3F3F3",padding:16,height:250,paddingBottom:0}}>
                                    <BoldText text={t('exchange_10')} customStyle={{fontSize:12}}/>
                                    <View style={{borderWidth:1,borderColor:"#EBEBEB",marginTop:16}} />
                                    <View style={{marginTop:16,marginBottom:32}}>
                                        <BoldText text={
                                            `${t('exchange_11')}: ${brnachList[branchIdx.current].text}\n`+
                                            `${t('exchange_12')}\n`+
                                            `${t('exchange_13')}\n`+
                                            `${t('exchange_14')}\n\n`+
                                            `${t('exchange_15')}`} 
                                            customStyle={styles.modalContentsText}/>
                                    </View>
                                </ScrollView>
                            </View>
                        </View>
                        <View>
                            <View style={{flexDirection:"row",alignItems:"center",marginVertical:14,paddingHorizontal:16}}>
                                <CheckBox
                                    isChecked={agree}
                                    checkedCheckBoxColor={'#8D3981'}
                                    uncheckedCheckBoxColor={"#999999"}
                                    onClick={()=>setAgree(!agree)}
                                />
                                <TouchableWithoutFeedback onPress={()=>setAgree(!agree)}>
                                    <View>
                                        <BoldText text={t('exchange_16')} customStyle={{fontSize:12,marginLeft:8}}/>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                            <View style={{flexDirection:'row',height:46}}>
                                <TouchableWithoutFeedback onPress={()=>setVisible(false)}>
                                    <View style={[styles.modalBottomBtn,{backgroundColor:"#EBEBEB"}]}>
                                        <BoldText text={t('common_cancel_1')} customStyle={{color:"#8B8B8B",fontSize:14}}/>
                                    </View>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={onChangePoint}>
                                    <View style={[styles.modalBottomBtn,{backgroundColor:"#8D3981"}]}>
                                        <BoldText text={t('common_confirm_1')} customStyle={{color:"#FFFFFF",fontSize:14}}/>
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

export default ChangeScreen;

const styles = StyleSheet.create({
    header:{
        height:50,
        justifyContent:'center',
        alignItems:'center',
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
    bannerTitle:{
        fontSize:12,
        color:"#F3C839"
    },
    bannerText:{
        fontSize:11,
        color:"#FFFFFF",
        marginTop:10,
        lineHeight:15
    },
    itemTitle:{
        fontSize:15
    },
    cardWrap:{
        flex:1,
        aspectRatio:1,
        borderRadius:10,
    },
    cardImgWrap:{
        flex:1,
        justifyContent:"center",
        alignItems:"center"
    },
    cardImg:{
        width:"55%",
        resizeMode:"contain"
    },
    cardTextWrap:{
        backgroundColor:"#F6F6F6",
        padding:12
    },
    salesWrap:{
        marginTop:7,
        flexDirection:"row",
        alignItems:"center"
    },
    salesTitle:{
        fontSize:14
    },
    sales:{
        fontSize:15,
        color:"#EE1818"
    },
    price:{
        fontSize:10,
        color:"#858585",
        marginLeft:4,
        textDecorationLine: 'line-through'
    },
    salesPrice:{
        fontSize:15,
        marginLeft:4
    },
    mask:{
        position:"absolute",
        width:"100%",
        height:"100%",
        backgroundColor:"#000000",
        justifyContent:"center",
        alignItems:"center",
        borderRadius:10,
        opacity:0.5
    },
    modalBottomBtn:{
        flex:1,
        justifyContent:"center",
        alignItems:"center"
    },
    modalContentsText:{
        fontSize:11,
        color:"#3A3A3A",
        lineHeight:18
    }
});