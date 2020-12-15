import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Image,View,SafeAreaView,StyleSheet, TouchableWithoutFeedback,ScrollView,TouchableOpacity,Alert } from 'react-native';
import Modal from 'react-native-modal';
import CheckBox from 'react-native-check-box'
import { RegularText, ExtraBoldText, BoldText } from '../components/customComponents';
import CommonStatusbar from '../components/CommonStatusbar';

import * as dialog from '../actions/dialog';
import * as spinner from '../actions/spinner';
import Axios from '../modules/Axios';

const ChangeScreen = ({navigation,route}) =>{
    const dispatch = useDispatch();
    const [visible,setVisible] = useState(false);
    const [agree,setAgree] = useState(false);
    const doBuyCard = (target)=>{
        const _item = target === "M10" ? "1만원권" : "5천원권";
        dispatch(dialog.openDialog("confirm",(
            <>
                <BoldText text={`MVP ${_item} 을 구매하시겠습니까?`}/>
            </>
        ),()=>{
            dispatch(dialog.closeDialog());
            navigation.navigate("DanalPg",{item:target});
        }));
    }

    const onChangePoint = async()=>{
        if(agree === false ) {
            Alert.alert("알림","동의해주세요.",[{text:"확인"}])
        } else {
            dispatch(spinner.showSpinner());
            const {data} = await Axios.get("/api/jHealthPick/users");
            dispatch(spinner.hideSpinner());
            console.log(data)
            if(data.result === "success") {
                if(data.customer) {
                    setVisible(false);
                    setTimeout(()=>{
                        navigation.navigate("JhealthPick",data.customer)
                    },500)
                } else {
                    Alert.alert("알림","제이헬스픽 회원이 아닙니다.",[{text:"확인"}]);    
                }
            } else {
                Alert.alert("알림","시스템 오류입니다.\n다시 시도해주세요.",[{text:"확인"}]);
            }
            
        }
    };

    return (
        <>
            <CommonStatusbar backgroundColor="#F9F9F9"/>
            <SafeAreaView style={{flex:1}}>
                <View style={[styles.shadow,styles.header]}>
                    <ExtraBoldText text="마일리지 교환" customStyle={{fontSize:16}}/>
                </View>
                <ScrollView style={{flex:1}}>
                    {/* <View style={{backgroundColor:"#394054",padding:24,marginVertical:6}}>
                        <BoldText text={"[필수공지]"} customStyle={styles.bannerTitle}/>
                        <RegularText text={"본 상품은 구매 후 환불이 불가능합니다."} customStyle={styles.bannerText}/>
                        <BoldText text={"[이용안내]"} customStyle={[styles.bannerTitle,{marginTop:20}]}/>
                        <RegularText text={"구매한 MVP는 앱에서 이용이 가능합니다."} customStyle={styles.bannerText}/>
                        <RegularText text={"MVP는 1원의 가치를 지니고 있습니다."} customStyle={styles.bannerText}/>
                    </View> */}
                    <View style={{backgroundColor:"#FFFFFF",paddingHorizontal:16,paddingTop:26}}>
                        {/* <BoldText text={"MVP 상품권 구매"} customStyle={styles.itemTitle}/> */}
                        {/* <View style={{marginTop:16,flexDirection:'row'}}>
                            <TouchableWithoutFeedback onPress={()=>doBuyCard("M10")}>
                                <View style={[styles.cardWrap,styles.shadow]}>
                                    <View style={styles.cardImgWrap}>
                                        <Image source={require("../../assets/img/mvp_gift_10.png")} style={styles.cardImg}/>
                                    </View>
                                    <View style={styles.cardTextWrap}>
                                        <RegularText text={"MVP 1만원권"} customStyle={styles.salesTitle}/>
                                        <View style={styles.salesWrap}>
                                            <ExtraBoldText text={"10%"} customStyle={styles.sales}/>
                                            <ExtraBoldText text={"9,000"} customStyle={styles.salesPrice}/>
                                            <RegularText text={"원"} customStyle={{fontSize:13}}/>
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
                                        <RegularText text={"MVP 5천원권"} customStyle={styles.salesTitle}/>
                                        <View style={styles.salesWrap}>
                                            <ExtraBoldText text={"5%"} customStyle={styles.sales}/>
                                            <ExtraBoldText text={"4,750"} customStyle={styles.salesPrice}/>
                                            <RegularText text={"원"} customStyle={{fontSize:13}}/>
                                        </View>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        </View> */}
                        <View style={{marginVertical:26}}>
                            <BoldText text={"MVP 교환"} customStyle={[styles.itemTitle]}/>
                            <TouchableOpacity onPress={()=>setVisible(true)}>
                                <View style={[styles.shadow,{marginTop:16,borderRadius:10,justifyContent:"center",alignItems:"center",overflow:"hidden"}]}>
                                    <View style={{marginVertical:13}}>
                                        <Image source={require("../../assets/img/logo_healthPick.png")} style={{resizeMode:"contain",width:300,height:60}}/>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <View style={{marginTop:16,borderRadius:10,justifyContent:"center",alignItems:"center",overflow:"hidden"}}>
                                <View style={{marginVertical:13}}>
                                    <Image source={require("../../assets/img/logo_jjane.png")} style={{resizeMode:"stretch",width:60,height:57}}/>
                                </View>
                                <View style={styles.mask} />
                                <ExtraBoldText text={"Coming soon"} customStyle={{fontSize:20,color:"#FFFFFF",position:"absolute"}}/>
                            </View>
                        </View>
                        
                    </View>
                </ScrollView>
                <Modal isVisible={visible} backdropTransitionOutTiming={0} style={{margin: 0,justifyContent:"center",alignItems:"center"}} useNativeDriver={true}>
                    <View style={{backgroundColor:"#FFFFFF",width:308,height:508,borderRadius:6,overflow:"hidden",justifyContent:"space-between"}}>
                        <View style={{paddingHorizontal:16,paddingBottom:16,flex:1,justifyContent:"space-between"}}>
                            <View>
                                <View style={{height:54,justifyContent:"center",alignItems:"center"}}>
                                    <BoldText text={"전환동의"} customStyle={{fontSize:14}}/>
                                </View>
                                <View style={{borderWidth:1,borderColor:"#F2F2F2"}} />
                                <View style={{marginTop:26}}>
                                    <BoldText text={"제이헬스픽 포인트를 MVP로 전환하기 위해 아래 사항에 동의해 주세요."} customStyle={{lineHeight:22}}/>
                                </View>
                                <View style={{marginTop:20,borderWidth:1,borderRadius:6,borderColor:"#E5E5E5",backgroundColor:"#F3F3F3",padding:16}}>
                                    <BoldText text={"개인 정보 제3자 제공 동의"} customStyle={{fontSize:12}}/>
                                    <View style={{borderWidth:1,borderColor:"#EBEBEB",marginTop:16}} />
                                    <View style={{marginTop:16}}>
                                        <BoldText text={
                                            "제공받는자: 제이헬스픽\n"+
                                            "제공목적: 제이헬스픽 포인트 조회 및 전환\n"+
                                            "제공하는 항목: 개인 식별 정보\n"+
                                            "보유 및 이용기간: 마일리지 전환 완료 후 파기\n\n"+
                                            "회원님은 동의를 거부할 권리가 있으나, 동의 거부 시 마일리지 전환서비스를 위한 최소한의 정보가 제공되지 않아 해당 서비스 이용이 불가능 합니다."} 
                                            customStyle={styles.modalContentsText}/>
                                    </View>
                                </View>
                            </View>
                            <View style={{flexDirection:"row",alignItems:"center"}}>
                                <CheckBox
                                    isChecked={agree}
                                    checkedCheckBoxColor={'#8D3981'}
                                    uncheckedCheckBoxColor={"#999999"}
                                    onClick={()=>setAgree(!agree)}
                                />
                                <TouchableWithoutFeedback onPress={()=>setAgree(!agree)}>
                                    <View>
                                        <BoldText text={"마일리지 교환에 동의합니다."} customStyle={{fontSize:10,marginLeft:10}}/>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                        <View style={{flexDirection:'row',height:46}}>
                            <TouchableWithoutFeedback onPress={()=>setVisible(false)}>
                                <View style={[styles.modalBottomBtn,{backgroundColor:"#EBEBEB"}]}>
                                    <BoldText text={"취소"} customStyle={{color:"#8B8B8B",fontSize:14}}/>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={onChangePoint}>
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

export default ChangeScreen;

const styles = StyleSheet.create({
    header:{
        height:50,
        justifyContent:'center',
        alignItems:'center',
    },
    shadow:{
        backgroundColor:"white",
        elevation:2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2.22,
        zIndex:1
    },
    bannerTitle:{
        fontSize:12,
        color:"#F3C839"
    },
    bannerText:{
        fontSize:11,
        color:"#FFFFFF",
        marginTop:10
    },
    itemTitle:{
        fontSize:15
    },
    cardWrap:{
        flex:1,
        aspectRatio:1,
        borderRadius:10,
        overflow:"hidden"
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