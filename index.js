/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-community/async-storage';

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
    const {data} = remoteMessage
    if (data.hasOwnProperty('target')) {
        AsyncStorage.mergeItem("@pushStorage",JSON.stringify({target:data.target}));
    }
});

AppRegistry.registerComponent(appName, () => App);
