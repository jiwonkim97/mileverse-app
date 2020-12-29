import React, { useEffect } from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { StyleSheet,View,Dimensions,TouchableWithoutFeedback,Image, BackHandler,Keyboard} from 'react-native';
import { RegularText, ExtraBoldText, BoldText } from './customComponents';
import * as dialog from '../actions/dialog';

export default ()=>{
    const dispatch = useDispatch()
    const {mode,stat,contents,callback} = useSelector(state => state.dialog);
    useEffect(()=>{
        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            ()=>{
                if(stat) {
                    dispatch(dialog.closeDialog());
                    return true;
                }else {
                    return false
                }
                
            });
            return ()=> backHandler.remove();
    },[stat]);
    
    useEffect(()=>{
        Keyboard.dismiss();
    });
    return (
        <View style={[styles.container,{width:stat?"100%":0}]} >
            <View style={{backgroundColor:"#fff",borderRadius:8,overflow:"hidden",width:"80%"}}>
                <View style={{paddingTop:40,justifyContent:"center",alignItems:"center"}}>
                    {contents}
                </View>
                <View style={{marginTop:40}}>
                    {mode === "alert" ? 
                        <TouchableWithoutFeedback onPress={()=>{
                            if(callback) {
                                callback()
                            }
                            else dispatch(dialog.closeDialog())
                        }}>
                            <View style={{backgroundColor:"#8D3981",width:"100%",height:46, justifyContent:"center",alignItems:"center"}}>
                                <BoldText text={"확인"} customStyle={{color:"#ffffff",fontSize:14}}/>
                            </View>
                        </TouchableWithoutFeedback>
                    :
                        <View style={{flexDirection:"row"}}>
                            <TouchableWithoutFeedback onPress={()=>dispatch(dialog.closeDialog())}>
                                <View style={{backgroundColor:"#C4C4C4",flex:1,height:46, justifyContent:"center",alignItems:"center"}}>
                                    <BoldText text={"취소"} customStyle={{color:"#ffffff",fontSize:14}}/>
                                </View>
                            </TouchableWithoutFeedback>
                            <TouchableWithoutFeedback onPress={callback}>
                                <View style={{backgroundColor:"#8D3981",flex:1,height:46, justifyContent:"center",alignItems:"center"}}>
                                    <BoldText text={"확인"} customStyle={{color:"#ffffff",fontSize:14}}/>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    }
                </View>
            </View>
        </View>
    )
    
}

const styles = StyleSheet.create({
    container:{
        height:Dimensions.get('window').height,
        backgroundColor:'rgba(0,0,0,0.5)',
        justifyContent:"center",
        alignItems:"center",
        zIndex:100,
        position:"absolute",
        top:0,
        right:10,
        bottom:0,
        left:0,
        elevation:3
    }
});