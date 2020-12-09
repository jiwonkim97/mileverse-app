import React, { useEffect, useState } from 'react';
import { Image,View,SafeAreaView,StyleSheet, TouchableWithoutFeedback, ImageBackground } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { RegularText, ExtraBoldText, BoldText } from '../components/customComponents';
import Modal from 'react-native-modal';
import CommonStatusbar from '../components/CommonStatusbar';
import Axios from '../modules/Axios';

const imagePrefix = "https://mv-image.s3.ap-northeast-2.amazonaws.com";
const GificonCategory = (props) =>{
    const [iconSize,setIconSize] = useState(0);
    const [visible,setVisible] = useState(false);
    const [categories,setCategories] = useState([]);
    const navigateBrand = (_code,_name)=>{
        props.navigation.navigate('GifticonList',{ctgr_code:_code,ctgr_name:_name});
    }
    useEffect(()=>{
        Axios.get("/api/gifticon/categories").then(response=>{
            setCategories(response.data.rows);
        });
    },[]);

    return (
        <>
            <CommonStatusbar backgroundColor="#F9F9F9"/>
            <SafeAreaView style={{flex:1}}>
                <View style={[styles.header,styles.shadow]}>
                    <ExtraBoldText text="기프티콘" customStyle={{fontSize:16}}/>
                </View>
                <ScrollView style={{backgroundColor:"#FFFFFF"}}>
                       <TouchableWithoutFeedback onPress={()=>setVisible(!visible)}>
                           <ImageBackground source={require("../../assets/img/gifticon_notice_banner_bg.png")} style={{width:"100%",height:104,resizeMode:"stretch",borderTopWidth:6,borderTopColor:"#F2F2F2",justifyContent:"center"}}>
                               <View style={{paddingLeft:24}}>
                                   <BoldText text={"기프티콘 사용 공지"} customStyle={{color:"#F3C839",fontSize:18}}/>
                                   <RegularText text={"기프티콘 사용 가이드 & 안내사항을 확인해주세요!"} customStyle={{color:"#FFFFFF",fontSize:11,marginTop:12}}/>
                               </View>
                           </ImageBackground>
                       </TouchableWithoutFeedback>
                       <View style={{paddingBottom:6,paddingHorizontal:8,flex:1,borderTopWidth:6,borderTopColor:"#F2F2F2"}}>
                           <View style={{flexDirection:'row',flexWrap:'wrap',justifyContent:"space-between",marginVertical:6}}>
                               {
                                   categories.map((item,index)=>{ 
                                       return (
                                           <TouchableWithoutFeedback onPress={()=>{navigateBrand(item.CTGR_CODE,item.CTGR_NAME)}} key={index}>
                                                <View style={{width:"50%",marginTop:10,marginBottom:6,paddingHorizontal:8}}>
                                                    <View style={[styles.categoryCard,styles.shadow]} onLayout={(event)=>{
                                                        setIconSize(event.nativeEvent.layout.width * 0.38);
                                                    }}>
                                                        <View style={{alignItems:"center",justifyContent:"flex-start"}}>
                                                            <Image source={{uri:imagePrefix+item.CTGR_ICO}} style={{width:iconSize,height:iconSize,marginBottom:24}}/>
                                                            <BoldText text={item.CTGR_NAME.replace(",",'/\n')} customStyle={styles.categoryText}/>
                                                        </View>
                                                    </View>
                                                </View>
                                           </TouchableWithoutFeedback>
                                       )
                                   })
                               }
                           </View>
                       </View>
                </ScrollView>
            </SafeAreaView>
            <Modal isVisible={visible} backdropTransitionOutTiming={0} 
                style={{margin: 0,flex:1,justifyContent:"center",alignItems:"center"}} useNativeDriver={true}>
                <View style={{backgroundColor:"#ffffff",borderRadius:10,width:"85%"}}>
                    <View style={styles.noticeHeaderWrap}>
                        <BoldText text={"기프티콘 사용 공지"} customStyle={{fontSize:15}}/>
                        <TouchableWithoutFeedback onPress={()=>setVisible(!visible)}>
                            <Image source={require("../../assets/img/ico_close_bl.png")} style={{width:14,height:14}}/>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={{paddingTop:26,paddingBottom:60,paddingHorizontal:26}}>
                        <BoldText text={"[기프티콘 구매 이용 가이드]"} customStyle={styles.noticeTextHeader}/>
                        <RegularText text={"1. 사용하기 > 기프티콘 구매하기를 선택해 주세요."} customStyle={[styles.noticeText,{marginTop:20}]}/>
                        <RegularText text={"2. 구매할 기프티콘을 선택해 주세요."} customStyle={styles.noticeText}/>
                        <RegularText text={"3. 구매한 기프티콘은 MMS(문자메세지)로 전송됩니다."} customStyle={styles.noticeText}/>
                        <BoldText text={"[기프티콘 구매시 주의사항]"} customStyle={[styles.noticeTextHeader,{marginTop:36}]}/>
                        <RegularText text={"1. 각 기프티콘별로 상품 사용 기간 및 방법이 상이 합니다. 구매 전 꼭 상품 별 유의사항을 확인하여 주세요."} customStyle={[styles.noticeText,{lineHeight:18,marginTop:20}]}/>
                        <RegularText text={"2. 구매한 기프티콘의 사용기한은 연장 되지 않습니다."} customStyle={styles.noticeText}/>
                        <RegularText text={"3. 구매한 기프티콘은 취소/환불이 불가능합니다."} customStyle={styles.noticeText}/>
                    </View>
                </View>
            </Modal>
        </>
    )
}


export default GificonCategory;

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
        flexDirection:"row"
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
        fontSize:14,
    },
    noticeText:{
        fontSize:13,
        marginTop:10
    }
});