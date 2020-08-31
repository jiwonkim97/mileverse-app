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
        return await AlertAsync(
            info.TITLE,
            info.EXPL,
            buttons[info.TYPE_CODE]
        );
    }else return true;
    
    function onUpdate(){
        let url = Platform.OS === "ios" ? 'itms-apps://apps.apple.com/kr/app/마일벌스/id1521818622' : 'market://details?id=com.cordova.mileverse';
        Linking.openURL(url).then(()=>RNExitApp.exitApp());
        
    }
}