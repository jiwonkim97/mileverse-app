import React, {useState,useEffect} from 'react';
import { View,StyleSheet,SafeAreaView,TouchableWithoutFeedback,Image, } from 'react-native';
import CommonStatusbar from '../components/CommonStatusbar';
import { ExtraBoldText,BoldText } from '../components/customComponents';
import Axios from '../modules/Axios';

const Profile = (props) =>{

    const [id,setId] = useState("");
    const [name,setName] = useState("");
    const [phone,setPhone] = useState("");

    useEffect(()=>{
        Axios.get("/users/profile").then(({data})=>{
            const {info} = data
            setId(info.U_ID);
            setName(info.U_NAME);
            setPhone(info.U_PHN_NMB);
        })
    },[]);

    return (
        <>
            <CommonStatusbar backgroundColor="#F9F9F9"/>
            <SafeAreaView style={{backgroundColor:"#EEEEEE",flex:1}}>
                <View style={[styles.header,styles.shadow]}>
                    <TouchableWithoutFeedback onPress={()=>props.navigation.goBack()}>
                        <Image source={require('../../assets/img/ico_back.png')} style={{resizeMode:"contain", width:10,position:'absolute',left:20}} />
                    </TouchableWithoutFeedback>
                    <ExtraBoldText text="내 정보" customStyle={{fontSize:16}}/>
                </View>
                <View style={{padding:16,backgroundColor:"#FFFFFF"}}>
                    <View style={styles.border}>
                        <View style={styles.itemWrap}>
                            <BoldText text={"아이디"} customStyle={styles.itemLabel}/>
                            <BoldText text={id} customStyle={styles.itemLabel}/>
                        </View>
                        <View style={styles.itemWrap}>
                            <BoldText text={"이름"} customStyle={styles.itemLabel}/>
                            <BoldText text={name} customStyle={styles.itemLabel}/>
                        </View>
                        <View style={{padding:16,flexDirection:"row",justifyContent:"space-between"}}>
                            <BoldText text={"휴대전화"} customStyle={styles.itemLabel}/>
                            <BoldText text={phone} customStyle={styles.itemLabel}/>
                        </View>
                    </View>
                    <View style={[styles.border,{marginTop:16}]}>
                        <TouchableWithoutFeedback onPress={()=>props.navigation.navigate("ChangePassword")}>
                            <View style={[styles.itemWrap,{alignItems:"center"}]}>
                                <BoldText text={"비밀번호 변경"} customStyle={styles.itemLabel}/>
                                <Image source={require('../../assets/img/ico_bracket.png')} style={styles.bracket}/>
                            </View>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={()=>props.navigation.navigate("PinCode",{mode:"set"})}>
                            <View style={{padding:16,flexDirection:"row",justifyContent:"space-between",alignItems:"center"}}>
                                <BoldText text={"PinCode 변경"} customStyle={styles.itemLabel}/>
                                <Image source={require('../../assets/img/ico_bracket.png')} style={styles.bracket}/>
                            </View>
                        </TouchableWithoutFeedback>
                        
                    </View>
                    <View style={[styles.border,{marginTop:16,padding:16}]}>
                        <TouchableWithoutFeedback onPress={()=>props.navigation.navigate("WithDraw")}>
                            <View>
                                <BoldText text={"회원탈퇴"} customStyle={{color:"#A2A2A2",fontSize:12}}/>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                </View>
            </SafeAreaView>
        </>
    )
}
        
export default Profile;

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
    itemLabel:{
        color:"#707070",
        fontSize:12
    },
    border:{
        borderRadius:6,
        borderColor:"#E5E5E5",
        borderWidth:1
    },
    bracket:{
        width:8,
        height:16
    },
    itemWrap:{
        borderBottomColor:"#E5E5E5",
        borderBottomWidth:1,
        padding:16,
        flexDirection:"row",
        justifyContent:"space-between"
    }
});