import React,{  useState } from 'react';
import { useDispatch } from 'react-redux';
import { Image,View,SafeAreaView,TextInput,StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as toast from '../actions/toast'
import ImagePicker from 'react-native-image-picker';
import DocumentPicker from 'react-native-document-picker';
import {BoldText} from '../components/customComponents';

import axios from 'axios';
import * as spinner from '../actions/spinner';
import CommonStatusbar from '../components/CommonStatusbar';


const ContactScreen : () => React$Node = (props) =>{
    const dispatch = useDispatch()
    const [mail, setMail] = useState("")
    const [title, setTitle] = useState("")
    const [contents, setContents] = useState("")
    const [limitLength, setLimitLength] = useState(0)
    const [file,setFile] = useState({})
    const [fileName,setFileName] = useState("")

    const errorToast = (msg) =>{
        dispatch(toast.onErrorAlert(msg))
    }

    const sendMail = () =>{
        if(mail === '') {
            errorToast('회신 메일을 입력해주세요.')
        } else if(title === '') {
            errorToast('메일 제목을 입력해주세요.')
        } else if(contents === '') {
            errorToast('메일 내용을 입력해주세요.')
        } else {
            dispatch(spinner.showSpinner());
            let data = new FormData();
            data.append("from",mail)
            data.append("title",title)
            data.append("contents",contents)
            let url = 'http://13.209.142.239:3010/api/notice/sendMailWithOutFile'
            if(Object.keys(file).length !== 0) {
                data.append("avatar", {
                    name: file.fileName,
                    type: file.type,
                    uri:
                      Platform.OS === "android" ? file.uri : file.uri.replace("file://", "")
                });
                url = 'http://13.209.142.239:3010/api/notice/sendMail'
            }
            axios.post(url,data,{
                headers:{
                    "Content-Type": "multipart/form-data",
                    "processData": false,
                }
            }).then(response=>{
                if(response.data.result === 'success'){
                    Alert.alert("알림","메일 발송을 완료하였습니다.",[{text:"확인",onPress:()=>dispatch(spinner.hideSpinner())}])
                }
            }).catch(error=>{
                console.log("upload error", error);
                Alert.alert("알림","메일 발송에 실패하였습니다.",[{text:"확인",onPress:()=>dispatch(spinner.hideSpinner())}])
            })
        }
    }
    // "Content-Type": 'multipart/form-data; charset=utf-8; boundary="another cool boundary";'
    const showPicker=()=>{
        //ImagePicker를 이용해서 카메라 or 사진선택앱을 선택하여 이미지 가져오기
        // 카메라를 다루려면 Camera, External Storage 퍼미션이 필요함
        // Android의 경우 퍼미션을 주려면 .. AndroidManifest.xml에서 직접 작성
        // <uses-permission android:name="android.permission.CAMERA" />
        // <uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
 
        // PickerDialog의 옵션 객체
        const options= {
            title:'Select Picker', //다이얼로그의 제목
            takePhotoButtonTitle: '카메라',
            chooseFromLibraryButtonTitle:'앨범',
            cancelButtonTitle: '취소',
            customButtons: [
                {name:'readFile',title:'문서'}
            ],
            storageOptions:{
                skipBackup: true, //ios에서 icloud에 백업할 것인가?- 안드로이드에서는 무시됨
                path: 'MileVerse',//카메라로 캡쳐시에 저장될 폴더명 [ Pictures/[path] 경로]
            }
        };
 
        //위에서 만든 옵션을 기준으로 다이얼로그 보이기 
        ImagePicker.showImagePicker(options, (response)=>{
            if(response.didCancel){
            }else if(response.error){
                alert('에러 : ', response.error);
            }else if(response.customButton){
                if(response.customButton === 'readFile'){
                    onFileRead()
                }
            }else{
                if(response.fileName === null || response.fileName === undefined) {
                    if( response.uri.indexOf('jpg') || response.uri.indexOf('JPG') ) response.fileName = new Date().getTime()+".jpg";
                    else if( response.uri.indexOf('png') || response.uri.indexOf('PNG') ) response.fileName = new Date().getTime()+".png";
                    else if( response.uri.indexOf('jpeg') || response.uri.indexOf('JPEG') ) response.fileName = new Date().getTime()+".jpeg";
                    response.originalname = response.fileName;
                    response.filename = response.fileName;
                }
                setFile(response)
                setFileName(response.fileName)
            }
        });
 
    }

    const onFileRead = async() =>{
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.pdf],
            });
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
            <SafeAreaView>
                <View style={styles.header}>
                    <BoldText text={"문의 하기"} customStyle={{fontWeight:'bold',color:"#707070"}} />
                    <TouchableOpacity onPress={()=>props.navigation.goBack()}style={{position:'absolute',top:-10,left:20}}>
                        <Image source={require('../../assets/img/ico_back.png')} style={{resizeMode:"contain", width:10}}></Image>
                    </TouchableOpacity>
                </View>
                <View style={{backgroundColor:"white",height:"100%",padding:20}}>
                    <View>
                        <BoldText text={"이메일"} customStyle={styles.inputLabel}/>
                        <TextInput placeholder="이메일을 입력해주세요." style={styles.inputForm} onChangeText={text=>setMail(text)}/>
                    </View>
                    <View style={{marginTop:20}}>
                        <BoldText text={"제목"} customStyle={styles.inputLabel}/>
                        <TextInput placeholder="제목을 입력해주세요." style={styles.inputForm} onChangeText={text=>setTitle(text)}/>
                    </View>
                    <View style={{marginTop:20}}>
                    <BoldText text={"내용"} customStyle={styles.inputLabel}/>
                        <TextInput placeholder="내용을 입력해주세요." blurOnSubmit={true} maxLength={150} multiline={true} numberOfLines={6} style={[styles.inputForm,{height:160,textAlignVertical:'top'}]} onChangeText={text=>{onChangeContents(text);}}/>
                    </View>
                    <View style={{alignItems:'flex-end',marginTop:4}}>
                        <BoldText text={"("+limitLength+"/150)"} style={{color:"#2D2D2D"}} />
                    </View>
                    <View style={{margiTop:40}}>
                        <View style={{flexDirection:'row',alignItems:"center"}}>
                            <BoldText text={"첨부파일"} customStyle={styles.inputLabel}/>
                            <BoldText text={"*JPG, PNG, PDF만 첨부가능합니다."} customStyle={{color:"#EC6E6E",paddingLeft:6,fontSize:10}}/>
                        </View>
                        <View style={{marginTop:6,padding:6,borderWidth:1,borderColor:"#CCCCCC",flexDirection:'row',alignItems:'center',borderRadius:5}}>
                            <BoldText text={fileName} customStyle={{flex:9}}/>
                            <TouchableOpacity style={{flex:3 }} onPress={showPicker}>
                                <View style={{backgroundColor:"#AE7AA7",justifyContent:'center',alignItems:"center",padding:10,borderRadius:5}}>
                                    <BoldText text={"첨부하기"} customStyle={{color:"white",fontSize:10}}/>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{flexDirection:'row', alignItems:'center',justifyContent:"center",paddingBottom:20,marginTop:10,width:"100%",marginTop:40}}>
                        <TouchableOpacity onPress={()=>props.navigation.goBack()} style={{flex:1}}>
                            <View style={{backgroundColor:"#B6B6B6",height:50,borderTopLeftRadius:5,borderBottomLeftRadius:5,alignItems:"center",justifyContent:"center"}}>
                                <BoldText text={"취소"} customStyle={{color:"white",fontSize:16,fontWeight:"bold"}}/>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={sendMail} style={{flex:1}}>
                            <View style={{backgroundColor:"#8D3981",height:50,borderTopRightRadius:5,borderBottomRightRadius:5,alignItems:"center",justifyContent:"center"}}>
                                <BoldText text={"보내기"} customStyle={{color:"white",fontSize:16,fontWeight:"bold"}}/>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        </>
        
    )
}
        
export default ContactScreen;

const styles = StyleSheet.create({
    header:{
        backgroundColor:"white",
        height:60,
        borderColor:"#CCCCCC",
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'row',
        elevation:2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2.22,
        zIndex:1
    },
    inputLabel:{
        color:"#2D2D2D"
    },
    inputForm:{
        height:40,
        borderWidth:1,
        borderRadius:10,
        borderColor:"#CCCCCC",
        backgroundColor:"rgba(255,255,255,0.3)",
        color:"#555",
        paddingLeft:10,
        marginTop:8,
        fontFamily:"NanumSquareR"
    },
    btnText:{
        flex:1,
        height:40,
        borderRadius:10,
        justifyContent:"center",
        alignItems:"center"
    }
});