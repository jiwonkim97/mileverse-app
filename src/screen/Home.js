import React, { useEffect } from 'react';
import { Image,View,SafeAreaView,ScrollView ,StyleSheet,TouchableOpacity,Platform } from 'react-native';
import { useSelector,useDispatch } from 'react-redux';

import * as spinner from '../actions/spinner'
import * as actions from '../actions/authentication'
import AsyncStorage from '@react-native-community/async-storage';
import { RegularText, BoldText } from '../components/customComponents';
import CommonStatusbar from '../components/CommonStatusbar';
import Axios from '../modules/Axios'

import noticeAlert from '../components/NoticeAlert';


const HomeScreen : () => React$Node = (props) =>{
    const dispatch = useDispatch();
    const stat = useSelector(state => state.authentication.status.isLoggedIn);
    const mvp = useSelector(state => state.authentication.userInfo.mvp);
    const _ver = useSelector(state => state.global.version);
    
    const navigateScreen = (_target) =>{
        stat ? props.navigation.navigate(_target) : props.navigation.navigate("Login")
    }
    useEffect(()=>{
        async function checkNotice(){
            const _getNotice = await Axios.post('/api/notice/check-notice-version',{version:_ver,platform:Platform.OS});
            const _response = _getNotice.data.rows
            const _notice = await noticeAlert(_response,_ver);
            if(_notice === true) onVerifyRequest();
        }
        
        checkNotice();
    },[])
    
    const onVerifyRequest = async() =>{
        await AsyncStorage.getItem("@loginStorage").then(value=>{
            dispatch(spinner.showSpinner());
            let _data = {};
            if(value !== null) _data = JSON.parse(value);
            dispatch(actions.verifyRequest(_data)).then(rst=>{
                dispatch(spinner.hideSpinner())
            })
        })
    }

    return (
        <>
            <CommonStatusbar backgroundColor="#F9F9F9"/>
            <SafeAreaView style={{flex:1}}>
                <View style={styles.header}>
                    <Image source={require('../../assets/img/header_logo.png')} style={{width:150,resizeMode:"contain"}}></Image>
                </View>
                <ScrollView >
                    <View style={{paddingLeft:20,paddingRight:20,paddingTop:20}}>
                        <View style={{width:'100%'}}>
                            <Image source={require('../../assets/img/main_banner.png')} style={{width:"100%", height:145, resizeMode:"stretch"} }/>
                        </View>
                        <View style={[styles.cardWrap,{marginTop:16}]}>
                            <View style={{alignItems:"center"}}>
                                <BoldText text={"나의 MVP"} customStyle={{fontSize:18,marginTop:20}}/>
                                <View style={{flexDirection:'row'}}>
                                    <View style={{flex:3,height:80,alignItems:'flex-end',justifyContent:"center",paddingRight:10}}>
                                        <Image source={require('../../assets/img/mvp_coin.png')} style={{resizeMode:'contain',height:60,width:60}}></Image>
                                    </View>
                                    <View style={{flex:5,marginTop:10}}>
                                        <View style={{flex:5,justifyContent:'center'}}>
                                            <RegularText text={"나의 보유 포인트 :"}/>
                                        </View>
                                        <View style={{flex:6,justifyContent:'flex-start'}}>
                                            {
                                                stat ? <BoldText text={mvp +" MVP"} customStyle={[styles.mvpCardPointText,{fontSize:20}]}/> : <RegularText text="로그인이 필요합니다." customStyle={styles.mvpCardPointText}/>
                                            }
                                        </View>
                                    </View>
                                </View>
                            </View>
                            <View style={{flexDirection:'row', alignItems:'center',justifyContent:"center",paddingBottom:20,marginTop:10,width:"100%",paddingHorizontal:20}}>
                                <TouchableOpacity onPress={()=>navigateScreen('Change')} style={{flex:1}}>
                                    <View style={{backgroundColor:"#CD84AF",height:50,borderTopLeftRadius:10,borderBottomLeftRadius:10,alignItems:"center",justifyContent:"center"}}>
                                        <BoldText text="교환" customStyle={{color:"white",fontSize:16}} />
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=>navigateScreen('Pay')} style={{flex:1}}>
                                    <View style={{backgroundColor:"#8D3981",height:50,borderTopRightRadius:10,borderBottomRightRadius:10,alignItems:"center",justifyContent:"center"}}>
                                        <BoldText text="사용" customStyle={{color:"white",fontSize:16}} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <TouchableOpacity onPress={()=>navigateScreen('Branch')}>
                            <View style={[styles.cardWrap,{paddingHorizontal:10,paddingBottom:10}]}>
                                <View style={{justifyContent:"center",alignItems:"center",paddingVertical:20}}>
                                    <BoldText text="My 가맹점 확인" customStyle={{fontSize:18}} />
                                </View>
                                <View style={{flexDirection:"row",justifyContent:"space-between"}}>
                                    <View style={[styles.cardWrap,styles.branchWrap]}>
                                        <Image source={require("../../assets/img/store_2.png")} style={{width:30,height:35,resizeMode:"contain",marginTop:5}} />
                                        <RegularText text="커피 전문점" customStyle={styles.branchTxt}/>
                                    </View>
                                    <View style={[styles.cardWrap,styles.branchWrap]}>
                                        <Image source={require("../../assets/img/store_3.png")} style={{width:40,height:40,resizeMode:"contain"}} />
                                        <RegularText text="편의점" customStyle={styles.branchTxt}/>
                                    </View>
                                    <View style={[styles.cardWrap,styles.branchWrap]}>
                                        <Image source={require("../../assets/img/store_4.png")} style={{width:40,height:40,resizeMode:"contain"}} />
                                        <RegularText text="베이커리" customStyle={styles.branchTxt}/>
                                    </View>
                                    <View style={[styles.cardWrap,styles.branchWrap]}>
                                        <Image source={require("../../assets/img/store_5.png")} style={{width:40,height:40,resizeMode:"contain"}} />
                                        <RegularText text="음식점" customStyle={styles.branchTxt}/>
                                    </View>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{backgroundColor:"#8D3981",width:"100%",padding:20,marginTop:20}}>
                        <RegularText text="회사: 주식회사 트루스트체인" customStyle={styles.footer} />
                        <RegularText text="대표자: 정진형 | 사업자 등록 번호: 746-87-01620" customStyle={styles.footer} />
                        <RegularText text="사업장 소재지: 서울특별시 영등포구 당산로 49길 28 1층" customStyle={styles.footer} />
                        <RegularText text="e-mail: mkt@mileverse.com │ contact@mileverse.com" customStyle={styles.footer} />
                        <RegularText text="tel: 02-2633-5896" customStyle={styles.footer} />
                        <RegularText text="Copyright ⓒ 2019 Trustchain Inc. ALL RIGHT RESERVED" customStyle={[styles.footer,{marginTop:10}]} />
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    )
}

export default HomeScreen;

const styles = StyleSheet.create({
    header:{
        backgroundColor:"white",
        height:50,
        justifyContent:'center',
        alignItems:'center',
    },
    cardWrap:{
        borderRadius:10,
        marginTop:20,
        backgroundColor:"white",
        elevation:2, 
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2.22
    },
    myMvp:{
        alignItems:"center",
        resizeMode:"contain",
        height:220
    },
    myBrunch:{
        resizeMode:'contain',
        alignItems:'center',
        height:145,
        width:"100%",
        resizeMode:'contain',
        marginTop:20,
        paddingTop:20,
        overflow:"hidden",
    },
    footer:{
        color:"white",
        fontSize:12,
        lineHeight:20
    },
    branchWrap:{
        justifyContent:"center",
        alignItems:"center",
        height:70,
        width:70,
        marginTop:0,
        elevation:1,
        shadowOffset: {
            width: 0,
            height: 1,
        },
    },
    branchTxt:{
        fontSize:10,
        marginTop:4
    },
    mvpCardPointText:{
        color:"#8D3981",
        fontSize:18
    }
});