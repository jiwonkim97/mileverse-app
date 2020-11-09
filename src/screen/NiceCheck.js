import React, { useEffect, useCallback,useState } from 'react';
import { Text,SafeAreaView,View, Alert,TouchableWithoutFeedback } from 'react-native';
import { WebView } from 'react-native-webview';
import SendIntentAndroid from "react-native-send-intent";
const NiceCheck = (props)=>{
    const checkSuccess = (_data)=>{
        props.route.params.onGoBack(true);
        props.navigation.navigate({
            name: 'SignUp01',
            params: _data,
        })
    }

    return (
        <WebView
            source={{uri: 'http://13.209.142.239:3010/api/nice/encrypt'}}
            originWhitelist={['*']}
            javaScriptEnabled={true}
            style={{marginTop: 20}}
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
                if(url.indexOf("play.google.com") !== -1 || url.startsWith("market")) {
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
                }else {
                    return true;
                }
            }}
        >
        </WebView>
    )
}
export default NiceCheck;