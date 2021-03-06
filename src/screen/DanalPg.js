import React from 'react';
import { Alert,LogBox,SafeAreaView,StyleSheet,Linking, Platform,View,Text } from 'react-native';
import { WebView } from 'react-native-webview';
import { useDispatch,useSelector } from 'react-redux';
import CommonStatusbar from '../components/CommonStatusbar';

import SendIntentAndroid from "react-native-send-intent";
import { BoldText } from '../components/customComponents';
import * as dialog from '../actions/dialog';
import * as auth from '../actions/authentication';
import { useTranslation } from 'react-i18next';
import {endpoint} from '../../properties.json'

LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
    'WebView'
])

const DanalPg = ({navigation,route})=>{
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const {currentUser:user_name} = useSelector(state => state.authentication.userInfo);
    const params = {
        item : route.params.item,
        amount : route.params.amount,
        name:user_name
    }

    return (
        <>
            <CommonStatusbar backgroundColor="#F9F9F9"/>
            <SafeAreaView style={{flex:1,backgroundColor:"#FFFFFF"}}>
                <WebView
                    source={{uri: `${endpoint}/api/danal/v2/pg`,method:"POST",
                        body:`params=${JSON.stringify(params)}`,
                        headers : Platform.OS !== 'android' ? { 'Content-Type': 'application/x-www-form-urlencoded' } : {} 
                    }}
                    originWhitelist={['*']}
                    javaScriptEnabled={true}
                    startInLoadingState={true}
                    renderLoading={()=>(
                        <View style={{width:"100%",height:"100%",justifyContent:"center",alignItems:"center"}}>
                            <Text>{t("exchange_buy_13")}</Text>
                        </View>
                    )}
                    onMessage={(event)=>{
                        const {result,mvp} = JSON.parse(event.nativeEvent.data);
                        console.log(result)
                        if(result === "success") dispatch(auth.udpateMvp(mvp));
                        dispatch(dialog.openDialog("alert",(
                            <>
                                <BoldText text={t(result === "success" ? "exchange_buy_11" : "exchange_buy_12")}/>
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
                                        Alert.alert("??????","??? ????????? ??????????????????.",[{text:"??????"}]);
                                    }
                                })
                                .catch(err => {
                                    console.log(err);
                                });
                            } else {
                                Linking.openURL(url).catch(err => {
                                    Alert.alert("??????","??? ????????? ??????????????????. ????????? ???????????? ?????? ?????? ???????????? ????????? ???????????????.",[{text:"??????"}]);
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