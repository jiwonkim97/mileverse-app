import React, {useState,useEffect} from 'react';
import { useSelector } from 'react-redux';
import { View,StyleSheet,SafeAreaView,TouchableWithoutFeedback,Image,TextInput } from 'react-native';

import CommonStatusbar from '../components/CommonStatusbar';
import { ExtraBoldText,BoldText } from '../components/customComponents';
import Modal from 'react-native-modal';


const WalletWithDraw = ({navigation,route}) =>{

    return (
        <>
            <CommonStatusbar backgroundColor="#F9F9F9"/>
            <SafeAreaView style={{backgroundColor:"#FFFFFF",flex:1}}>
                <View style={[styles.header,styles.shadow]}>
                    <TouchableWithoutFeedback onPress={()=>navigation.goBack()}>
                        <Image source={require('../../assets/img/ico_back.png')} style={{resizeMode:"contain", width:10,position:'absolute',left:20}} />
                    </TouchableWithoutFeedback>
                    <ExtraBoldText text="MVC 출금" customStyle={{fontSize:16}}/>
                    <TouchableWithoutFeedback onPress={()=>navigation.navigate("Wallet")}>
                        <Image source={require("../../assets/img/ico_close_bl.png")} style={{width:14,height:14,position:'absolute',right:20}}/>
                    </TouchableWithoutFeedback>
                </View>
                <View style={{justifyContent:"space-between",flex:1}}>
                    <View style={{paddingHorizontal:16}}>
                        <View style={styles.item}>
                            <BoldText text={"금액입력"}/>
                            <View style={[styles.boxWrap,{flexDirection:"row",justifyContent:"space-between",alignItems:"center"}]}>
                                <TextInput placeholderTextColor={"#D5C2D3"} placeholder={"금액을 입력해주세요"} style={styles.input}/>
                                <BoldText text={"MVC"}/>
                            </View>
                            <View style={{marginTop:10,flexDirection:"row"}}>
                                <View style={{flex:1,paddingRight:5}}>
                                    <View style={styles.percentBox}>
                                        <BoldText text="10%" customStyle={styles.percentText}/>
                                    </View>
                                </View>
                                <View style={{flex:1,paddingHorizontal:5}}>
                                    <View style={styles.percentBox}>
                                        <BoldText text="25%" customStyle={styles.percentText}/>
                                    </View>
                                </View>
                                <View style={{flex:1,paddingHorizontal:5}}>
                                    <View style={styles.percentBox}>
                                        <BoldText text="50%" customStyle={styles.percentText}/>
                                    </View>
                                </View>
                                <View style={{flex:1,paddingHorizontal:5}}>
                                    <View style={styles.percentBox}>
                                        <BoldText text="75%" customStyle={styles.percentText}/>
                                    </View>
                                </View>
                                <View style={{flex:1,paddingLeft:5}}>
                                    <View style={styles.percentBox}>
                                        <BoldText text="100%" customStyle={styles.percentText}/>
                                    </View>
                                </View>
                            </View>
                            <BoldText text="* 수량을 입력해주세요" customStyle={{color:"#EE1818",fontSize:10,marginTop:8}}/>
                        </View>
                        <View style={styles.item}>
                            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:"center"}}>
                                <BoldText text={"주소 입력"}/>
                                <TouchableWithoutFeedback onPress={()=>alert("카메라 뿅")}>
                                    <Image source={require("../../assets/img/ico_camera.png")} style={{width:24,height:24}}/>
                                </TouchableWithoutFeedback>
                            </View>
                            <View style={[styles.boxWrap,{justifyContent:'center'}]}>
                                <TextInput placeholderTextColor={"#D5C2D3"} placeholder={"주소를 입력해주세요"} style={styles.input}/>
                            </View>
                            <BoldText text="* 수량을 입력해주세요" customStyle={{color:"#EE1818",fontSize:10,marginTop:8}}/>
                        </View>
                        <View style={[styles.item,{marginTop:16}]}>
                            <BoldText text={"가스 수수료"}/>
                            <View style={[styles.boxWrap,{justifyContent:'center',backgroundColor:"#F3F3F3"}]}>
                                <BoldText text={"0.0003 ETH"} customStyle={{color:"#707070"}}/>
                            </View>
                        </View>
                        <View style={{marginTop:16,borderWidth:1,borderColor:"#F2F2F2"}} />
                        <View style={{marginTop:44}}>
                            <BoldText text={"[유의사항]"} customStyle={styles.noticeText}/>
                            <BoldText text={"잘못 전송한 경우 취소가 불가능합니다.\n전송 시 이더리움 가스비가 발생합니다.\n전송 시 전송 수수료가 발생합니다."} customStyle={[styles.noticeText,{marginTop:9,lineHeight:18}]}/>
                        </View>
                    </View>
                    <View style={{height:50,backgroundColor:"#8D3981",justifyContent:"center",alignItems:"center"}}>
                        <BoldText text={"전송하기"} customStyle={{color:"#FFFFFF",fontSize:16}}/>
                    </View>
                </View>
                <Modal isVisible={false} backdropTransitionOutTiming={0} style={{margin: 0,justifyContent:"center",alignItems:"center"}} useNativeDriver={true}>
                    <View style={{backgroundColor:"#FFFFFF",width:308,height:508,borderRadius:6,overflow:"hidden",justifyContent:"space-between"}}>
                        <View style={{paddingHorizontal:16,paddingVertical:20}}>
                            <BoldText text={"* 거래 전 아래 내용을 한번 더 확인해 주세요"}/>
                            <View style={{marginTop:20,borderWidth:1,borderColor:"#F2F2F2",marginBottom:10}} />
                            <View style={styles.modalItemGap}>
                                <BoldText text={"출금 수량"}/>
                                <View style={styles.modalItemBox}>
                                    <BoldText text={"0.00001 ETH"} customStyle={styles.modalItemText}/>
                                </View>
                            </View>
                            <View style={styles.modalItemGap}>
                                <BoldText text={"출금 수량"}/>
                                <View style={styles.modalItemBox}>
                                    <BoldText text={"0.0000 ETH / 수수료 면제"} customStyle={styles.modalItemText}/>
                                </View>
                            </View>
                            <View style={styles.modalItemGap}>
                                <BoldText text={"보낸 사람"}/>
                                <View style={styles.modalItemBox}>
                                    <BoldText text={"0x123123123123908123809132089132089"} customStyle={[styles.modalItemText,{lineHeight:18}]}/>
                                </View>
                            </View>
                            <View style={styles.modalItemGap}>
                                <BoldText text={"받는 사람"}/>
                                <View style={styles.modalItemBox}>
                                    <BoldText text={"0x123012309u81329081320891238091033"} customStyle={[styles.modalItemText,{lineHeight:18}]}/>
                                </View>
                            </View>
                        </View>
                        <View style={{flexDirection:'row',height:46}}>
                            <View style={[styles.modalBottomBtn,{backgroundColor:"#EBEBEB"}]}>
                                <BoldText text={"취소"} customStyle={{color:"#8B8B8B",fontSize:14}}/>
                            </View>
                            <TouchableWithoutFeedback onPress={()=>navigation.navigate("WalletResult")}>
                                <View style={[styles.modalBottomBtn,{backgroundColor:"#8D3981"}]}>
                                    <BoldText text={"확인"} customStyle={{color:"#FFFFFF",fontSize:14}}/>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        </>
    )
}
        
export default WalletWithDraw;

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
        height:36,
        borderRadius:6,
        borderWidth:1,
        borderColor:"#E5E5E5",
        justifyContent:"center",
        alignItems:"center"
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