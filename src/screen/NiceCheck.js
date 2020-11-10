import React from 'react';
import { Alert,LogBox,SafeAreaView,TouchableWithoutFeedback,Image,View,StyleSheet,Linking } from 'react-native';
import { WebView } from 'react-native-webview';
import SendIntentAndroid from "react-native-send-intent";
import CommonStatusbar from '../components/CommonStatusbar';
import { ExtraBoldText } from '../components/customComponents';


LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
])

const NiceCheck = (props)=>{
    const checkSuccess = (_data)=>{
        props.route.params.onGoBack(true);
        props.navigation.navigate({
            name: 'SignUp01',
            params: _data,
        })
    }

    return (
        <>
            <CommonStatusbar backgroundColor="#F9F9F9"/>
            <SafeAreaView style={{flex:1,backgroundColor:"#FFFFFF"}}>
                <View style={[styles.header,styles.shadow]}>
                    <TouchableWithoutFeedback onPress={()=>props.navigation.goBack()}>
                        <Image source={require('../../assets/img/ico_back.png')} style={{resizeMode:"contain", width:10,position:'absolute',left:20}} />
                    </TouchableWithoutFeedback>
                    <ExtraBoldText text="본인인증" customStyle={{color:"#707070"}}/>
                </View>
                <WebView
                    source={{uri: 'http://13.209.142.239:3010/api/nice/encrypt'}}
                    originWhitelist={['*']}
                    javaScriptEnabled={true}
                    style={{marginTop:16}}
                    onMessage={(event)=>{
                        const data = JSON.parse(event.nativeEvent.data);
                        if(data.success === "true") {
                            checkSuccess(data);
                        } else {
                            Alert.alert("알림","본인인증에 실패했습니다.",[{text:"확인",onPress:()=>props.navigation.goBack()}]);
                        }
                    }}
                    onShouldStartLoadWithRequest={(evt)=>{
                        const { url } = evt;
                        if(url.startsWith("Intent://")||
                            url.startsWith("https://play.google.com/store")||
                            url.startsWith("https://itunes.apple.com") || 
                            url.startsWith("tauthlink://")||
                            url.startsWith("ktauthexternalcall://")||
                            url.startsWith("upluscorporation://")
                        ){
                            if (Platform.OS === 'android') {
                                SendIntentAndroid.openAppWithUri(url)
                                .then(isOpened => {
                                    if (!isOpened) {
                                        Alert.alert("알림","본인인증 앱 실행에 실패했습니다.",[{text:"확인"}]);
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
                        } else 
                            return true;
                    }}
                />
            </SafeAreaView>
            
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

export default NiceCheck;