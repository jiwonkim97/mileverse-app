import React, {useState,useEffect} from 'react';
import { useSelector } from 'react-redux';
import { View,StyleSheet,SafeAreaView,TouchableWithoutFeedback,Image,Platform,ScrollView } from 'react-native';
import ToggleSwitch from 'toggle-switch-react-native'

import CommonStatusbar from '../components/CommonStatusbar';
import { ExtraBoldText,BoldText,RegularText } from '../components/customComponents';
import AsyncStorage from '@react-native-community/async-storage';
import Axios from '../modules/Axios';
import Modal from 'react-native-modal';


const Config = (props) =>{
    const [autoLogin, setAutoLogin] = useState(false);
    const [serverPush, setServerPush] = useState(false);
    const [localPush, setLocalPush] = useState(false);
    const [versionText,setVersionText] = useState("");
    const [modal,setModal] = useState(false);
    const [modalMode,setModalMode] = useState("");
    const [terms,setTerms] = useState("");
    const [info,setInfo] = useState("");

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
                    if(_ver === data.version) setVersionText("최신버전입니다.")
                    else setVersionText("최신버전이 아닙니다.")
                }
            });
            const {data:terms} = await Axios.get("/get/terms");
            
            const {data:privacy} = await Axios.get("/get/privacy");
            setTerms(terms.content+"\n\n\n"+privacy.content);
        }
        setToggle();
    },[]);
    return (
        <>
            <CommonStatusbar backgroundColor="#F9F9F9"/>
            <SafeAreaView style={{backgroundColor:"#FFFFFF",flex:1}}>
                <View style={[styles.header,styles.shadow]}>
                    <TouchableWithoutFeedback onPress={()=>props.navigation.goBack()}>
                        <Image source={require('../../assets/img/ico_back.png')} style={{resizeMode:"contain", width:10,position:'absolute',left:20}} />
                    </TouchableWithoutFeedback>
                    <ExtraBoldText text="설정" customStyle={{color:"#707070"}}/>
                </View>
                <View style={{padding:16,justifyContent:"space-between",flex:1}}>
                    <View>
                        <View style={styles.border}>
                            <View style={[styles.align,{backgroundColor:"#EEEEEE"}]}>
                                <BoldText text={"버전정보"} customStyle={{color:"#2B2B2B",fontSize:14}}/>
                                <View style={{flexDirection:"row"}}>
                                    <BoldText text={versionText} customStyle={{color:"#2B2B2B",fontSize:11}}/>
                                    <BoldText text={"V"+_ver} customStyle={{color:"#2B2B2B",fontSize:12,marginLeft:10}}/>
                                </View>
                            </View>
                            <View style={{ padding:16,flexDirection:'row',justifyContent:"space-between",alignItems:"center"}}>
                                <BoldText text={"자동 로그인 설정"} customStyle={{color:"#2B2B2B",fontSize:14}}/>
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
                                <BoldText text={"알림수신동의"} customStyle={{color:"#2B2B2B",fontSize:14}}/>
                            </View>
                            <View style={{ padding:16,flexDirection:'row',justifyContent:"space-between",alignItems:"center"}}>
                                <BoldText text={"PUSH 알림 설정"} customStyle={{color:"#2B2B2B",fontSize:14}}/>
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
                                <BoldText text={"MVP 교환/사용 알림"} customStyle={{color:"#2B2B2B",fontSize:14}}/>
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
                                    <RegularText text={"이용약관&개인정보취급방침"} customStyle={styles.rgText} />
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={()=>{
                                setModalMode("info");
                                setModal(!modal)
                            }}>
                                <View style={{marginTop:10}}>
                                    <RegularText text={"제3자 정보이용 동의 약관"} customStyle={styles.rgText} />
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                </View>
                <Modal isVisible={modal} backdropTransitionOutTiming={0} style={{margin: 0,justifyContent:"center",alignItems:"center"}} useNativeDriver={true}>
                    <ScrollView style={{backgroundColor:"#FFFFFF",borderRadius:6,paddingVertical:28,paddingHorizontal:16,width:"90%",maxHeight:"80%"}}>
                        <BoldText text={modalMode==="terms"? terms : info} customStyle={{fontSize:12,color:'#3D3D3D',lineHeight:23}}/>
                        <TouchableWithoutFeedback onPress={()=>setModal(!modal)}>
                            <Image source={require('../../assets/img/ico_close_bl.png')} style={{width:12,height:12,resizeMode:'contain',position:"absolute",right:0,top:0}}/>
                        </TouchableWithoutFeedback>
                    </ScrollView>
                </Modal>
            </SafeAreaView>
        </>
    )
}
        
export default Config;

const styles = StyleSheet.create({
    header:{
        height:60,
        borderColor:"#CCCCCC",
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'row',
        zIndex:1
    },
    shadow:{
        elevation:2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2.22,
        backgroundColor:"white"
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