import messaging from '@react-native-firebase/messaging';
import Axios from '../modules/Axios';
import AsyncStorage from '@react-native-community/async-storage';

export async function getToken() {
    return await messaging().getToken();
}

export async function updatePushToken(id) {
    const token = await getToken();

    // const tokenStorage = await AsyncStorage.getItem("@tokenStorage");
    await Axios.post("/users/token",{token:token,id:id});
    // if(tokenStorage) {
    //     const {token:savedToken} = JSON.parse(tokenStorage);
    //     if(savedToken !== token) {
    //         await AsyncStorage.mergeItem("@tokenStorage",JSON.stringify({token:token}));
    //         Axios.post("/users/token",{token:token,id:id});
    //     } 
    // } else {
    //     await AsyncStorage.mergeItem("@tokenStorage",JSON.stringify({token:token}));
    //     Axios.post("/users/token",{token:token,id:id});
    // }
}

export async function checkPermissions() {
    const authStatus = await messaging().requestPermission();
    return authStatus === messaging.AuthorizationStatus.AUTHORIZED ||authStatus === messaging.AuthorizationStatus.PROVISIONAL;
}

export async function onPushOpenListener(navigation) {
    messaging().onNotificationOpenedApp(async(remoteMessage)=>{
        // const {data} = remoteMessage
        // if (data.hasOwnProperty('target') && data.target !== '') {
        //     navigation.navigate(data.target)
        // }
        console.log(remoteMessage);
        console.log('onPushOpenListener')
        const {data} = await Axios.get("/get/storage",{params:{key:"PUSH_NAVIGATE"}});
        if(data.value !== "") navigation.navigate(data.value)
    });
}

export async function onPushOpenListenerBackground(navigation) {
    const pushStorage = await AsyncStorage.getItem("@pushStorage");
    console.log("pushStorage",pushStorage)
    if(pushStorage) {
        const {target} = JSON.parse(pushStorage);
        if(target !== '') {
            await AsyncStorage.mergeItem("@pushStorage",JSON.stringify({target:""}));
            navigation.navigate(target)
        }
    }
    // const {data} = await Axios.get("/get/storage",{params:{key:"PUSH_NAVIGATE"}});
    // if(data.value !== "") navigation.navigate(data.value);
}