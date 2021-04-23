import React, { useEffect, useState } from 'react';
import { Image,View,SafeAreaView,StyleSheet, TouchableWithoutFeedback,SectionList, ImageBackground,TouchableOpacity } from 'react-native';
import { RegularText, ExtraBoldText, BoldText } from '../components/customComponents';
import CommonStatusbar from '../components/CommonStatusbar';
import Axios from '../modules/Axios';
import { useTranslation } from 'react-i18next';
import * as dialog from '../actions/dialog';
import { useDispatch } from 'react-redux';
const imagePrefix = "https://image.mileverse.com";
const GifticonList = (props) =>{
    const dispatch = useDispatch();
    const [gifticonList,setGificonList] = useState([]);
    const { t } = useTranslation();

    const handleCloseBtn = ()=>{
        props.navigation.goBack();
    }

    useEffect(()=>{
        Axios.get('/api/gifticon/v2/gifticon-list',{params:{category:props.route.params.ctgr_code}}).then((response)=>{
            if(response.data.filteredList.length === 0) {
                setTimeout(()=>{
                    dispatch(dialog.openDialog("alert",(
                        <>
                            <BoldText text={"해당 상품은 준비중입니다."} customStyle={{textAlign:"center"}}/>
                        </>
                    ),()=>{
                        dispatch(dialog.closeDialog());
                        props.navigation.goBack();
                    }));
                },500)
                
            } else {
                setGificonList(response.data.filteredList);
            }
        });
    },[])
    return (
        <>
            <CommonStatusbar backgroundColor="#F9F9F9"/>
            <SafeAreaView style={{flex:1,backgroundColor:"#FFFFFF"}}>
                <View style={[styles.header,styles.shadow]}>
                    <View style={{width:50}}></View>
                    <View style={[styles.headerIcoWrap,{flex:1}]}>
                        <ExtraBoldText text={t(props.route.params.ctgr_name)} customStyle={{fontSize:16,textAlign:'center'}}/>
                    </View>
                    <TouchableOpacity onPress={handleCloseBtn}>
                        <View style={styles.headerIcoWrap}>
                            <Image source={require("../../assets/img/ico_close_bl.png")} style={{width:20,height:20}}/>
                        </View>
                    </TouchableOpacity>
                </View>
                <SectionList
                    style={{}}
                    sections={gifticonList}
                    keyExtractor={({index}) => index}
                    ListHeaderComponent={
                        <>
                            <View style={{height:6,backgroundColor:"#F2F2F2"}}></View>
                            <ImageBackground style={{}} source={require("../../assets/img/gifticon_banner_bg.png")} style={{width:"100%",height:80,resizeMode:"stretch"}}>
                                <View style={{paddingTop:32,paddingLeft:26}}>
                                    <BoldText text={t('use_giftcon_12')} customStyle={{color:"#F3C839",fontSize:14}}/>
                                </View>
                            </ImageBackground>
                            <View style={{height:6,backgroundColor:"#F2F2F2",marginBottom:16}}></View>
                        </>
                    }
                    renderItem={({item}) => {
                        return (
                            <View style={{flexDirection:"row",flexWrap:'wrap',paddingHorizontal:8,justifyContent:"space-between",backgroundColor:"#FFFFFF",paddingBottom:16}}>
                                {
                                    item.row.map((item,index)=>{
                                        return (
                                            <TouchableWithoutFeedback key={index} onPress={()=>{
                                                    if(item.EVENT_GB === 'Y' && item.SOLDOUT_GB === 'Y') {
                                                        dispatch(dialog.openDialog("alert",(
                                                            <>
                                                                <BoldText text={"해당 상품은 재고가 소진되었습니다."} customStyle={{textAlign:"center"}}/>
                                                            </>
                                                        )));
                                                    } else {
                                                        props.navigation.navigate('GifticonDetail',{pdt_code:item.PDT_CODE})
                                                    }
                                                }}>
                                                <View style={{width:"50%",paddingHorizontal:8,marginTop:16}}>
                                                    <View style={[styles.shadow,{borderRadius:10}]}>
                                                        <View style={{justifyContent:"center",alignItems:"center",height:120}}>
                                                            <Image source={{uri:imagePrefix+item.PDT_IMAGE}} style={{resizeMode:'stretch',width:100,height:100}}/>
                                                        </View>
                                                        <View style={{backgroundColor:"#F6F6F6",padding:12,height:86,justifyContent:"space-between",borderBottomRightRadius:10,borderBottomLeftRadius:10}}>
                                                            <RegularText text={item.PDT_NAME} customStyle={{color:"#2B2B2B",lineHeight:20,fontSize:14}}/>
                                                            {
                                                                item.EVENT_GB === 'Y' ? (
                                                                    <View style={{marginTop:7,flexDirection:"row",alignItems:"center"}}>
                                                                        <ExtraBoldText text={`${item.SALE_RATIO}%`} customStyle={{fontSize:15,color:"#EE1818"}}/>
                                                                        <ExtraBoldText text={item.SALE_AMOUNT.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} customStyle={{fontSize:15,marginLeft:7}}/>
                                                                        <RegularText text={"MVP"} customStyle={{marginLeft:5,fontSize:13}}/>
                                                                    </View>
                                                                ) : (
                                                                    <View style={{marginTop:7,flexDirection:"row",alignItems:"center"}}>
                                                                        <ExtraBoldText text={item.PDT_AMOUNT.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} customStyle={{fontSize:15}}/>
                                                                        <RegularText text={"MVP"} customStyle={{marginLeft:5,fontSize:13}}/>
                                                                    </View>
                                                                )
                                                            }
                                                        </View>
                                                    </View>
                                                </View>
                                            </TouchableWithoutFeedback>
                                        );
                                    })
                                }
                            </View>
                        )
                    }}
                    renderSectionHeader={({ section: { title } }) => {
                        return (
                            <View style={{paddingTop:10,paddingLeft:16,backgroundColor:"#FFFFFF"}}>
                                <BoldText text={title} customStyle={{fontSize:15,color:"#2B2B2B"}} />
                            </View>
                        )
                    }}
                />
            </SafeAreaView>
        </>
    )
}


export default GifticonList;

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
        fontSize:12,
        color:"#3D3D3D"
    },
    noticeText:{
        fontSize:10,
        color:"#3D3D3D",
        marginTop:12
    }
});