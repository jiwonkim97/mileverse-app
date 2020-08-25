import React, { useState,useEffect } from 'react';
import { Image,View,SafeAreaView,ScrollView ,StyleSheet, ImageBackground,TouchableOpacity, StatusBar } from 'react-native';
import { useSelector,useDispatch } from 'react-redux';
import CheckBox from 'react-native-check-box'

import Modal from 'react-native-modal';
import * as spinner from '../actions/spinner'
import * as actions from '../actions/authentication'
import AsyncStorage from '@react-native-community/async-storage';
import { RegularText, BoldText } from '../components/customComponents';
import SplashScreen from 'react-native-splash-screen';
import CommonStatusbar from '../components/CommonStatusbar';




const HomeScreen : () => React$Node = (props) =>{
    const dispatch = useDispatch();
    const [isModalVisible, setModalVisible] = useState(false);
    const [ignore, setIgnore] = useState(false)
    const stat = useSelector(state => state.authentication.status.isLoggedIn);
    const mvp = useSelector(state => state.authentication.userInfo.mvp);
    
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
        if(ignore === true) {
            IngoreSevenDays();
        }
    };
    
    const navigateScreen = (_target) =>{
        stat ? props.navigation.navigate(_target) : props.navigation.navigate("Login")
    }
    useEffect(()=>{
        onVerifyRequest();
    },[])
    const onVerifyRequest = async() =>{
        await AsyncStorage.getItem("@loginStorage").then(value=>{
            dispatch(spinner.showSpinner());
            let _data = {};
            if(value !== null) _data = JSON.parse(value);
            dispatch(actions.verifyRequest(_data)).then(rst=>{
                dispatch(spinner.hideSpinner())
                onEventPopup(rst);
            })
            
        })
    }

    
    const onEventPopup = async(_rst) =>{
        if(_rst !== "SUCCESS"){
            await AsyncStorage.getItem("@HomeStorage").then(value=>{
                if(value !== null) {
                    let _data = JSON.parse(value);
                    let saveDate = new Date(_data.saveTime);
                    let currentDate = new Date();
                    let diff = (currentDate.getTime() - saveDate.getTime()) / (24 * 60 * 60 * 1000);
                    if( diff > 7) {
                        setModalVisible(true);
                    }
                }else {
                    setModalVisible(true);
                }
            }).then(()=>{
                SplashScreen.hide();
            })    
        } else {
            SplashScreen.hide();
        }
        
    }


    const IngoreSevenDays = async() =>{
        let homeData = {
            saveTime : new Date
        }
        await AsyncStorage.setItem("@HomeStorage",JSON.stringify(homeData))
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
                                <BoldText text={"My MVP"} customStyle={{fontSize:18,marginTop:20}}/>
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
                                                stat ? <BoldText text={mvp +" MVP"} customStyle={styles.mvpCardPointText}/> : <RegularText text="로그인이 필요합니다." customStyle={styles.mvpCardPointText}/>
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
                        <RegularText text="Copyright ⓒ 2019 Trustchain Inc. ALL RIGHT RESERVED" customStyle={[styles.footer,{marginTop:10}]} />
                    </View>
                </ScrollView>
                <Modal isVisible={isModalVisible} backdropTransitionOutTiming={0} style={{margin: 0}} useNativeDriver={true}>
                    <View style={{justifyContent:"center",alignItems:"center"}}>
                        <View style={{width:300,height:"90%"}}>
                            <View style={{padding:15,backgroundColor:"white",borderTopRightRadius:10,borderTopLeftRadius:10}}>
                                <TouchableOpacity onPress={toggleModal} style={{position:"absolute",right:10,zIndex:2,bottom:8}}>
                                    <Image source={require('../../assets/img/ico_close_bl.png')} style={{resizeMode:"contain", width:17}} />
                                </TouchableOpacity>
                                <RegularText text="이벤트" customStyle={{color:'#2D2D2D',fontSize:18,fontWeight:"bold",textAlign:"center"}} />
                                <View style={{marginTop:8,borderBottomColor: 'black',borderBottomWidth:2 , borderBottomColor:"#E3E3E3"}} />
                            </View>
                            <View>
                                <ImageBackground source={require('../../assets/img/event_bg_nt.png')} style={{resizeMode:'cover',height:430,alignItems:'center'}} fadeDuration={0}>
                                    <RegularText text="마일벌스가 처음이라면-" customStyle={{color:"#8D3981",marginTop:20,marginBottom:10,fontSize:20}} />
                                    <RegularText text={"회원가입 시\n5,000 보너스 포인트를\n드립니다."}customStyle={{color:"#5E5E5E",fontSize:20,textAlign:'center',lineHeight:30}} />
                                    <RegularText text="* 기프티콘 교환 가능" customStyle={{color:"red",fontSize:12,marginTop:10}} />
                                </ImageBackground>
                                <TouchableOpacity onPress={()=>{
                                    toggleModal()
                                    setTimeout(()=>{
                                        props.navigation.navigate("SignUp")
                                    },500)
                                    }} style={{position:"absolute",bottom:20,left:0,right:0,alignItems:'center',justifyContent:"center"}}>
                                    <View style={{backgroundColor:"#8D3981",borderRadius:6,padding:10}}>
                                        <BoldText text="회원가입 하러가기" customStyle={{color:"white"}} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={{backgroundColor:"#F2F2F2",height:44,borderBottomLeftRadius:10,borderBottomRightRadius:10,flexDirection:'row'}}>
                                <View style={{flex:9,flexDirection:'row',alignItems:"center"}}>
                                    <CheckBox
                                        isChecked={ignore}
                                        checkedCheckBoxColor={'#8D3981'}
                                        uncheckedCheckBoxColor={"#999999"}
                                        style={{marginHorizontal:4}}
                                        onClick={() => ignore ? setIgnore(false) : setIgnore(true)}/>
                                    <RegularText text="7일동안 다시보지 않기" customStyle={{color:'#707070',fontSize:10}}/>
                                </View>
                                <TouchableOpacity style={{flex:3,justifyContent:"center",alignItems:"center"}} onPress={toggleModal}>
                                    <View>
                                        <RegularText text="닫기" customStyle={{color:'#707070',fontSize:10}} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        </>
        
    )
}

export default HomeScreen;

const styles = StyleSheet.create({
    header:{
        backgroundColor:"white",
        height:60,
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