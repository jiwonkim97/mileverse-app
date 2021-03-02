import React, { useEffect, useState } from 'react';
import { Image,View,SafeAreaView,StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { RegularText, ExtraBoldText, BoldText } from '../components/customComponents';
import Modal from 'react-native-modal';
import CommonStatusbar from '../components/CommonStatusbar';
import Axios from '../modules/Axios';
import { useTranslation } from 'react-i18next';

const imagePrefix = "https://image.mileverse.com";
const GificonCategory = (props) =>{
    const { t } = useTranslation();
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
                    <ExtraBoldText text={t('use_giftcon_1')} customStyle={{fontSize:16}}/>
                </View>
                <ScrollView style={{backgroundColor:"#FFFFFF",marginTop:6}}>
                       <TouchableWithoutFeedback onPress={()=>setVisible(!visible)}>
                           <View style={{backgroundColor:'#333F68',justifyContent:"space-between",flex:1,height:106,alignItems:"center",flexDirection:"row"}}>
                                <View style={{paddingLeft:24}}>
                                   <BoldText text={t('use_giftcon_2')} customStyle={{color:"#F3C839",fontSize:18}}/>
                                   <RegularText text={t('use_giftcon_3')} customStyle={{color:"#FFFFFF",fontSize:11,marginTop:12}}/>
                               </View>
                               <Image source={require("../../assets/img/ico_speaker.png")} style={{resizeMode:"stretch",width:68,height:68,marginRight:16}}/>
                           </View>
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
                                                            <BoldText text={t(item.CTGR_NAME)} customStyle={styles.categoryText}/>
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
                        <BoldText text={t('use_giftcon_2')} customStyle={{fontSize:15}}/>
                        <TouchableWithoutFeedback onPress={()=>setVisible(!visible)}>
                            <View style={{width:50,height:50,justifyContent:"center",alignItems:"center"}}>
                                <Image source={require("../../assets/img/ico_close_bl.png")} style={{width:20,height:20}}/>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={{paddingTop:26,paddingBottom:60,paddingHorizontal:26}}>
                        <BoldText text={t('use_giftcon_4')} customStyle={styles.noticeTextHeader}/>
                        <RegularText text={t('use_giftcon_5')} customStyle={[styles.noticeText,{marginTop:20}]}/>
                        <RegularText text={t('use_giftcon_6')} customStyle={styles.noticeText}/>
                        <RegularText text={t('use_giftcon_7')} customStyle={styles.noticeText}/>
                        <BoldText text={t('use_giftcon_8')} customStyle={[styles.noticeTextHeader,{marginTop:36}]}/>
                        <RegularText text={t('use_giftcon_9')} customStyle={[styles.noticeText,{lineHeight:18,marginTop:20}]}/>
                        <RegularText text={t('use_giftcon_10')} customStyle={styles.noticeText}/>
                        <RegularText text={t('use_giftcon_11')} customStyle={styles.noticeText}/>
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
        backgroundColor:"#FFFFFF",
        elevation:2,
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 0.5,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.6,
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
        fontSize:14,
        textAlign:'center'
    },
    noticeHeaderWrap:{
        height:50,
        paddingLeft:26,
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