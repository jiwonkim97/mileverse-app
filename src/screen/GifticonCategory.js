import React, { useState } from 'react';
import { Image,View,SafeAreaView,StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { RegularText, ExtraBoldText, BoldText } from '../components/customComponents';
import Modal from 'react-native-modal';
import CommonStatusbar from '../components/CommonStatusbar';


const ChangeScreen = (props) =>{
    const [iconSize,setIconSize] = useState(0);
    const [visible,setVisible] = useState(false);
    return (
        <>
            <CommonStatusbar backgroundColor="#F9F9F9"/>
            <SafeAreaView style={{flex:1}}>
                <View style={[styles.header,styles.shadow]}>
                    <ExtraBoldText text="기프티콘" customStyle={{color:"#707070",fontSize:16}}/>
                    <TouchableWithoutFeedback onPress={()=>props.navigation.goBack()}>
                        <Image source={require("../../assets/img/ico_close_bl.png")} style={{width:14,height:14,position:'absolute',right:20}}/>
                    </TouchableWithoutFeedback>
                </View>
                <ScrollView style={{marginTop:6}}>
                       <View>
                           <TouchableWithoutFeedback onPress={()=>setVisible(!visible)}>
                               <Image source={require("../../assets/img/gifticon_banner.png")} style={{width:"100%",height:104,resizeMode:"stretch"}}/>
                           </TouchableWithoutFeedback>
                       </View>
                       <View style={{marginTop:6,backgroundColor:"#FFFFFF",padding:16}}>
                            <View style={[styles.categoryCardWrap]}>
                                <View style={[styles.categoryCard,styles.shadow]} onLayout={(event)=>{
                                    setIconSize(event.nativeEvent.layout.width *0.38);
                                }}>
                                      <View style={{alignItems:"center",justifyContent:"flex-start"}}>
                                            <Image source={require("../../assets/img/ico_mart.png")} style={{width:iconSize,height:iconSize,marginBottom:24}}/>
                                            <BoldText text={"편의점"} customStyle={styles.categoryText}/>
                                      </View>
                                </View>
                                <View style={{width:16}}/>
                                <View style={[styles.categoryCard,styles.shadow]}>
                                    <View style={{alignItems:"center",justifyContent:"flex-start"}}>
                                        <Image source={require("../../assets/img/ico_coffee.png")} style={{width:iconSize,height:iconSize,marginBottom:24}}/>
                                        <BoldText text={"커피"} customStyle={styles.categoryText}/>
                                    </View>
                                </View>
                            </View>
                            <View style={[styles.categoryCardWrap,{marginTop:16}]}>
                                <View style={[styles.categoryCard,styles.shadow]}>
                                      <View style={{alignItems:"center",justifyContent:"flex-start"}}>
                                            <Image source={require("../../assets/img/ico_chicken.png")} style={{width:iconSize,height:iconSize,marginBottom:24}}/>
                                            <BoldText text={"치킨/피자"} customStyle={styles.categoryText}/>
                                      </View>
                                </View>
                                <View style={{width:16}}/>
                                <View style={[styles.categoryCard,styles.shadow]}>
                                    <View style={{alignItems:"center",justifyContent:"flex-start"}}>
                                        <Image source={require("../../assets/img/ico_icecream.png")} style={{width:iconSize,height:iconSize,marginBottom:24}}/>
                                        <BoldText text={" 베이커리\n아이스크림"} customStyle={styles.categoryText}/>
                                    </View>
                                </View>
                            </View>
                            <View style={[styles.categoryCardWrap,{marginTop:16}]}>
                                <View style={[styles.categoryCard,styles.shadow]}>
                                      <View style={{alignItems:"center",justifyContent:"flex-start"}}>
                                            <Image source={require("../../assets/img/ico_movie.png")} style={{width:iconSize,height:iconSize,marginBottom:24}}/>
                                            <BoldText text={"영화"} customStyle={styles.categoryText}/>
                                      </View>
                                </View>
                                <View style={{width:16}}/>
                                <View style={[styles.categoryCard,styles.shadow]}>
                                    <View style={{alignItems:"center",justifyContent:"flex-start"}}>
                                        <Image source={require("../../assets/img/ico_beauty.png")} style={{width:iconSize,height:iconSize,marginBottom:24}}/>
                                        <BoldText text={"뷰티"} customStyle={styles.categoryText}/>
                                    </View>
                                </View>
                            </View>
                       </View>
                </ScrollView>
            </SafeAreaView>
            <Modal isVisible={visible} backdropTransitionOutTiming={0} 
                style={{margin: 0,flex:1,justifyContent:"center",alignItems:"center"}} useNativeDriver={true}>
                <View style={{backgroundColor:"#ffffff",borderRadius:10,width:"85%"}}>
                    <View style={styles.noticeHeaderWrap}>
                        <BoldText text={"기프티콘 사용 공지"} customStyle={{color:"#3D3D3D",fontSize:18}}/>
                        <TouchableWithoutFeedback onPress={()=>setVisible(!visible)}>
                            <Image source={require("../../assets/img/ico_close_bl.png")} style={{width:14,height:14}}/>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={{paddingTop:26,paddingLeft:26,paddingBottom:60}}>
                        <BoldText text={"[기프티콘 구매 이용 가이드]"} customStyle={styles.noticeTextHeader}/>
                        <RegularText text={"1. 사용하기 > 기프티콘 구매하기를 선택해 주세요."} customStyle={styles.noticeText}/>
                        <RegularText text={"2. 구매할 기프티콘을 선택해 주세요."} customStyle={styles.noticeText}/>
                        <RegularText text={"3. 구매한 기프티콘은 MMS(문자메세지)로 전송됩니다."} customStyle={styles.noticeText}/>
                        <BoldText text={"[기프티콘 구매 이용 가이드]"} customStyle={[styles.noticeTextHeader,{marginTop:36}]}/>
                        <RegularText text={"1. 각 기프티콘별로 상품 사용 기간 및 방법이 상이합니다.\n\t 구매 전 꼭 상품 별 유의사항을 확인하여 주세요."} customStyle={styles.noticeText}/>
                        <RegularText text={"2. 구매한 기프티콘의 사용기한은 연장 되지 않습니다."} customStyle={styles.noticeText}/>
                        <RegularText text={"3. 구매한 기프티콘은 취소/환불이 불가능합니다."} customStyle={styles.noticeText}/>
                    </View>
                </View>
            </Modal>
        </>
    )
}


export default ChangeScreen;

const styles = StyleSheet.create({
    header:{
        backgroundColor:"white",
        height:50,
        justifyContent:'center',
        alignItems:'center'
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
    categoryCardWrap:{
        flexDirection:"row",
        justifyContent:"space-between"
    },
    categoryCard:{
        flex:1,
        aspectRatio: 1,
        borderRadius:10, 
        justifyContent:"center",
        alignItems:"center"
    },
    categoryText:{
        fontSize:14
    },
    noticeHeaderWrap:{
        paddingVertical:16,
        paddingLeft:26,
        paddingRight:16,
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        borderBottomWidth:1,
        borderBottomColor:"#ECECEC"
    },
    noticeTextHeader:{
        fontSize:12,
        color:"#3D3D3D"
    },
    noticeText:{
        fontSize:10,
        color:"#3D3D3D",
        marginTop:12
    }
});