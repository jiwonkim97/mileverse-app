import React,{  useState } from 'react';
import { useDispatch } from 'react-redux';
import { Image,View,SafeAreaView,TextInput,StyleSheet, TouchableOpacity, Alert,PermissionsAndroid,Platform} from 'react-native';
import * as toast from '../components/Toast';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import Modal from 'react-native-modal';
import DocumentPicker from 'react-native-document-picker';
import {ExtraBoldText,BoldText} from '../components/customComponents';

import Axios from '../modules/Axios';
import * as spinner from '../actions/spinner';
import CommonStatusbar from '../components/CommonStatusbar';
import { ScrollView } from 'react-native-gesture-handler';
import { useTranslation } from 'react-i18next';

const ContactScreen = (props) =>{
    const dispatch = useDispatch()
    const [mail, setMail] = useState("")
    const [title, setTitle] = useState("")
    const [contents, setContents] = useState("")
    const [limitLength, setLimitLength] = useState(0)
    const [file,setFile] = useState({})
    const [fileName,setFileName] = useState("")
    const { t } = useTranslation();
    const [visible,setVisible] = useState(false);

    const sendMail = async() =>{
        if(mail === '') {
            toast.error(t('alert_cs_1'))
        } else if(title === '') {
            toast.error(t('alert_cs_2'))
        } else if(contents === '') {
            toast.error(t('alert_cs_3'))
        } else {
            dispatch(spinner.showSpinner());
            const data = new FormData();
            data.append("from",mail)
            data.append("title",title)
            data.append("contents",contents)
            if(Object.keys(file).length !== 0) {
                data.append("avatar", {
                    name: file.fileName,
                    type: file.type,
                    uri:
                      Platform.OS === "android" ? file.uri : "file://"+file.uri
                });
            }
            Axios.post('/api/notice/mail',data,{
                headers:{
                    "Content-Type": "multipart/form-data",
                }
            }).then(response=>{
                if(response.data.result === 'success'){
                    Alert.alert(t('alert_title_1'),t('alert_cs_4'),[{text:t('common_confirm_1'),onPress:()=>dispatch(spinner.hideSpinner())}])
                } else {
                    Alert.alert(t('alert_title_1'),t('alert_cs_5'),[{text:t('common_confirm_1'),onPress:()=>dispatch(spinner.hideSpinner())}])    
                }
            }).catch(error=>{
                console.log("upload error", error);
                Alert.alert(t('alert_title_1'),t('alert_cs_5'),[{text:t('common_confirm_1'),onPress:()=>dispatch(spinner.hideSpinner())}])
            })
        }
    }
    const selectDialog= async(mode)=>{
        if(mode === 'file') {
            onFileRead()
        } else {
            try {
                let granted = null;
                if(Platform.OS === 'android') {
                    granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.CAMERA,
                        {
                          title: "카메라 권한",
                          message:"카메라 권한을 허용하시겠습니까?",
                          buttonNeutral: "나중에",
                          buttonNegative: "취소",
                          buttonPositive: "확인"
                        }
                    );    
                }
                if( Platform.OS==='ios' || granted === PermissionsAndroid.RESULTS.GRANTED ) {
                    if(mode === 'camera') {
                        launchCamera({mediaType:'photo'},({assets})=>{
                            if(assets) {
                                setVisible(false)
                                setFile({
                                    fileName: assets[0].fileName,
                                    type: assets[0].type,
                                    uri:assets[0].uri
                                })
                                if( assets[0].fileName.indexOf('jpg') || assets[0].fileName.indexOf('JPG') ) setFileName(new Date().getTime()+".jpg")
                                else if( assets[0].fileName.indexOf('png') || assets[0].fileName.indexOf('PNG') ) setFileName(new Date().getTime()+".png")
                                else if( assets[0].fileName.indexOf('jpeg') || assets[0].fileName.indexOf('JPEG') ) setFileName(new Date().getTime()+".jpeg")
                            }
                        })
                    } else {
                        launchImageLibrary({mediaType:'photo'},({assets})=>{
                            if(assets){
                                setVisible(false)
                                setFile({
                                    fileName: assets[0].fileName,
                                    type: assets[0].type,
                                    uri:assets[0].uri
                                })
                                if( assets[0].fileName.indexOf('jpg') || assets[0].fileName.indexOf('JPG') ) setFileName(new Date().getTime()+".jpg")
                                else if( assets[0].fileName.indexOf('png') || assets[0].fileName.indexOf('PNG') ) setFileName(new Date().getTime()+".png")
                                else if( assets[0].fileName.indexOf('jpeg') || assets[0].fileName.indexOf('JPEG') ) setFileName(new Date().getTime()+".jpeg")
                            }
                        })
                    }
                }
            } catch (err) {
                console.warn(err);
            }
        }
    }

    const onFileRead = async() =>{
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.pdf],
            });
            setVisible(false)
            res.filename = res.name
            res.originalname = res.name
            res.fileName = res.name
            setFile(res)
            setFileName(res.name)
            } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                console.log("User cancelled the picker")
            } else {
                throw err;
            }
        }
    }
    const onChangeContents = text =>{
        setContents(text)
        setLimitLength(text.length)
    }

    return (
        <>
            <CommonStatusbar backgroundColor="#F9F9F9"/>
            <SafeAreaView style={{flex:1}}>
                <View style={[styles.header,styles.shadow]}>
                    <View style={{width:50}}></View>
                    <View style={[styles.headerIcoWrap,{flex:1}]}>
                        <ExtraBoldText text={t("menu_6")} customStyle={{fontSize:16}}/>
                    </View>
                    <TouchableOpacity onPress={()=>props.navigation.goBack()}>
                        <View style={styles.headerIcoWrap}>
                            <Image source={require("../../assets/img/ico_close_bl.png")} style={{width:20,height:20}}/>
                        </View>
                    </TouchableOpacity>
                </View>
                <ScrollView style={{flex:1,backgroundColor:"#FFFFFF",borderTopColor:"#ECECEC",borderTopWidth:6}}>
                    <View style={{backgroundColor:"white",paddingHorizontal:16,marginTop:6,flex:1}}>
                        <View style={{marginTop:26}}>
                            <BoldText text={t("menu_cs_1")}/>
                            <View style={[styles.boxWrap]}>
                                <TextInput placeholderTextColor={"#D5C2D3"} placeholder={t("menu_cs_2")} style={[styles.input]} onChangeText={text=>setMail(text)}/>
                            </View>
                        </View>
                        <View style={{marginTop:26}}>
                            <BoldText text={t("menu_cs_3")}/>
                            <View style={[styles.boxWrap]}>
                                <TextInput placeholderTextColor={"#D5C2D3"} placeholder={t("menu_cs_4")} style={[styles.input]} onChangeText={text=>setTitle(text)}/>
                            </View>
                        </View>
                        <View style={{marginTop:26}}>
                            <BoldText text={t("menu_cs_5")}/>
                            <View style={[styles.boxWrap,{height:120,paddingTop:16}]}>
                                <TextInput placeholderTextColor={"#D5C2D3"} placeholder={t("menu_cs_6")} multiline={true} style={[styles.input,{height:120,textAlignVertical:'top'}]} onChangeText={text=>onChangeContents(text)} numberOfLines={6}/>
                            </View>
                            <View style={{alignItems:'flex-end',marginTop:4}}>
                                <BoldText text={"("+limitLength+"/150)"} customStyle={{color:"#707070",fontSize:10}} />
                            </View>
                        </View>
                        <View style={{marginTop:12}}>
                            <View style={{flexDirection:'row',alignItems:"center"}}>
                                <BoldText text={t("menu_cs_7")}/>
                                <BoldText text={t('menu_cs_8')} customStyle={{color:"#EC6E6E",paddingLeft:6,fontSize:10}}/>
                            </View>
                            <View style={{marginTop:16,padding:6,borderWidth:1,borderColor:"#CCCCCC",flexDirection:'row',alignItems:'center',borderRadius:5}}>
                                <BoldText text={fileName} customStyle={{flex:9}}/>
                                <TouchableOpacity style={{flex:3 }} onPress={()=>setVisible(true)}>
                                    <View style={{backgroundColor:"#8D3981",justifyContent:'center',alignItems:"center",padding:10,borderRadius:5}}>
                                        <BoldText text={t('menu_cs_9')} customStyle={{color:"white",fontSize:10}}/>
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={{marginTop:6,paddingLeft:6}}>
                                <BoldText text={'첨부파일 추가 시 10~20초 시간이 걸릴 수 있습니다.'} customStyle={{color:"#929292",fontSize:10}}/>
                            </View>
                        </View>
                        <View style={{flexDirection:'row', alignItems:'center',justifyContent:"center",paddingBottom:20,marginTop:10,width:"100%",marginTop:40}}>
                            <TouchableOpacity onPress={()=>props.navigation.goBack()} style={{flex:1}}>
                                <View style={{backgroundColor:"#EBEBEB",height:50,borderTopLeftRadius:5,borderBottomLeftRadius:5,alignItems:"center",justifyContent:"center"}}>
                                    <BoldText text={t("common_cancel_1")} customStyle={{color:"#8B8B8B",fontSize:16}}/>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={sendMail} style={{flex:1}}>
                                <View style={{backgroundColor:"#8D3981",height:50,borderTopRightRadius:5,borderBottomRightRadius:5,alignItems:"center",justifyContent:"center"}}>
                                    <BoldText text={t("menu_cs_10")} customStyle={{color:"white",fontSize:16}}/>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
                <Modal
                    onBackdropPress={()=>setVisible(false)}
                    isVisible={visible}
                    onBackButtonPress={()=>setVisible(false)}
                    backdropTransitionOutTiming={0} style={{margin: 0,justifyContent:"center",alignItems:"center"}} useNativeDriver={true}>
                        <View style={{backgroundColor:"#FFFFFF"}}>
                            <TouchableOpacity onPress={()=>selectDialog('camera')}>
                                <View style={{height:50,width:280,justifyContent:'center',paddingHorizontal:10}}>
                                    <BoldText text={'카메라'} customStyle={{fontSize:16}}/>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>selectDialog('album')}>
                                <View style={{height:50,width:280,justifyContent:'center',paddingHorizontal:10}}>
                                    <BoldText text={'앨범'} customStyle={{fontSize:16}}/>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={()=>selectDialog('file')}>
                                <View style={{height:50,width:280,justifyContent:'center',paddingHorizontal:10}}>
                                    <BoldText text={'파일'} customStyle={{fontSize:16}}/>
                                </View>
                            </TouchableOpacity>
                        </View>
                </Modal>
            </SafeAreaView>
        </>
        
    )
}
        
export default ContactScreen;

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
    boxWrap:{
        marginTop:16,
        borderRadius:6,
        borderColor:"#E5E5E5",
        borderWidth:1,
        paddingHorizontal:16,
        height:46,
        justifyContent:"center"
    },
    input:{
        padding:0,
        fontFamily:"NotoSans-Regular"
    },
    inputLabel:{
        color:"#FFFFFF"
    }
});