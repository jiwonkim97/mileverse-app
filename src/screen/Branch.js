import React from 'react';
import { Image,View,SafeAreaView,StyleSheet, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { RegularText, ExtraBoldText } from '../components/customComponents';
import CommonStatusbar from '../components/CommonStatusbar';

const BranchScreen : () => React$Node = (props) =>{
    return (
        <>
            <CommonStatusbar backgroundColor="#F9F9F9"/>
            <SafeAreaView>
                <View style={styles.header}>
                    <ExtraBoldText text="가맹점 정보" customStyle={{color:"#707070",fontSize:16}}/>
                </View>
                <View style={{marginTop:20}}>
                    <ScrollView style={{height:"91%"}}>
                        <TouchableOpacity onPress={()=>props.navigation.navigate("MileVerseGiftScreen")}>
                            <View style={[styles.listWrap]}>
                                <View style={styles.imgWrap}>
                                    <Image source={require('../../assets/img/logo_c.png')} style={styles.imgSt}></Image>
                                    <RegularText text="마일벌스" customStyle={styles.logoTxt}/>
                                </View>
                                <View style={styles.branchTxt}>
                                    <RegularText text="마일벌스"/>
                                </View>
                            </View>
                        </TouchableOpacity>
                        <View style={[styles.listWrap,styles.inActive]}>
                            <View style={styles.imgWrap}>
                                <Image source={require('../../assets/img/store_2.png')} style={styles.imgSt}></Image>
                                <RegularText text="커피전문점" customStyle={styles.logoTxt}/>
                            </View>
                            <View style={styles.branchTxt}>
                                <RegularText text="COMMING SOON"/>
                            </View>
                        </View>
                        <View style={[styles.listWrap,styles.inActive]}>
                            <View style={styles.imgWrap}>
                                <Image source={require('../../assets/img/store_3.png')} style={styles.imgSt}></Image>
                                <RegularText text="편의점" customStyle={styles.logoTxt}/>
                            </View>
                            <View style={styles.branchTxt}>
                                <RegularText text="COMMING SOON"/>
                            </View>
                        </View>
                        <View style={[styles.listWrap,styles.inActive]}>
                            <View style={styles.imgWrap}>
                                <Image source={require('../../assets/img/store_4.png')} style={styles.imgSt}></Image>
                                <RegularText text="베이커리" customStyle={styles.logoTxt}/>
                            </View>
                            <View style={styles.branchTxt}>
                                <RegularText text="COMMING SOON"/>
                            </View>
                        </View>
                        <View style={[styles.listWrap,styles.inActive]}>
                            <View style={styles.imgWrap}>
                                <Image source={require('../../assets/img/store_5.png')} style={styles.imgSt}></Image>
                                <RegularText text="음식점" customStyle={styles.logoTxt}/>
                            </View>
                            <View style={styles.branchTxt}>
                                <RegularText text="COMMING SOON"/>
                            </View>
                        </View>
                        <View style={[styles.listWrap,styles.inActive]}>
                            <View style={styles.imgWrap}>
                                <Image source={require('../../assets/img/store_6.png')} style={styles.imgSt}></Image>
                                <RegularText text="극장" customStyle={styles.logoTxt}/>
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
// 마지막 줄 boderBottom 제거, borderRadius 설정해보기
export default BranchScreen;

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