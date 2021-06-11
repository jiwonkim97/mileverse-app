import React from 'react';
import { Alert,LogBox,SafeAreaView,TouchableWithoutFeedback,Image,View,StyleSheet,Linking,TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import SendIntentAndroid from "react-native-send-intent";
import CommonStatusbar from '../components/CommonStatusbar';
import { ExtraBoldText } from '../components/customComponents';


LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
])

const NiceCheck = (props)=>{
    const checkSuccess = (_data)=>{
        props.route.params.onGoBack(_data);
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
                    <TouchableOpacity onPress={()=>props.navigation.goBack()}>
                        <View style={styles.headerIcoWrap}>
                            <Image source={require('../../assets/img/ico_back.png')} style={{width:21,height:21}} />
                        </View>
                    </TouchableOpacity>
                    <View style={[styles.headerIcoWrap,{flex:1}]}>
                        <ExtraBoldText text={'본인인증'} customStyle={{fontSize:16}}/>
                    </View>
                    <View style={{width:50}}></View>
                </View>
                <WebView
                    source={{uri: 'https://server.mileverse.com/rest/api/nice/encrypt'}}
                    originWhitelist={['*']}
                    javaScriptEnabled={true}
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
                        if(url.startsWith('http://') || url.startsWith('https://') || url.startsWith('about:blank')) {
                            if(url.startsWith("https://play.google.com/store/apps") === true) {
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
                                }
                                return false;
                            } else if(url.startsWith("https://itunes.apple.co.kr") === true){
                                Linking.openURL(url).catch(err => {
                                    Alert.alert("알림","앱 실행에 실패했습니다. 설치가 되어있지 않은 경우 설치하기 버튼을 눌러주세요.",[{text:"확인"}]);
                                });
                                return false;
                            }else {
                                return true;
                            }
                        } else {
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
                        }
                    }}
                />
            </SafeAreaView>
            
        </>
    )
}
const styles = StyleSheet.create({
    header:{
        height:50,
        borderColor:"#CCCCCC",
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'row',
        zIndex:1
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
    headerIcoWrap:{
        width:50,
        height:50,
        justifyContent:'center',
        alignItems:'center'
    }
});

export default NiceCheck;