import React from 'react';
import { TextInput,View,SafeAreaView,StyleSheet, ImageBackground,TouchableOpacity,Image } from 'react-native';
import {BoldText, RegularText} from '../components/customComponents';
import { ScrollView } from 'react-native-gesture-handler';

const NoticeScreen : () => React$Node = (props) =>{
    return (
        <SafeAreaView>
            <View style={styles.header}>
                <BoldText text={"공지사항"} customStyle={{fontWeight:'bold',color:"#707070"}} />
                <TouchableOpacity onPress={()=>props.navigation.goBack()}style={{position:'absolute',top:-10,left:20}}>
                    <Image source={require('../../assets/img/ico_back.png')} style={{resizeMode:"contain", width:10}}></Image>
                </TouchableOpacity>
            </View>
            <ImageBackground source={require('../../assets/img/pay_bg.png')} style={{width:"100%",height:"95%",resizeMode:'contain'}}>
                <View style={{marginTop:20}}>
                    <ScrollView style={{height:"93%"}}>
                        <View style={styles.noticeCard}>
                            <RegularText text={"마일벌스 프로토 버전 APP입니다.\n많은 이용 부탁드립니다."} customStyle={styles.NoticeTxt} />
                        </View>
                        <View style={styles.noticeCard}>
                            <RegularText text={"제휴 문의는 mkt@mileverse.com\n혹은 '문의하기'메뉴를 이용해 주세요."} customStyle={styles.NoticeTxt} />
                        </View>
                        <View style={styles.noticeCard}>
                            <RegularText text={"마일벌스 커뮤니티를 이용해보세요.\n카카오톡:https://open.kakao.com/o/gd2Z8dZb\n홈페이지:https://mileverse.com"} customStyle={styles.NoticeTxt} />
                        </View>
                        <View style={styles.noticeCard}>
                            <RegularText text={"마일리지 사용의 새로운 패러다임 마일벌스 입니다."} customStyle={styles.NoticeTxt} />
                        </View>
                    </ScrollView>
                </View>    
            </ImageBackground>
        </SafeAreaView>
    )
}

export default NoticeScreen;

const styles = StyleSheet.create({
    header:{
        backgroundColor:"white",
        height:60,
        justifyContent:'center',
        alignItems:'center',
        elevation:2,
        shadowOffset:0.20,
        shadowRadius:1.41,
        shadowOffset:{width:0,height:1}
    },
    noticeCard:{
        backgroundColor:"white",
        paddingHorizontal:20,
        paddingVertical:30,
        borderWidth:1,
        borderColor:"#E3E3E3"
    },
    NoticeTxt:{
        color:"#535353",
        lineHeight:20
    }
});