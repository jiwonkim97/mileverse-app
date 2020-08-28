import { Platform,Linking } from 'react-native';
import RNExitApp from 'react-native-exit-app';
import AlertAsync from "react-native-alert-async";


 
export default async(info,_ver) => {

    const buttons = {
        "A1":[{
            text:"확인",
            onPress:()=>true
        }],
        "A2":[{
            text:"확인",
            onPress:()=>{
                RNExitApp.exitApp();
            }
        }],
        "U1":[
            {
                text:"취소",
                onPress:()=>{
                    RNExitApp.exitApp();
                }
            },
            {
                text:"업데이트",
                onPress:()=>{
                    onUpdate();
                }
            }
        ],
        "U2":[
            {
                text:"나중에",
                onPress:()=>true
            },
            {
                text:"업데이트",
                onPress:()=>{
                    onUpdate();
                }
            }
        ]
    }
    if((info.TYPE_CODE.indexOf("U") !== -1 && _ver !== info.VER_NUM) || info.TYPE_CODE.indexOf("U") === -1) {
        const z = await AlertAsync(
            info.TITLE,
            info.EXPL,
            buttons[info.TYPE_CODE]
        );
        return z;
    }
    
    function onUpdate(){
        let url = Platform.OS === "ios" ? 'itms-apps://itunes.apple.com/us/app/apple-store/myiosappid?mt=1521818622' : 'market://details?id=com.cordova.mileverse';
        Linking.openURL(url);
        RNExitApp.exitApp();
    }
}