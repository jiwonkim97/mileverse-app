import React, {useState,useEffect} from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { View,StyleSheet,SafeAreaView,TouchableWithoutFeedback,Image} from 'react-native';
import CheckBox from 'react-native-check-box'
import * as dialog from '../actions/dialog';
import * as spinner from '../actions/spinner'
import * as actions from '../actions/authentication'

import CommonStatusbar from '../components/CommonStatusbar';
import { ExtraBoldText,BoldText } from '../components/customComponents';
import Axios from '../modules/Axios';


const WalletAgree = ({navigation,route}) =>{
    const dispatch = useDispatch();
    const [agree,setAgree] = useState(false);

    const onCrateWallet = async()=>{
        if(agree){
            dispatch(spinner.showSpinner());
            const {data} = await Axios.post("/api/henesis/wallets");
            dispatch(spinner.hideSpinner());
            if(data.result === "success") {
                dispatch(dialog.openDialog("alert",(
                    <BoldText text={data.msg} customStyle={{textAlign:"center",lineHeight:20}}/>
                ),()=>{
                    dispatch(dialog.closeDialog());
                    dispatch(actions.updateWallet());
                    navigation.navigate("Wallet");
                }));    
            }else {
                dispatch(dialog.openDialog("alert",(
                    <BoldText text={data.msg} customStyle={{textAlign:"center",lineHeight:20}}/>
                )));    
            }
        } else {
            dispatch(dialog.openDialog("alert",(
                <BoldText text={"동의 하여주세요."} customStyle={{textAlign:"center",lineHeight:20}}/>
            )));
        }
    }

    return (
        <>
            <CommonStatusbar backgroundColor="#F9F9F9"/>
            <SafeAreaView style={{backgroundColor:"#FFFFFF",flex:1}}>
                <View style={[styles.header,styles.shadow]}>
                    <ExtraBoldText text="내 지갑" customStyle={{fontSize:16}}/>
                    <TouchableWithoutFeedback onPress={()=>navigation.navigate("Home")}>
                        <Image source={require("../../assets/img/ico_close_bl.png")} style={{width:14,height:14,position:'absolute',right:20}}/>
                    </TouchableWithoutFeedback>
                </View>
                <View style={{flex:1,justifyContent:"space-between"}}>
                    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                        <ExtraBoldText text={"지갑 만드는것 ㅇㅈ?"} customStyle={{fontSize:18,lineHeight:26,textAlign:"center"}}/>
                    </View>
                    <View style={{paddingVertical:12,paddingHorizontal:16,alignItems:"center",flexDirection:'row',backgroundColor:"#FFFFFF"}}>
                    <CheckBox
                        isChecked={agree}
                        checkedCheckBoxColor={'#8D3981'}
                        uncheckedCheckBoxColor={"#999999"}
                        onClick={() => setAgree(!agree)}
                    />
                    <BoldText text={"ㅇ ㅇㅈ."} customStyle={{fontSize:11,marginLeft:10}}/>
                </View>
                    <TouchableWithoutFeedback onPress={onCrateWallet}>
                        <View style={{height:50,backgroundColor:"#8D3981",justifyContent:"center",alignItems:"center"}}>
                            <BoldText text={"확인"} customStyle={{fontSize:16,color:"#FFFFFF"}}/>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </SafeAreaView>
        </>
    )
}
        
export default WalletAgree;

const styles = StyleSheet.create({
    header:{
        height:60,
        borderColor:"#CCCCCC",
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'row',
        zIndex:1
    },
    shadow:{
        elevation:2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2.22,
        backgroundColor:"white"
    },
    item:{
        marginTop:26
    },
    boxWrap:{
        marginTop:16,
        borderRadius:6,
        borderColor:"#E5E5E5",
        borderWidth:1,
        paddingHorizontal:16,
        height:46
    },
    percentBox:{
        borderWidth:1,
        borderRadius:6,
        borderColor:"#E5E5E5",
        paddingVertical:11,
        paddingHorizontal:12 
    },
    percentText:{
        color:"#707070"
    },
    input:{
        padding:0,
        fontFamily:"NotoSans-Regular",
        maxWidth:200
    },
    noticeText:{
        color:"#3A3A3A",
        fontSize:12
    },
    modalItemGap:{
        marginTop:16
    },
    modalItemBox:{
        marginTop:10,
        backgroundColor:"#F3F3F3",
        borderColor:"#F3F3F3",
        borderRadius:6,
        paddingVertical:13,
        paddingHorizontal:16
    },
    modalItemText:{
        fontSize:12,
        color:'#3A3A3A'
    },
    modalBottomBtn:{
        flex:1,
        justifyContent:"center",
        alignItems:"center"
    }
});