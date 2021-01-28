import React from 'react';
import { Image,View,SafeAreaView,StyleSheet, ImageBackground,TouchableOpacity,ScrollView } from 'react-native';
import {ExtraBoldText,RegularText,BoldText} from '../components/customComponents';
import CommonStatusbar from '../components/CommonStatusbar';
import { useTranslation } from 'react-i18next';

const FaqScreen = (props) =>{
    const { t } = useTranslation();

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
                            <Image source={require("../../assets/img/ico_close_bl.png")} style={{width:20,height:20}}/>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{marginTop:6}}>
                    <ScrollView style={{marginBottom:56}}>
                        <View style={styles.noticeCard}>
                            <BoldText text={t("menu_faq_1")} customStyle={styles.question} />
                            <RegularText text={t("menu_faq_2")} customStyle={styles.answer} />
                        </View>
                        <View style={styles.noticeCard}>
                            <BoldText text={t("menu_faq_3")} customStyle={styles.question} />
                            <RegularText text={t("menu_faq_4")} customStyle={styles.answer} />
                        </View>
                        <View style={styles.noticeCard}>
                            <BoldText text={t("menu_faq_5")} customStyle={styles.question} />
                            <RegularText text={t("menu_faq_6")} customStyle={styles.answer} />
                        </View>
                        <View style={styles.noticeCard}>
                            <BoldText text={t("menu_faq_7")} customStyle={styles.question} />
                            <RegularText text={t("menu_faq_8")} customStyle={styles.answer} />
                        </View>
                        <View style={styles.noticeCard}>
                            <BoldText text={t("menu_faq_9")} customStyle={styles.question} />
                            <RegularText text={t("menu_faq_10")} customStyle={styles.answer} />
                        </View>
                        <View style={styles.noticeCard}>
                            <BoldText text={t("menu_faq_11")} customStyle={styles.question} />
                            <RegularText text={t("menu_faq_12")} customStyle={styles.answer} />
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
    },
    answer:{
        lineHeight:20,
        marginTop:8,
        paddingLeft:18
    }
});