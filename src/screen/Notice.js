import React,{useEffect,useState} from 'react';
import { View,SafeAreaView,StyleSheet,TouchableOpacity,Image,ScrollView } from 'react-native';
import {ExtraBoldText,RegularText,BoldText} from '../components/customComponents';
import CommonStatusbar from '../components/CommonStatusbar';
import Axios from '../modules/Axios';
import { useTranslation } from 'react-i18next';

const NoticeScreen = (props) =>{
    const [lists,setLists] = useState([]);
    const { t } = useTranslation();
    useEffect(()=>{
        const getData = async()=>{
            const {data} = await Axios.get("/api/notice");
            setLists(data.rows);
        }
        getData();
    },[])
    return (
        <>
            <CommonStatusbar backgroundColor="#F9F9F9"/>
            <SafeAreaView style={{flex:1}}>
                <View style={[styles.header,styles.shadow]}>
                    <View style={{width:50}}></View>
                    <View style={[styles.headerIcoWrap,{flex:1}]}>
                        <ExtraBoldText text={t("menu_5")} customStyle={{fontSize:16}}/>
                    </View>
                    <TouchableOpacity onPress={()=>props.navigation.goBack()}>
                        <View style={styles.headerIcoWrap}>
                            <Image source={require("../../assets/img/ico_close_bl.png")} style={{width:20,height:20}}/>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{marginTop:6}}>
                    <ScrollView style={{marginBottom:56}}>
                        {
                            lists.map((item,idx)=>{
                                return (
                                    <View style={styles.noticeCard} key={idx}>
                                        <BoldText text={item.TITLE} customStyle={{marginBottom:20}}/>
                                        <RegularText text={item.CONTENTS} customStyle={styles.NoticeTxt}/>
                                    </View>
                                )
                            })
                        }
                    </ScrollView>
                </View>    
            </SafeAreaView>
        </>
        
    )
}

export default NoticeScreen;

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
        zIndex:1
    },
    noticeCard:{
        backgroundColor:"white",
        paddingHorizontal:20,
        paddingVertical:30,
        borderWidth:1,
        borderColor:"#F2F2F2"
    },
    NoticeTxt:{
        lineHeight:20
    }
});