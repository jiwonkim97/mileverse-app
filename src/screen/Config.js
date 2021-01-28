import React, {useState,useEffect} from 'react';
import { useSelector } from 'react-redux';
import { View,StyleSheet,SafeAreaView,TouchableWithoutFeedback,Image,Platform,ScrollView,TouchableOpacity} from 'react-native';
import ToggleSwitch from 'toggle-switch-react-native'

import CommonStatusbar from '../components/CommonStatusbar';
import { ExtraBoldText,BoldText,RegularText } from '../components/customComponents';
import AsyncStorage from '@react-native-community/async-storage';
import Axios from '../modules/Axios';
import Modal from 'react-native-modal';
import { useTranslation } from 'react-i18next';

const Config = (props) =>{
    const { t } = useTranslation();
    const [autoLogin, setAutoLogin] = useState(false);
    const [serverPush, setServerPush] = useState(false);
    const [localPush, setLocalPush] = useState(false);
    const [versionText,setVersionText] = useState("");
    const [modal,setModal] = useState(false);
    const [modalMode,setModalMode] = useState("");
    const [terms,setTerms] = useState("");
    const [privacy,setPrivacy] = useState("");

    const _ver = useSelector(state => state.global.version);


    useEffect(()=>{
        const setToggle = async()=>{
            const loginStorage = await AsyncStorage.getItem("@loginStorage");
            const configStorage = await AsyncStorage.getItem("@configStorage");
            setAutoLogin(JSON.parse(loginStorage).autoLogin);
            if( configStorage !== null ) {
                setServerPush(JSON.parse(configStorage).serverPush)
                setLocalPush(JSON.parse(configStorage).localPush)
            }
            Axios.get("/api/notice/version",{params:{os:Platform.OS}}).then(({data})=>{
                if(data.result === "success") {
                    if(_ver === data.version) setVersionText(t('alert_setting_1'))
                    else setVersionText(t('alert_setting_2'))
                }
            });
            Axios.get('/get/terms').then((response)=>{
                setTerms(response.data.content);
            });
            Axios.get('/get/privacy').then((response)=>{
                setPrivacy(response.data.content);
            });
        }
        setToggle();
    },[]);
    return (
        <>
            <CommonStatusbar backgroundColor="#F9F9F9"/>
            <SafeAreaView style={{backgroundColor:"#FFFFFF",flex:1}}>
                <View style={[styles.header,styles.shadow]}>
                        <View style={{width:50}}>
                        </View>
                    <View style={[styles.headerIcoWrap,{flex:1}]}>
                        <ExtraBoldText text={t('menu_setting_0')} customStyle={{fontSize:16}}/>
                    </View>
                    <TouchableOpacity onPress={()=>props.navigation.goBack()}>
                        <View style={styles.headerIcoWrap}>
                            <Image source={require("../../assets/img/ico_close_bl.png")} style={{width:20,height:20}}/>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{padding:16,justifyContent:"space-between",flex:1}}>
                    <View>
                        <View style={styles.border}>
                            <View style={[styles.align,{backgroundColor:"#EEEEEE"}]}>
                                <BoldText text={t('menu_setting_1')} customStyle={{color:"#2B2B2B",fontSize:14}}/>
                                <View style={{flexDirection:"row"}}>
                                    <BoldText text={versionText} customStyle={{color:"#2B2B2B",fontSize:11}}/>
                                    <BoldText text={"V"+_ver} customStyle={{color:"#2B2B2B",fontSize:12,marginLeft:10}}/>
                                </View>
                            </View>
                            <View style={{ padding:16,flexDirection:'row',justifyContent:"space-between",alignItems:"center"}}>
                                <BoldText text={t('menu_setting_2')} customStyle={{color:"#2B2B2B",fontSize:14}}/>
                                <ToggleSwitch
                                    isOn={autoLogin}
                                    onColor="#8D3981"
                                    offColor="#C9C9C9"
                                    onToggle={isOn => {
                                        setAutoLogin(isOn);
                                        AsyncStorage.mergeItem("@loginStorage",JSON.stringify({autoLogin:isOn}));
                                    }}
                                />
                            </View>
                        </View>
                        <View style={[styles.border,{marginTop:12}]}>
                            <View style={[styles.align,{backgroundColor:"#EEEEEE"}]}>
                                <BoldText text={t('menu_setting_3')} customStyle={{color:"#2B2B2B",fontSize:14}}/>
                            </View>
                            <View style={{ padding:16,flexDirection:'row',justifyContent:"space-between",alignItems:"center"}}>
                                <BoldText text={t('menu_setting_4')} customStyle={{color:"#2B2B2B",fontSize:14}}/>
                                <ToggleSwitch
                                    isOn={serverPush}
                                    onColor="#8D3981"
                                    offColor="#C9C9C9"
                                    onToggle={isOn => {
                                        setServerPush(isOn);
                                        AsyncStorage.mergeItem("@configStorage",JSON.stringify({serverPush:isOn}));
                                    }}
                                />
                            </View>
                            <View style={styles.align}>
                                <BoldText text={t('menu_setting_5')} customStyle={{color:"#2B2B2B",fontSize:14}}/>
                                <ToggleSwitch
                                    isOn={localPush}
                                    onColor="#8D3981"
                                    offColor="#C9C9C9"
                                    onToggle={isOn => {
                                        setLocalPush(isOn);
                                        AsyncStorage.mergeItem("@configStorage",JSON.stringify({localPush:isOn}));
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                    <View>
                        <View style={[styles.border,{padding:16}]}>
                            <TouchableWithoutFeedback onPress={()=>{
                                setModalMode("terms");
                                setModal(!modal)
                            }}>
                                <View>
                                    <RegularText text={t('menu_setting_9')} customStyle={styles.rgText} />
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={()=>{
                                setModalMode("privacy");
                                setModal(!modal)
                            }}>
                                <View style={{marginTop:10}}>
                                    <RegularText text={t('menu_setting_10')} customStyle={styles.rgText} />
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                </View>
                <Modal isVisible={modal} backdropTransitionOutTiming={0} style={{margin: 0,justifyContent:"center",alignItems:"center"}} useNativeDriver={true}>
                    <View style={{backgroundColor:"#FFFFFF",borderRadius:6,width:"90%",maxHeight:"80%",flex:1,overflow:"hidden"}}>
                        <View style={{alignItems:'flex-end',paddingRight:16,paddingTop:16}}>
                            <TouchableWithoutFeedback onPress={()=>setModal(!modal)}>
                                <Image source={require('../../assets/img/ico_close_bl.png')} style={{width:20,height:20,resizeMode:'contain'}}/>
                            </TouchableWithoutFeedback>
                        </View>
                        <ScrollView style={{paddingHorizontal:20,marginBottom:20}}>
                            <BoldText text={modalMode==="terms"? terms : privacy} customStyle={{fontSize:12,color:'#3D3D3D',lineHeight:23}}/>
                        </ScrollView>
                    </View>
                </Modal>
            </SafeAreaView>
        </>
    )
}
        
export default Config;

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
    input:{
        height:20,
        paddingVertical:0,
        flex:1,
        fontFamily:"NanumSquareB"
    },
    rgText:{
        color:'#6C8DE8',
        fontSize:12
    },
    border:{
        borderWidth:1,
        borderColor:"#E5E5E5",
        borderRadius:6   
    },
    align:{
        padding:16,
        flexDirection:'row',
        justifyContent:"space-between",
        alignItems:"center"
    }
});