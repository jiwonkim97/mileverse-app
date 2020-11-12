import React from 'react';
import { Alert,LogBox,SafeAreaView,TouchableWithoutFeedback,Image,View,StyleSheet,Linking, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { useDispatch } from 'react-redux';

import SendIntentAndroid from "react-native-send-intent";
import CommonStatusbar from '../components/CommonStatusbar';
import { BoldText,ExtraBoldText } from '../components/customComponents';
import * as dialog from '../actions/dialog';
import * as auth from '../actions/authentication';

LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
])

const DanalPg = ({navigation,route})=>{
    const dispatch = useDispatch();
    return (
        <>
            {/* <CommonStatusbar backgroundColor="#F9F9F9"/>
            <SafeAreaView style={{flex:1,backgroundColor:"#FFFFFF"}}>
                <View style={[styles.header,styles.shadow]}>
                    <TouchableWithoutFeedback onPress={()=>props.navigation.goBack()}>
                        <Image source={require('../../assets/img/ico_back.png')} style={{resizeMode:"contain", width:10,position:'absolute',left:20}} />
                    </TouchableWithoutFeedback>
                    <ExtraBoldText text="본인인증" customStyle={{color:"#707070"}}/>
                </View> */}
                <WebView
                    source={{uri: 'http://192.168.0.5:3010/api/danal/pg',method:"POST",body:"item="+route.params.item}}
                    originWhitelist={['*']}
                    javaScriptEnabled={true}
                    style={{marginTop:16}}
                    onMessage={(event)=>{
                        const {result,mvp} = JSON.parse(event.nativeEvent.data);
                        if(result === "success") dispatch(auth.udpateMvp(mvp));
                        dispatch(dialog.openDialog("alert",(
                            <>
                                <BoldText text={`MVP 구매가 ${result === "success" ? "완료" : "취소"}되었습니다.`}/>
                            </>
                        ),()=>{
                            dispatch(dialog.closeDialog());
                            navigation.goBack();
                        }));
                    }}
                    onShouldStartLoadWithRequest={(evt)=>{
                        const { url } = evt;
                        if(url.startsWith('http://') || url.startsWith('https://') || url.startsWith('about:blank')) {
                            console.log(url);
                            return true;
                        } else {
                            console.log(url);
                            if (Platform.OS === 'android') {
                            SendIntentAndroid.openAppWithUri(url)
                            .then(isOpened => {
                                if (!isOpened) {
                                    Alert.alert("알림","앱 실행에 실패했습니다.",[{text:"확인"}]);
                                }
                            })
                            .catch(err => {
                                console.log(err);
                            });
                            } else {
                                Linking.openURL(url).catch(err => {
                                    Alert.alert("알림","앱 실행에 실패했습니다. 설치가 되어있지 않은 경우 설치하기 버튼을 눌러주세요.",[{text:"확인"}]);
                                });
                            }
                            return false;
                        }
                    }}
                />
            {/* </SafeAreaView> */}
        </>
    )
}
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
    label:{
        color:"#707070",
        fontSize:12
    },
    input:{
        color:"#000000",
        textAlign:"right"
    },
    inputBox:{
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        padding:16
    },
    btnBox:{
        backgroundColor:"#8D3981",
        justifyContent:"center",
        alignItems:"center",
        borderRadius:6
    }
});

export default DanalPg;