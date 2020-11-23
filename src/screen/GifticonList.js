import React, { useEffect, useState } from 'react';
import { Image,View,SafeAreaView,StyleSheet, TouchableWithoutFeedback,SectionList, ImageBackground } from 'react-native';
import { RegularText, ExtraBoldText, BoldText } from '../components/customComponents';
import CommonStatusbar from '../components/CommonStatusbar';
import Axios from '../modules/Axios';

const imagePrefix = "https://mv-image.s3.ap-northeast-2.amazonaws.com";
const GifticonList = (props) =>{
    const [gifticonList,setGificonList] = useState([]);

    useEffect(()=>{
        Axios.get('/api/gifticon/gifticon-list',{params:{category:props.route.params.ctgr_code}}).then((response)=>{
            setGificonList(response.data.filteredList)
        });
    },[])
    return (
        <>
            <CommonStatusbar backgroundColor="#F9F9F9"/>
            <SafeAreaView style={{flex:1}}>
                <View style={[styles.header,styles.shadow]}>
                    <ExtraBoldText text={props.route.params.ctgr_name.replace(',','/')} customStyle={{color:"#707070",fontSize:16}}/>
                    <TouchableWithoutFeedback onPress={()=>props.navigation.goBack()} >
                        <Image source={require('../../assets/img/ico_back.png')} style={{position:'absolute',resizeMode:"contain", width:10,left:20}}></Image>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={()=>props.navigation.navigate("Home")}>
                        <Image source={require("../../assets/img/ico_close_bl.png")} style={{width:14,height:14,position:'absolute',right:20}}/>
                    </TouchableWithoutFeedback>
                </View>
                <SectionList
                    style={{marginTop:6}}
                    sections={gifticonList}
                    keyExtractor={({index}) => index}
                    ListHeaderComponent={
                        <>
                            <ImageBackground style={{marginBottom:6}} source={require("../../assets/img/gifticon_banner_bg.png")} style={{width:"100%",height:80,resizeMode:"stretch"}}>
                                <View style={{paddingTop:32,paddingLeft:26}}>
                                    <BoldText text={"다양한 기프티콘을 만나보세요!"} customStyle={{color:"#F3C839",fontSize:14}}/>
                                </View>
                            </ImageBackground>
                            <View style={{height:16,backgroundColor:"#FFFFFF"}}></View>
                        </>
                    }
                    renderItem={({item}) => {
                        return (
                            <View style={{flexDirection:"row",flexWrap:'wrap',paddingHorizontal:8,justifyContent:"space-between",backgroundColor:"#FFFFFF",paddingBottom:16}}>
                                {
                                    item.row.map((item,index)=>{
                                        return (
                                            <TouchableWithoutFeedback key={index} onPress={()=>{props.navigation.navigate('GifticonDetail',{pdt_code:item.PDT_CODE})}}>
                                                <View style={{width:"50%",paddingHorizontal:8,marginTop:16}}>
                                                    <View style={[styles.shadow,{borderRadius:10,overflow:"hidden"}]}>
                                                        <View style={{justifyContent:"center",alignItems:"center",height:120}}>
                                                            <Image source={{uri:imagePrefix+item.PDT_IMAGE}} style={{resizeMode:'stretch',width:100,height:100}}/>
                                                        </View>
                                                        <View style={{backgroundColor:"#F6F6F6",padding:12,height:86,justifyContent:"space-between"}}>
                                                            <RegularText text={item.PDT_NAME} customStyle={{color:"#2B2B2B",lineHeight:20,fontSize:14}}/>
                                                            <View style={{marginTop:7,flexDirection:"row",alignItems:"center"}}>
                                                                <ExtraBoldText text={item.PDT_AMOUNT.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} customStyle={{fontSize:15}}/>
                                                                <RegularText text={"원"} customStyle={{marginLeft:1,fontSize:13}}/>
                                                            </View>
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
        fontSize:12,
        color:"#3D3D3D"
    },
    noticeText:{
        fontSize:10,
        color:"#3D3D3D",
        marginTop:12
    }
});