import React, { useEffect } from 'react';
import { Image,View,SafeAreaView,TouchableOpacity,StyleSheet,BackHandler} from 'react-native';
import CommonStatusbar from '../../components/CommonStatusbar';
import { ExtraBoldText, BoldText } from '../../components/customComponents';
import { useTranslation } from 'react-i18next';

export default ({navigation,route})=>{
    const { t } = useTranslation();

    useEffect(()=>{
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            ()=>{
                return true;
            });
            return ()=> backHandler.remove();
    },[]);

    const commaFormat = (num)=>{
        const parts = String(num).split(".")
        return parts[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    return (
        <>
            <CommonStatusbar backgroundColor="#F9F9F9"/>
            <SafeAreaView style={{backgroundColor:"#FFFFFF",flex:1}}>
                <View style={[styles.header,styles.shadow]}>
                    <View style={{width:50}}>
                    </View>
                    <View style={[styles.headerIcoWrap,{flex:1}]}>
                        <ExtraBoldText text={route.params.header} customStyle={{fontSize:16}}/>
                    </View>
                    <TouchableOpacity onPress={()=>navigation.navigate("Change")}>
                        <View style={styles.headerIcoWrap}>
                            <Image source={require("../../../assets/img/ico_close_bl.png")} style={{width:20,height:20}}/>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{flex:1,justifyContent:"space-between"}}>
                    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                        <ExtraBoldText text={`${commaFormat(route.params.amount)} MVP\n${t('alert_exchange_1')}`} customStyle={{fontSize:18,lineHeight:26,textAlign:"center"}}/>
                    </View>
                    <TouchableOpacity onPress={()=>navigation.navigate("Change")}>
                        <View style={{height:50,backgroundColor:"#8D3981",justifyContent:"center",alignItems:"center"}}>
                            <BoldText text={t("common_confirm_1")} customStyle={{color:"#FFFFFF",fontSize:16}}/>
                        </View>
                    </TouchableOpacity>
                    
                </View>
            </SafeAreaView>
        </>
    )
}

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
    },
    item:{
        marginTop:26
    },
    boxWrap:{
        marginTop:16,
        borderRadius:6,
        borderColor:"#E5E5E5",
        borderWidth:1,
        paddingHorizontal:16,
        height:46
    },
    percentBox:{
        borderWidth:1,
        borderRadius:6,
        borderColor:"#E5E5E5",
        paddingVertical:11,
        paddingHorizontal:12 
    },
    percentText:{
        color:"#707070"
    },
    input:{
        padding:0,
        fontFamily:"NotoSans-Regular",
        maxWidth:200
    },
    noticeText:{
        color:"#3A3A3A",
        fontSize:12
    },
    modalItemGap:{
        marginTop:16
    },
    modalItemBox:{
        marginTop:10,
        backgroundColor:"#F3F3F3",
        borderColor:"#F3F3F3",
        borderRadius:6,
        paddingVertical:13,
        paddingHorizontal:16
    },
    modalItemText:{
        fontSize:12,
        color:'#3A3A3A'
    },
    modalBottomBtn:{
        flex:1,
        justifyContent:"center",
        alignItems:"center"
    }
});