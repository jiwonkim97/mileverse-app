import React, {useState,useEffect} from 'react';
import { View,StyleSheet,SafeAreaView,TouchableWithoutFeedback,Image,TouchableOpacity } from 'react-native';
import CommonStatusbar from '../components/CommonStatusbar';
import { ExtraBoldText,BoldText } from '../components/customComponents';
import Axios from '../modules/Axios';
import { useTranslation } from 'react-i18next';

const Profile = (props) =>{
    const { t } = useTranslation();
    const [id,setId] = useState("");
    const [name,setName] = useState("");
    const [phone,setPhone] = useState("");

    useEffect(()=>{
        Axios.get("/users/profile").then(({data})=>{
            const {info} = data
            setId(info.U_ID);
            setName(info.U_NAME);
            setPhone(info.U_PHN_NMB);
        })
    },[]);

    return (
        <>
            <CommonStatusbar backgroundColor="#F9F9F9"/>
            <SafeAreaView style={{backgroundColor:"#EEEEEE",flex:1}}>
                <View style={[styles.header,styles.shadow]}>
                    <View style={{width:50}}></View>
                    <View style={[styles.headerIcoWrap,{flex:1}]}>
                        <ExtraBoldText text={t('menu_3')} customStyle={{fontSize:16}}/>
                    </View>
                    <TouchableOpacity onPress={()=>props.navigation.goBack()}>
                        <View style={styles.headerIcoWrap}>
                            <Image source={require("../../assets/img/ico_close_bl.png")} style={{width:20,height:20}}/>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{padding:16,backgroundColor:"#FFFFFF"}}>
                    <View style={styles.border}>
                        <View style={styles.itemWrap}>
                            <BoldText text={t('menu_info_1')} customStyle={styles.itemLabel}/>
                            <BoldText text={id} customStyle={styles.itemLabel}/>
                        </View>
                        <View style={styles.itemWrap}>
                            <BoldText text={t('menu_info_2')} customStyle={styles.itemLabel}/>
                            <BoldText text={name} customStyle={styles.itemLabel}/>
                        </View>
                        <View style={{padding:16,flexDirection:"row",justifyContent:"space-between"}}>
                            <BoldText text={t('menu_info_3')} customStyle={styles.itemLabel}/>
                            <BoldText text={phone} customStyle={styles.itemLabel}/>
                        </View>
                    </View>
                    <View style={[styles.border,{marginTop:16}]}>
                        <TouchableWithoutFeedback onPress={()=>props.navigation.navigate("ChangePassword")}>
                            <View style={[styles.itemWrap,{alignItems:"center"}]}>
                                <BoldText text={t('menu_info_4')} customStyle={styles.itemLabel}/>
                                <Image source={require('../../assets/img/ico_bracket.png')} style={styles.bracket}/>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={()=>props.navigation.navigate("PinCode",{mode:"set"})}>
                            <View style={{padding:16,flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
                                <BoldText text={t('menu_info_5')} customStyle={styles.itemLabel}/>
                                <Image source={require('../../assets/img/ico_bracket.png')} style={styles.bracket}/>
                            </View>
                        </TouchableWithoutFeedback>
                        
                    </View>
                    <View style={[styles.border,{marginTop:16,padding:16}]}>
                        <TouchableWithoutFeedback onPress={()=>props.navigation.navigate("WithDraw")}>
                            <View>
                                <BoldText text={t('menu_info_6')} customStyle={{color:"#A2A2A2",fontSize:12}}/>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            </SafeAreaView>
        </>
    )
}
        
export default Profile;

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
    itemLabel:{
        color:"#707070",
        fontSize:12
    },
    border:{
        borderRadius:6,
        borderColor:"#E5E5E5",
        borderWidth:1
    },
    bracket:{
        resizeMode:"stretch",
        width:8,
        height:16
    },
    itemWrap:{
        borderBottomColor:"#E5E5E5",
        borderBottomWidth:1,
        padding:16,
        flexDirection:"row",
        justifyContent:"space-between"
    }
});