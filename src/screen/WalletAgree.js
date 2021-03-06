import React, {useEffect, useState} from 'react';
import { useDispatch } from 'react-redux';
import { View,StyleSheet,SafeAreaView,TouchableWithoutFeedback,Image,TouchableOpacity,ScrollView} from 'react-native';
import CheckBox from 'react-native-check-box'
import * as dialog from '../actions/dialog';
import * as spinner from '../actions/spinner'
import * as actions from '../actions/authentication'
import Modal from 'react-native-modal';

import CommonStatusbar from '../components/CommonStatusbar';
import { ExtraBoldText,BoldText } from '../components/customComponents';
import Axios from '../modules/Axios';


const WalletAgree = ({navigation,route}) =>{
    const dispatch = useDispatch();
    const [all,setAll] = useState(false);
    const [privacy,setPrivacy] = useState(false);
    const [terms,setTerms] = useState(false);
    const [modal,setModal] = useState(false);
    const [termsDocs,setTermsDocs] = useState("");
    const [privacyDocs,setPrivacyDocs] = useState("");
    const [modalMode,setModalMode] = useState("");

    useEffect(()=>{
        Axios.get('/get/wallets/terms').then((response)=>{
            setTermsDocs(response.data.content);
        });
        Axios.get('/get/wallets/privacy').then((response)=>{
            setPrivacyDocs(response.data.content);
        });
    })

    useEffect(()=>{
        if(privacy && terms) {
            setAll(true)
        } 
    },[privacy,terms]);

    const onChangeCheck = (_target)=>{
        if(_target === "all") {
            if(all === false) {
                setAll(true);
                setPrivacy(true);
                setTerms(true);
            } else {
                setAll(false);
                setPrivacy(false);
                setTerms(false);
            }
            
        }else if(_target === "privacy") {
            if(privacy === true & terms === true) setAll(false)
            setPrivacy(!privacy);
        } else if(_target === "terms") {
            if(privacy === true & terms === true) setAll(false)
            setTerms(!terms)
        }
    }

    const onCrateWallet = async()=>{
        if(all){
            dispatch(spinner.showSpinner());
            const {data} = await Axios.post("/api/henesis/wallets");
            dispatch(spinner.hideSpinner());
            if(data.result === "success") {
                dispatch(dialog.openDialog("alert",(
                    <BoldText text={data.msg} customStyle={{textAlign:"center",lineHeight:20}}/>
                ),()=>{
                    dispatch(dialog.closeDialog());
                    dispatch(actions.updateWallet());
                    navigation.navigate("Wallet");
                }));    
            }else {
                dispatch(dialog.openDialog("alert",(
                    <BoldText text={data.msg} customStyle={{textAlign:"center",lineHeight:20}}/>
                )));    
            }
        } else if(!privacy) {
            dispatch(dialog.openDialog("alert",(
                <BoldText text={"???????????? ??????????????? ????????? ?????????."} customStyle={{textAlign:"center",lineHeight:20}}/>
            )));
        } else if(!terms) {
            dispatch(dialog.openDialog("alert",(
                <BoldText text={"??????????????? ????????? ?????????."} customStyle={{textAlign:"center",lineHeight:20}}/>
            )));
        }
    }

    return (
        <>
            <CommonStatusbar backgroundColor="#F9F9F9"/>
            <SafeAreaView style={{backgroundColor:"#FFFFFF",flex:1}}>
                <View style={[styles.header,styles.shadow]}>
                    <View style={{width:50}}></View>
                    <View style={[styles.headerIcoWrap,{flex:1}]}>
                        <ExtraBoldText text={"??? ??????"} customStyle={{fontSize:16}}/>
                    </View>
                    <TouchableOpacity onPress={()=>navigation.goBack()}>
                        <View style={styles.headerIcoWrap}>
                            <Image source={require("../../assets/img/ico_close_bl.png")} style={{width:20,height:20}}/>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{flex:1,justifyContent:"space-between"}}>
                    <View style={{paddingHorizontal:16,paddingTop:20}}>
                        <ExtraBoldText text={"?????? ?????? ??????"}/>
                        <View style={{marginTop:16,borderRadius:6,borderWidth:1,borderColor:"#E5E5E5",overflow:"hidden"}}>
                            <View style={{padding:12,backgroundColor:"#F6F6F6",flexDirection:"row",alignItems:'center',borderBottomWidth:1,borderBottomColor:"#ECECEC"}}>
                                <CheckBox
                                    isChecked={all}
                                    checkedCheckBoxColor={'#8D3981'}
                                    uncheckedCheckBoxColor={"#999999"}
                                    onClick={() => onChangeCheck("all")}
                                />
                                <BoldText text={"?????? ????????? ???????????????."} customStyle={{fontSize:10,marginLeft:12}}/>
                            </View>
                            <View style={{flexDirection:"row",justifyContent:"space-between",padding:12,borderBottomColor:"#ECECEC",borderBottomWidth:1}}>
                                <View style={{flexDirection:"row",alignItems:"center"}}>
                                    <CheckBox
                                        isChecked={privacy}
                                        checkedCheckBoxColor={'#8D3981'}
                                        uncheckedCheckBoxColor={"#999999"}
                                        onClick={() => onChangeCheck("privacy")}
                                    />
                                    <BoldText text={"???????????? ?????? ???????????? ????????????(??????)"} customStyle={{fontSize:10,marginLeft:12}}/>
                                </View>
                                <TouchableWithoutFeedback onPress={()=>{
                                    setModalMode("privacy");
                                    setModal(!modal);
                                    }}>
                                    <View style={{borderColor:"#E5E5E5",borderRadius:4,borderWidth:1,width:60,height:30,justifyContent:"center",alignItems:"center"}}>
                                        <BoldText text={"????????????"} customStyle={{fontSize:10}}/>
                                    </View>
                                </TouchableWithoutFeedback>
                                
                            </View>
                            <View style={{flexDirection:"row",justifyContent:"space-between",padding:12,}}>
                                <View style={{flexDirection:"row",alignItems:"center"}}>
                                    <CheckBox
                                        isChecked={terms}
                                        checkedCheckBoxColor={'#8D3981'}
                                        uncheckedCheckBoxColor={"#999999"}
                                        onClick={() => onChangeCheck("terms")}
                                    />
                                    <BoldText text={"???????????? ?????? ????????? ????????????(??????)"} customStyle={{fontSize:10,marginLeft:12}}/>
                                </View>
                                <TouchableWithoutFeedback onPress={()=>{
                                    setModalMode("terms");
                                    setModal(!modal);
                                    }}>
                                    <View style={{borderColor:"#E5E5E5",borderRadius:4,borderWidth:1,width:60,height:30,justifyContent:"center",alignItems:"center"}}>
                                        <BoldText text={"????????????"} customStyle={{fontSize:10}}/>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                    </View>
                    <TouchableWithoutFeedback onPress={onCrateWallet}>
                        <View style={{height:50,backgroundColor:"#8D3981",justifyContent:"center",alignItems:"center"}}>
                            <BoldText text={"??????"} customStyle={{fontSize:16,color:"#FFFFFF"}}/>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <Modal isVisible={modal} backdropTransitionOutTiming={0} style={{margin: 0,justifyContent:"center",alignItems:"center"}} useNativeDriver={true}>
                    <View style={{backgroundColor:"#FFFFFF",borderRadius:6,width:"90%",maxHeight:"80%",flex:1,overflow:"hidden"}}>
                        <View style={{alignItems:'flex-end',paddingRight:16,paddingTop:16}}>
                            <TouchableWithoutFeedback onPress={()=>setModal(!modal)}>
                                <Image source={require('../../assets/img/ico_close_bl.png')} style={{width:20,height:20,resizeMode:'contain'}}/>
                            </TouchableWithoutFeedback>
                        </View>
                        <ScrollView style={{paddingHorizontal:20}}>
                            <BoldText text={modalMode==="terms"? termsDocs : privacyDocs} customStyle={{fontSize:12,color:'#3D3D3D',lineHeight:23}}/>
                        </ScrollView>
                    </View>
                </Modal>
            </SafeAreaView>
        </>
    )
}
        
export default WalletAgree;

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
    }
});