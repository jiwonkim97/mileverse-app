import React from 'react';
import { Image,View,SafeAreaView,StyleSheet, ImageBackground,TouchableOpacity } from 'react-native';
import {ExtraBoldText,RegularText,BoldText} from '../components/customComponents';
import { ScrollView } from 'react-native-gesture-handler';
import CommonStatusbar from '../components/CommonStatusbar';


const FaqScreen = (props) =>{
    return (
        <>
            <CommonStatusbar backgroundColor="#F9F9F9"/>
            <SafeAreaView>
                <View style={styles.header}>
                    <ExtraBoldText text={"FAQ"} customStyle={{fontSize:16}}></ExtraBoldText>
                    <TouchableOpacity onPress={()=>props.navigation.goBack()}style={{position:'absolute',top:-10,left:20}}>
                        <Image source={require('../../assets/img/ico_back.png')} style={{resizeMode:"contain", width:10}}></Image>
                    </TouchableOpacity>
                </View>
                <ImageBackground source={require('../../assets/img/pay_bg.png')} style={{width:"100%",height:"95%",resizeMode:'contain'}}>
                    <View style={{marginTop:20}}>
                        <ScrollView style={{height:"93%"}}>
                            <View style={styles.noticeCard}>
                                <BoldText text={"Q. 마일벌스 포인트가 무엇인가요?"} customStyle={styles.question} />
                                <RegularText text={"MVP로 교환할 수 있는 마일리지 입니다."} customStyle={styles.answer} />
                            </View>
                            <View style={styles.noticeCard}>
                                <BoldText text={"Q. 어떻게 교환하나요?"} customStyle={styles.question} />
                                <RegularText text={"마일벌스 제휴 기업의 마일리지를 교환할 수 있습니다."} customStyle={styles.answer} />
                            </View>
                            <View style={styles.noticeCard}>
                                <BoldText text={"Q. 어디서 사용하나요?"} customStyle={styles.question} />
                                <RegularText text={"마일벌스 제휴 가맹점에서 사용할 수 있습니다."} customStyle={styles.answer} />
                            </View>
                            <View style={styles.noticeCard}>
                                <BoldText text={"Q. MVP는 얼마인가요?"} customStyle={styles.question} />
                                <RegularText text={"MVP는 원화 1원으로 측정됩니다."} customStyle={styles.answer} />
                            </View>
                            <View style={styles.noticeCard}>
                                <BoldText text={"Q. MVP로 교환하면 유효기간이 있나요?"} customStyle={styles.question} />
                                <RegularText text={"MVP는 유효기간의 제한없이 이용할 수 있습니다."} customStyle={styles.answer} />
                            </View>
                            <View style={styles.noticeCard}>
                                <BoldText text={"Q. MVP는 얼마부터 사용할 수 있나요?"} customStyle={styles.question} />
                                <RegularText text={"1MVP(1원)부터 제한없이 이용 가능합니다."} customStyle={styles.answer} />
                            </View>
                        </ScrollView>
                    </View>    
                </ImageBackground>
            </SafeAreaView>
        </>
        
    )
}

export default FaqScreen;

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
    noticeCard:{
        backgroundColor:"white",
        paddingHorizontal:20,
        paddingVertical:26,
        borderWidth:1,
        borderColor:"#E3E3E3"
    },
    question:{
        color:"#535353",
        lineHeight:20,
        fontWeight:"bold"
    },
    answer:{
        color:"#535353",
        lineHeight:20,
        marginTop:8,
        paddingLeft:18
    }
});