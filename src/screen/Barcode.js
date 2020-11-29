import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { View,SafeAreaView,StyleSheet, ImageBackground,TouchableOpacity,Image } from 'react-native';
import { RegularText, ExtraBoldText, BoldText } from '../components/customComponents';
import CommonStatusbar from '../components/CommonStatusbar';
import Barcode from "react-native-barcode-builder";


const BarcodeScreen : () => React$Node = (props) =>{
    const mvp = useSelector(state => state.authentication.userInfo.mvp);
    const code = useSelector(state => state.authentication.userInfo.code);
    const [text,setText] = useState("");
    useEffect(()=>{
        setText(code.substr(0,4)+" "+code.substr(4,4)+" "+code.substr(8,4)+" "+code.substr(12,4))
    },[code])
    return (
        <>
            <CommonStatusbar backgroundColor="#F9F9F9"/>
            <SafeAreaView>
                <View style={styles.header}>
                    <ExtraBoldText text="사용하기" customStyle={{fontSize:16}}/>
                    <TouchableOpacity onPress={()=>props.navigation.goBack()}style={{position:'absolute',top:-10,left:20}}>
                        <Image source={require('../../assets/img/ico_back.png')} style={{resizeMode:"contain", width:10}}></Image>
                    </TouchableOpacity>
                </View>
                <ImageBackground source={require('../../assets/img/pay_bg.png')} style={{height:"95%",resizeMode:'contain'}}>
                    <View style={{backgroundColor:"white",height:"45%",borderBottomLeftRadius:70,borderBottomRightRadius:70,
                    shadowColor:"#000",elevation:2, shadowOffset:0.20,shadowRadius:1.41,shadowOffset:{width:0,height:1}}}>
                        <View style={{marginTop:30,flexDirection:'row'}}>
                            <View style={{flex:1,justifyContent:"center",alignItems:"flex-start",paddingLeft:34}}>
                                <BoldText text="나의 MVP" customStyle={{fontSize:28}} />
                                <BoldText text={mvp+" MVP"}  customStyle={{fontSize:18,color:"#8D3981",marginTop:16}} />
                            </View>
                            <View style={{flex:1,justifyContent:"center",alignItems:"flex-start",paddingRight:16}}>
                                <TouchableOpacity onPress={()=>props.navigation.navigate("Branch")}>
                                    <View style={styles.barcodeBtn}>
                                        <BoldText text="기프티콘 구매하기" customStyle={{color:"#535353"}} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{marginTop:40,alignItems:"center"}}>
                            <Barcode value={code? code : "0000"} format="CODE128" height={80}/>
                            <RegularText text={text} customStyle={{marginTop:4}} />
                        </View>
                    </View>
                </ImageBackground>
            </SafeAreaView>
        </>
        
    )
}
export default BarcodeScreen;

const styles = StyleSheet.create({
    header:{
        backgroundColor:"white",
        height:60,
        justifyContent:'center',
        alignItems:'center',
        zIndex:2
    },
    barcodeBtn:{
        borderWidth:1,
        borderColor:"#ccc",
        borderRadius:4,
        width:150,
        paddingHorizontal:16,
        paddingVertical:10
    }
});