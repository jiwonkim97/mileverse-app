import React from 'react';
import { Image,View,SafeAreaView,StyleSheet, ImageBackground,TouchableOpacity,ScrollView } from 'react-native';
import {ExtraBoldText,RegularText,BoldText} from '../components/customComponents';
import CommonStatusbar from '../components/CommonStatusbar';


const FaqScreen = (props) =>{
    return (
        <>
            <CommonStatusbar backgroundColor="#F9F9F9"/>
            <SafeAreaView style={{flex:1}}>
                <View style={[styles.header,styles.shadow]}>
                    <View style={{width:50}}></View>
                    <View style={[styles.headerIcoWrap,{flex:1}]}>
                        <ExtraBoldText text={"FAQ"} customStyle={{fontSize:16}}/>
                    </View>
                    <TouchableOpacity onPress={()=>props.navigation.goBack()}>
                        <View style={styles.headerIcoWrap}>
                            <Image source={require("../../assets/img/ico_close_bl.png")} style={{width:14,height:14}}/>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{marginTop:6}}>
                    <ScrollView style={{marginBottom:56}}>
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
            </SafeAreaView>
        </>
        
    )
}

export default FaqScreen;

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
    noticeCard:{
        backgroundColor:"white",
        paddingHorizontal:20,
        paddingVertical:26,
        borderWidth:1,
        borderColor:"#F2F2F2"
    },
    question:{
        lineHeight:20,
        fontWeight:"bold"
    },
    answer:{
        lineHeight:20,
        marginTop:8,
        paddingLeft:18
    }
});