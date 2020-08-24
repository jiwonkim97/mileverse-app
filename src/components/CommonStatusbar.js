
import React from 'react';
import { View, StatusBar,StyleSheet,Platform } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';



const CommonStatusbar: () => React$Node = ({ backgroundColor, ...props }) => {

    return (
        <View style={[styles.statusBar, { backgroundColor }]}>
            <StatusBar translucent barStyle={"dark-content"} backgroundColor={backgroundColor} {...props} />
        </View>
    )
};


const styles = StyleSheet.create({
    statusBar: {
        height: getStatusBarHeight()
    }
});
export default CommonStatusbar;