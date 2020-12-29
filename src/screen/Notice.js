import React from 'react';
import { View,SafeAreaView,StyleSheet,TouchableOpacity,Image,ScrollView } from 'react-native';
import {ExtraBoldText,RegularText} from '../components/customComponents';
import CommonStatusbar from '../components/CommonStatusbar';

const NoticeScreen = (props) =>{
    return (
        <>
            <CommonStatusbar backgroundColor="#F9F9F9"/>
            <SafeAreaView style={{flex:1}}>
                <View style={[styles.header,styles.shadow]}>
                    <View style={{width:50}}></View>
                    <View style={[styles.headerIcoWrap,{flex:1}]}>
                        <ExtraBoldText text={"공지사항"} customStyle={{fontSize:16}}/>
                    </View>
                    <TouchableOpacity onPress={()=>props.navigation.goBack()}>
                        <View style={styles.headerIcoWrap}>
                            <Image source={require("../../assets/img/ico_close_bl.png")} style={{width:20,height:20}}/>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{marginTop:6}}>
                    <ScrollView style={{marginBottom:56}}>
                        <View style={styles.noticeCard}>
                            <RegularText 
                                text={
                                    "문화상품권 지급 지연 공지\n\n안녕하세요.마일리지 결제의 새로운 패러다임 마일벌스입니다.\n이용에 불편을 드린점 진심으로 사과드립니다.\n점검으로 인하여 문화상품권 지급이 차주부터 지급 됩니다. 편리한 서비스를 위하여 최선의 노력을 다하겠습니다.\n\n* 점검 일시: 08/13(목)~08/23(월)"
                                } customStyle={styles.NoticeTxt} />
                        </View>
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
            </SafeAreaView>
        </>
        
    )
}

export default NoticeScreen;

const styles = StyleSheet.create({
    header:{
        backgroundColor:"white",
        height:50,
        alignItems:'center',
        flexDirection:"row",
        justifyContent:"space-between"
    },
    headerIcoWrap:{
        width:50,
        height:50,
        justifyContent:'center',
        alignItems:'center'
    },
    shadow:{
        backgroundColor:"#FFFFFF",
        elevation:2,
        shadowColor: "#000000",
        shadowOffset: {
            width: 0,
            height: 0.5,
        },
        shadowOpacity: 0.20,
        shadowRadius: 1.6,
        zIndex:1
    },
    noticeCard:{
        backgroundColor:"white",
        paddingHorizontal:20,
        paddingVertical:30,
        borderWidth:1,
        borderColor:"#F2F2F2"
    },
    NoticeTxt:{
        lineHeight:20
    }
});