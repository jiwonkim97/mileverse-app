import React from 'react';
import { Image,Text,View,SafeAreaView,StyleSheet, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { RegularText, ExtraBoldText } from '../components/customComponents';

const ChangeScreen : () => React$Node = (props) =>{
    return (
        <SafeAreaView>
            <View style={styles.header}>
                <ExtraBoldText text="마일리지 교환" customStyle={{color:"#707070"}}/>
                <TouchableOpacity onPress={()=>props.navigation.goBack()}style={{position:'absolute',top:-10,left:20}}>
                    <Image source={require('../../assets/img/ico_back.png')} style={{resizeMode:"contain", width:10}}></Image>
                </TouchableOpacity>
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
    )
}
// 마지막 줄 boderBottom 제거, borderRadius 설정해보기
export default ChangeScreen;

const styles = StyleSheet.create({
    header:{
        backgroundColor:"white",
        height:60,
        justifyContent:'center',
        alignItems:'center',
        elevation:2,
        shadowOffset:0.20,
        shadowRadius:1.41,
        shadowOffset:{width:0,height:1}
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
        backgroundColor:"#000000",
        opacity:0.3
    }
});