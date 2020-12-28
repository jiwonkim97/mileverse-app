import React, {useState,useEffect} from 'react';
import { useDispatch } from 'react-redux';
import { View,StyleSheet,SafeAreaView,TouchableWithoutFeedback,Image,ScrollView,TouchableOpacity } from 'react-native';
import CheckBox from 'react-native-check-box'
import CommonStatusbar from '../components/CommonStatusbar';
import { RegularText, ExtraBoldText,BoldText } from '../components/customComponents';
import Axios from '../modules/Axios';
import Modal from 'react-native-modal';
import * as dialog from '../actions/dialog';
import * as toast from '../components/Toast';

const SignUp01 = (props) =>{
    const dispatch = useDispatch();
    const [checkAll,setCheckAll] = useState(false);
    const [checkTerms,setCheckTerms] = useState(false);
    const [checkprivacy,setCheckPrivacy] = useState(false);
    const [checkLogin,setCheckLogin] = useState(false);
    const [modal,setModal] = useState(false);
    const [authBtn,setAuthBtn] = useState({disabled:false,bgColor:"#8D3981",textColor:"#FFFFFF"})
    const [modalMode,setModalMode] = useState("");
    const [terms,setTerms] = useState("");
    const [privacy,setPrivacy] = useState("");
    const [checkIdentify,setCheckIdentify] = useState(false)
    useEffect(()=>{
        Axios.get('/get/terms').then((response)=>{
            setTerms(response.data.content);
        });
        Axios.get('/get/privacy').then((response)=>{
            setPrivacy(response.data.content);
        });
    },[]);

    const onChangeCheckbox = (_target) =>{
        if(_target === "all") {
            if(checkAll === false) {
                setCheckTerms(true);
                setCheckPrivacy(true);
                setCheckLogin(true);
                setCheckAll(true);
            } else {
                setCheckTerms(false);
                setCheckPrivacy(false);
                setCheckLogin(false);
                setCheckAll(false);
            }
        } else if(_target === "terms") {
            if(checkAll === true && checkTerms === true) {
                setCheckAll(false);
            }
            setCheckTerms(!checkTerms);
        } else if(_target === 'privacy') {
            if(checkAll === true && checkprivacy === true) {
                setCheckAll(false);
            }
            setCheckPrivacy(!checkprivacy);
        } else if(_target === 'login') {
            if(checkAll === true && checkLogin === true) {
                setCheckAll(false);
            }
            setCheckLogin(!checkLogin);
        }
    }

    const onIdentifyCheck = ()=>{
        if(checkIdentify === true) {
            toast.info("본인인증을 완료하였습니다.");
        } else {
            props.navigation.navigate("NiceCheck",{
                onGoBack:async(_data)=>{
                    if(_data.success === "true") {
                        const {data} = await Axios.get("/users/exists",{params:{name:_data.name,mobileno:_data.mobileno}});
                        if(data.result === "success") {
                            if(data.exists === true) {
                                dispatch(dialog.openDialog("alert",(
                                    <>
                                        <BoldText text={"이미 가입된 회원입니다."} customStyle={{textAlign:"center",lineHeight:20}}/>
                                    </>
                                ))); 
                            } else {
                                setAuthBtn({disabled:true,textColor:"#A7A7A7",bgColor:"#E5E5E5"});
                                setCheckIdentify(true);
                                toast.info("본인인증을 완료하였습니다.");
                            }
                        } else {
                            dispatch(dialog.openDialog("alert",(
                                <>
                                    <BoldText text={data.msg} customStyle={{textAlign:"center",lineHeight:20}}/>
                                </>
                            ))); 
                        }
                    } else {
                        dispatch(dialog.openDialog("alert",(
                            <>
                                <BoldText text={"본인 인증에 실패하였습니다."} customStyle={{textAlign:"center",lineHeight:20}}/>
                            </>
                        ))); 
                    }
                }
            });
        }
        
    }

    const onNextStep = ()=>{
        let msg = "";
        if(checkIdentify !== true) msg = "본인인증을 완료해주세요.";
        else if(checkTerms !== true) msg = "이용약관에 동의해주세요.";
        else if(checkprivacy !== true) msg = "개인정보 처리방침에 동의해주세요.";

        if(msg !== "") {
            dispatch(dialog.openDialog("alert",(
                <>
                    <BoldText text={msg} customStyle={{textAlign:"center",lineHeight:20}}/>
                </>
            )));
        } else {
            props.navigation.navigate("SignUp02",{
                data:props.route.params
            });
        }
    }

    return (
        <>
            <CommonStatusbar backgroundColor="#F9F9F9"/>
            <SafeAreaView style={{backgroundColor:"#FFFFFF",flex:1}}>
                <View style={[styles.header,styles.shadow]}>
                    <View style={{width:50}}>
                    </View>
                    <View style={[styles.headerIcoWrap,{flex:1}]}>
                        <ExtraBoldText text={"회원가입"} customStyle={{fontSize:16}}/>
                    </View>
                    <TouchableOpacity onPress={()=>props.navigation.navigate("Login")}>
                        <View style={styles.headerIcoWrap}>
                            <Image source={require("../../assets/img/ico_close_bl.png")} style={{width:20,height:20}}/>
                        </View>
                    </TouchableOpacity>
                </View>
                <ScrollView style={{flex:1}}>
                    <View style={{padding:16}}>
                        <View style={{flexDirection:"row",justifyContent:"flex-end",alignItems:"center"}}>
                            <Image source={require('../../assets/img/ico_progress_01.png')} style={{resizeMode:"stretch",width:20,height:20}}/>
                            <Image source={require('../../assets/img/ico_progress_none.png')} style={{marginLeft:5,resizeMode:"stretch",width:10,height:10}}/>
                        </View>
                        <View style={{marginTop:14}}>
                            <ExtraBoldText text={"본인 인증하기"} customStyle={{fontSize:14}}/>
                            <View style={{marginTop:14,borderRadius:10,borderWidth:1,borderColor:'#E5E5E5',paddingHorizontal:16,justifyContent:"center",alignItems:"center",paddingTop:22,paddingBottom:16,width:150,backgroundColor:"#FFFFFF"}}>
                                <BoldText text={"휴대폰 본인인증"} customStyle={{fontSize:13}}/>
                                <View style={{marginTop:20,justifyContent:"center",alignItems:"center"}}>
                                    <BoldText text={"본인 명의의 휴대폰을"} customStyle={{color:'#707070',justifyContent:"center",fontSize:11}}/>
                                    <BoldText text={"이용하여 본인인증을"} customStyle={{color:'#707070',justifyContent:"center",marginTop:8,fontSize:11}}/>
                                    <BoldText text={"진행합니다."} customStyle={{color:'#707070',justifyContent:"center",marginTop:8,fontSize:11}}/>
                                </View>
                                <TouchableWithoutFeedback onPress={onIdentifyCheck} disabled={authBtn.disabled}>
                                    <View style={{marginTop:25,backgroundColor:authBtn.bgColor,paddingHorizontal:32,paddingVertical:8,borderRadius:6}}>
                                        <BoldText text={"인증하기"} customStyle={{fontSize:12,color:authBtn.textColor}}/>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                        <View style={{marginTop:26}}>
                            <ExtraBoldText text={"약관동의"} customStyle={{fontSize:14}}/>
                            <View style={{marginTop:14,borderRadius:4,borderColor:"#E5E5E5",borderWidth:1,overflow:"hidden"}}>
                                <View style={{backgroundColor:"#F6F6F6",padding:12,flexDirection:"row",alignItems:"center",borderBottomWidth:1,borderBottomColor:'#E5E5E5'}}>
                                    <CheckBox
                                        isChecked={checkAll}
                                        checkedCheckBoxColor={'#8D3981'}
                                        uncheckedCheckBoxColor={"#999999"}
                                        onClick={() => onChangeCheckbox("all")}
                                    />
                                    <BoldText text={"모든 약관에 동의합니다."} customStyle={{fontSize:12,marginLeft:12}}/>
                                </View>
                                <View style={{padding:12,flexDirection:"row",alignItems:"center",borderBottomWidth:1,borderBottomColor:'#E5E5E5',justifyContent:"space-between",backgroundColor:"#FFFFFF"}}>
                                    <View style={{flexDirection:"row",alignItems:"center"}}>
                                        <CheckBox
                                            isChecked={checkTerms}
                                            checkedCheckBoxColor={'#8D3981'}
                                            uncheckedCheckBoxColor={"#999999"}
                                            onClick={() => onChangeCheckbox("terms")}
                                        />
                                        <BoldText text={"이용약관 (필수)"} customStyle={{fontSize:12,marginLeft:12,color:"#707070"}}/>
                                    </View>
                                    <TouchableWithoutFeedback onPress={()=>{
                                        setModalMode("terms");
                                        setModal(!modal)
                                    }}>
                                        <View style={{paddingHorizontal:12,paddingVertical:9,borderRadius:6,borderWidth:1,borderColor:"#E5E5E5"}}>
                                            <BoldText text={"전문보기"} customStyle={{color:"#A8A8A8",fontSize:10}}/>
                                        </View>
                                    </TouchableWithoutFeedback>
                                    
                                </View>
                                <View style={{padding:12,flexDirection:"row",alignItems:"center",borderBottomWidth:1,borderBottomColor:'#E5E5E5',justifyContent:"space-between",backgroundColor:"#FFFFFF"}}>
                                    <View style={{flexDirection:"row",alignItems:"center"}}>
                                        <CheckBox
                                            isChecked={checkprivacy}
                                            checkedCheckBoxColor={'#8D3981'}
                                            uncheckedCheckBoxColor={"#999999"}
                                            onClick={() => onChangeCheckbox("privacy")}
                                        />
                                        <BoldText text={"개인정보 처리방침 (필수)"} customStyle={{fontSize:12,marginLeft:12,color:"#707070"}}/>
                                    </View>
                                    <TouchableWithoutFeedback onPress={()=>{
                                        setModalMode("privacy");
                                        setModal(!modal)
                                    }}>
                                        <View style={{paddingHorizontal:12,paddingVertical:9,borderRadius:6,borderWidth:1,borderColor:"#E5E5E5"}}>
                                            <BoldText text={"전문보기"} customStyle={{color:"#A8A8A8",fontSize:10}}/>
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                                <View style={{padding:12,flexDirection:"row",alignItems:"center",justifyContent:"space-between",backgroundColor:"#FFFFFF"}}>
                                    <View style={{flexDirection:"row",alignItems:"center"}}>
                                        <CheckBox
                                            isChecked={checkLogin}
                                            checkedCheckBoxColor={'#8D3981'}
                                            uncheckedCheckBoxColor={"#999999"}
                                            onClick={() => onChangeCheckbox('login')}
                                        />
                                        <BoldText text={"자동 로그인 동의 (선택)"} customStyle={{fontSize:12,marginLeft:12,color:"#707070"}}/>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <TouchableWithoutFeedback onPress={onNextStep}>
                            <View style={{height:44,backgroundColor:"#8D3981",justifyContent:"center",alignItems:'center',borderRadius:6,marginTop:14}}>
                                <BoldText text={"다음"} customStyle={{fontSize:14,color:'#FFFFFF'}}/>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </ScrollView>
                <Modal isVisible={modal}
                    onBackButtonPress={()=>setModal(false)}                
                    backdropTransitionOutTiming={0} style={{margin: 0,justifyContent:"center",alignItems:"center"}} useNativeDriver={true}>
                    <View style={{backgroundColor:"#FFFFFF",borderRadius:6,width:"90%",maxHeight:"80%",flex:1,overflow:"hidden"}}>
                        <View style={{alignItems:'flex-end',paddingRight:16,paddingTop:16}}>
                            <TouchableWithoutFeedback onPress={()=>setModal(false)}>
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
        
export default SignUp01;

const styles = StyleSheet.create({
    header:{
        height:50,
        borderColor:"#CCCCCC",
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'row',
        zIndex:1
    },
    headerIcoWrap:{
        width:50,
        height:50,
        justifyContent:'center',
        alignItems:'center'
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
    }
});