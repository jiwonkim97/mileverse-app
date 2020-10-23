import React from 'react';
import { Image,View,SafeAreaView,StyleSheet, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { RegularText, ExtraBoldText } from '../components/customComponents';
import CommonStatusbar from '../components/CommonStatusbar';


const ChangeScreen : () => React$Node = (props) =>{
    return (
        <>
        <CommonStatusbar backgroundColor="#F9F9F9"/>
        <SafeAreaView>
                <View style={styles.header}>
                    <ExtraBoldText text="마일리지 교환" customStyle={{color:"#707070"}}/>
                </View>
                <View style={{marginTop:20}}>
                    <ScrollView style={{height:"91%"}}>
                        <TouchableOpacity onPress={()=>props.navigation.navigate("MileVerse")}>
                            <View style={[styles.listWrap]}>
                                <View style={styles.imgWrap}>
                                    <Image source={require('../../assets/img/logo_c.png')} style={styles.imgSt}></Image>
                                    <RegularText text="마일벌스" customStyle={styles.logoTxt}/>
                                </View>
                                <View style={styles.branchTxt}>
                                    <RegularText text="1P ▶ 1MVP"/>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <View style={[styles.listWrap,styles.inActive]}>
                            <View style={styles.imgWrap}>
                                <Image source={require('../../assets/img/mile_2.png')} style={styles.imgSt}></Image>
                                <RegularText text="신용카드" customStyle={styles.logoTxt}/>
                            </View>
                            <View style={styles.branchTxt}>
                                <RegularText text="COMMING SOON"/>
                            </View>
                        </View>
                        <View style={[styles.listWrap,styles.inActive]}>
                            <View style={styles.imgWrap}>
                                <Image source={require('../../assets/img/mile_3.png')} style={styles.imgSt}></Image>
                                <RegularText text="이커머스" customStyle={styles.logoTxt}/>
                            </View>
                            <View style={styles.branchTxt}>
                                <RegularText text="COMMING SOON"/>
                            </View>
                        </View>
                        <View style={[styles.listWrap,styles.inActive]}>
                            <View style={styles.imgWrap}>
                                <Image source={require('../../assets/img/mile_4.png')} style={styles.imgSt}></Image>
                                <RegularText text="항공사" customStyle={styles.logoTxt}/>
                            </View>
                            <View style={styles.branchTxt}>
                                <RegularText text="COMMING SOON"/>
                            </View>
                        </View>
                        <View style={[styles.listWrap,styles.inActive]}>
                            <View style={styles.imgWrap}>
                                <Image source={require('../../assets/img/mile_5.png')} style={styles.imgSt}></Image>
                                <RegularText text="주유소" customStyle={styles.logoTxt}/>
                            </View>
                            <View style={styles.branchTxt}>
                                <RegularText text="COMMING SOON"/>
                            </View>
                        </View>
                        <View style={[styles.listWrap,styles.inActive]}>
                            <View style={styles.imgWrap}>
                                <Image source={require('../../assets/img/mile_6.png')} style={styles.imgSt}></Image>
                                <RegularText text="통신사" customStyle={styles.logoTxt}/>
                            </View>
                            <View style={styles.branchTxt}>
                                <RegularText text="COMMING SOON"/>
                            </View>
                        </View>
                        
                    </ScrollView>
                </View>
            </SafeAreaView>
        </>
        
    )
}

export default ChangeScreen;

const styles = StyleSheet.create({
    header:{
        backgroundColor:"white",
        height:60,
        justifyContent:'center',
        alignItems:'center',
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
    listWrap:{
        flex:1,
        flexDirection:'row',
        paddingHorizontal:18,
        paddingVertical:15,
        backgroundColor:'white',
        borderBottomWidth:1,
        borderBottomColor:"#E3E3E3"
    },
    logoTxt:{
        marginTop:8
    },
    imgWrap:{
        flex:1,
        alignItems:"center"
    },
    imgSt:{
        resizeMode:'contain',
        height:35
    },
    branchTxt:{
        flex:2,
        justifyContent:'center',
        marginLeft:10
    },
    inActive:{
        opacity:0.3
    }
});