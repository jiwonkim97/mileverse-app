import React from 'react';
import { useSelector } from 'react-redux';
import { Image,View,SafeAreaView,StyleSheet, ImageBackground,TouchableOpacity } from 'react-native';
import { RegularText, ExtraBoldText, BoldText } from '../components/customComponents';

const BarcodeScreen : () => React$Node = (props) =>{
    const mvp = useSelector(state => state.authentication.userInfo.mvp);
    return (
        <SafeAreaView>
            <View style={styles.header}>
                <ExtraBoldText text="사용하기" customStyle={{color:"#707070"}}/>
            </View>
            <ImageBackground source={require('../../assets/img/pay_bg.png')} style={{height:"95%",resizeMode:'contain'}}>
                <View style={{backgroundColor:"white",height:"52%",borderBottomLeftRadius:70,borderBottomRightRadius:70,
                shadowColor:"#000",elevation:2, shadowOffset:0.20,shadowRadius:1.41,shadowOffset:{width:0,height:1}}}>
                    <View style={{marginTop:30,flexDirection:'row'}}>
                        <View style={{flex:1,justifyContent:"center",alignItems:"flex-start",paddingLeft:34}}>
                            <BoldText text="My MVP" customStyle={{fontSize:28}} />
                            <BoldText text={mvp+" MVP"}  customStyle={{fontSize:18,color:"#8D3981",marginTop:16}} />
                        </View>
                        <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                            <TouchableOpacity onPress={()=>props.navigation.navigate("Branch")}>
                                <View style={styles.barcodeBtn}>
                                    <BoldText text="기프티콘 구매하기" customStyle={{color:"#535353"}} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{marginTop:90,alignItems:"center"}}>
                        <Image source={require('../../assets/img/pay_barcode.png')} style={{resizeMode:"contain",height:74}}></Image>
                        <RegularText text="0124 2626 6565 9595" customStyle={{marginTop:4}} />
                    </View>
                </View>
            </ImageBackground>
        </SafeAreaView>
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
        width:140,
        paddingHorizontal:16,
        paddingVertical:10
    }
});