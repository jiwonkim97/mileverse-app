/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-community/async-storage';
import Axios from './src/modules/Axios'

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
    // const {data} = remoteMessage
    // if (data.hasOwnProperty('target')) {
    //     AsyncStorage.mergeItem("@pushStorage",JSON.stringify({target:data.target}));
    // }
    console.log("background!!")
    const {data} = await Axios.get("/get/storage",{params:{key:"PUSH_NAVIGATE"}});
    console.log("background!!",data)
    if (data.value !== "") {
        AsyncStorage.mergeItem("@pushStorage",JSON.stringify({target:data.value}));
    }
});

AppRegistry.registerComponent(appName, () => App);
