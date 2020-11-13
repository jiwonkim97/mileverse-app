import React from 'react';
import { Alert,LogBox,SafeAreaView,StyleSheet,Linking, Platform,View,Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { useDispatch } from 'react-redux';
import CommonStatusbar from '../components/CommonStatusbar';

import SendIntentAndroid from "react-native-send-intent";
import { BoldText } from '../components/customComponents';
import * as dialog from '../actions/dialog';
import * as auth from '../actions/authentication';

LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
    'WebView'
])
const Loading = ()=>{
    return (
        <View style={{width:"100%",height:"100%",justifyContent:"center",alignItems:"center"}}>
            <Text>잠시만 기다려주세요...</Text>
        </View>
    )
}

const DanalPg = ({navigation,route})=>{
    const dispatch = useDispatch();
    return (
        <>
            <CommonStatusbar backgroundColor="#F9F9F9"/>
            <SafeAreaView style={{flex:1,backgroundColor:"#FFFFFF"}}>
                <WebView
                    source={{uri: 'http://13.209.142.239:3010/api/danal/pg',method:"POST",
                        body:"item="+route.params.item,
                        headers : Platform.OS !== 'android' ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {} 
                    }}
                    originWhitelist={['*']}
                    javaScriptEnabled={true}
                    startInLoadingState={true}
                    renderLoading={Loading}
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
                            return true;
                        } else {
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
            </SafeAreaView>
        </>
    )
}

export default DanalPg;