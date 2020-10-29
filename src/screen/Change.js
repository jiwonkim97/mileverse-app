import React from 'react';
import { Image,View,SafeAreaView,StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { RegularText, ExtraBoldText, BoldText } from '../components/customComponents';
import CommonStatusbar from '../components/CommonStatusbar';


const ChangeScreen = (props) =>{
    const doBuyCard = (target)=>{
        const _item = target === "10" ? "1만원권" : "5천원권";
        alert(_item+" 구매!")
    }
    return (
        <>
            <CommonStatusbar backgroundColor="#F9F9F9"/>
            <SafeAreaView>
                <View style={[styles.shadow,styles.header]}>
                    <ExtraBoldText text="마일리지 교환" customStyle={{color:"#707070",fontSize:16}}/>
                </View>
                <View style={{marginVertical:6,backgroundColor:"#394054",width:"100%",padding:24}}>
                    <BoldText text={"[필수공지]"} customStyle={styles.bannerTitle}/>
                    <RegularText text={"본 상품은 구매 후 환불이 불가능합니다."} customStyle={styles.bannerText}/>
                    <BoldText text={"[이용안내]"} customStyle={[styles.bannerTitle,{marginTop:20}]}/>
                    <RegularText text={"구매한 MVP는 앱에서 이용이 가능합니다."} customStyle={styles.bannerText}/>
                    <RegularText text={"MVP는 1원의 가치를 지니고 있습니다."} customStyle={styles.bannerText}/>
                </View>
                <View style={{backgroundColor:"#FFFFFF",paddingHorizontal:16,paddingTop:26,height:"100%"}}>
                    <BoldText text={"MVP 상품권 구매"} customStyle={styles.itemTitle}/>
                    <View style={{marginTop:16,flexDirection:'row'}}>
                        <TouchableWithoutFeedback onPress={()=>doBuyCard("10")}>
                            <View style={[styles.cardWrap,styles.shadow]}>
                                <View style={styles.cardImgWrap}>
                                    <Image source={require("../../assets/img/mvp_gift_10.png")} style={styles.cardImg}/>
                                </View>
                                <View style={styles.cardTextWrap}>
                                    <BoldText text={"MVP 1만원권"} customStyle={styles.salesTitle}/>
                                    <View style={styles.salesWrap}>
                                        <ExtraBoldText text={"10%"} customStyle={styles.sales}/>
                                        <ExtraBoldText text={"9,000원"} customStyle={styles.salesPrice}/>
                                        <BoldText text={"10,000원"} customStyle={styles.price}/>
                                    </View>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                        <View style={{width:16}} />
                        <TouchableWithoutFeedback onPress={()=>doBuyCard("05")}>
                            <View style={[styles.cardWrap,styles.shadow]}>
                                <View style={styles.cardImgWrap}>
                                    <Image source={require("../../assets/img/mvp_gift_05.png")} style={styles.cardImg}/>
                                </View>
                                <View style={styles.cardTextWrap}>
                                    <BoldText text={"MVP 5천원권"} customStyle={styles.salesTitle}/>
                                    <View style={styles.salesWrap}>
                                        <ExtraBoldText text={"5%"} customStyle={styles.sales}/>
                                        <ExtraBoldText text={"4,750원"} customStyle={styles.salesPrice}/>
                                        <BoldText text={"5,000원"} customStyle={styles.price}/>
                                    </View>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <BoldText text={"MVP 교환"} customStyle={[styles.itemTitle,{marginTop:26}]}/>
                    <View style={{marginTop:16,borderRadius:10,justifyContent:"center",alignItems:"center",overflow:"hidden"}}>
                        <View style={{marginVertical:13}}>
                            <Image source={require("../../assets/img/logo_healthPick.png")} />
                        </View>
                        <View style={styles.mask} />
                        <ExtraBoldText text={"Coming soon"} customStyle={{fontSize:20,color:"#FFFFFF",position:"absolute"}}/>
                    </View>
                </View>
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
        fontSize:14,
        color:"#2B2B2B"
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
        fontSize:10
    },
    sales:{
        fontSize:11,
        color:"#EE1818"
    },
    price:{
        fontSize:8,
        color:"#858585",
        marginLeft:4,
        textDecorationLine: 'line-through'
    },
    salesPrice:{
        fontSize:11,
        color:"#2B2B2B",
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
    }
});