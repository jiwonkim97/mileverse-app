import React,{useCallback,useState,useEffect} from 'react';
import { Image,View,SafeAreaView,StyleSheet,TouchableWithoutFeedback } from 'react-native';
import { useSelector, useDispatch  } from 'react-redux';
import * as actions from '../actions/authentication'
import { BoldText, ExtraBoldText, RegularText } from '../components/customComponents';
import CommonStatusbar from '../components/CommonStatusbar';


const CustomDrawerContent = (props) =>{
    const dispatch = useDispatch();
    const _ver = useSelector(state => state.global.version);
    const stat = useSelector(state => state.authentication.status.isLoggedIn);
    const {mvp,currentUser:user_name} = useSelector(state => state.authentication.userInfo);
    const [commaMvp,setCommaMvp] = useState(mvp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));

    useEffect(()=>{
        setCommaMvp(mvp.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","))
    },[mvp]);

    const logout = useCallback(()=>{
        dispatch(actions.logoutRequest()).then(rst=>{
            if(rst === 'INIT') {
                props.navigation.closeDrawer();
                props.navigation.navigate("Home");
            }
        });
    },[dispatch]);

    const onNavigate = (_target,_auth)=>{
        if(!_auth){
            props.navigation.navigate(_target)
        } 
        else {
            stat ? props.navigation.navigate(_target) : props.navigation.navigate("Login");
        }
    }
    return (
        <>
            <CommonStatusbar backgroundColor="#FFFFFF"/>
            <SafeAreaView style={{flex:1,backgroundColor:'#F2F2F2'}}>
                <View style={{flex:4,backgroundColor:'#FFFFFF',paddingHorizontal:20,paddingTop:20,borderBottomWidth:1,borderBottomColor:"#ECECEC"}}>
                    <View style={{flexDirection:"row",justifyContent:"space-between"}}>
                        <TouchableWithoutFeedback onPress={()=>onNavigate("Config",true)}>
                            <Image source={require('../../assets/img/ico_config.png')} style={styles.headerIco}></Image>
                        </TouchableWithoutFeedback>
                        <TouchableWithoutFeedback onPress={()=>props.navigation.closeDrawer()}>
                            <Image source={require('../../assets/img/ico_close_bl.png')} style={styles.headerIco}></Image>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={{paddingVertical:40}}>
                        {
                            stat?
                            <>
                                <View style={{flexDirection:"row"}}>
                                    <ExtraBoldText text={user_name} customStyle={{fontSize:13,color:"#8D3981"}}/>
                                    <BoldText text={"님 환영합니다!"} customStyle={{fontSize:13}}/>
                                </View>
                                <View style={{flexDirection:"row",marginTop:16,alignItems:"center"}}>
                                    <ExtraBoldText text={commaMvp+" MVP"} customStyle={{fontSize:20,color:"#8D3981"}}/>
                                    <Image source={require('../../assets/img/ico_bracket.png')} style={{resizeMode:"contain",width:8,height:20,marginLeft:10}}/>
                                </View>
                            </>
                            :
                            <>
                                <View style={{flexDirection:"row"}}>
                                    <BoldText text={"로그인이 필요합니다."} customStyle={{fontSize:13}}/>
                                </View>
                                <View style={{flexDirection:"row",marginTop:16,alignItems:"center"}}>
                                    <ExtraBoldText text={"-"} customStyle={{fontSize:20,color:"#8D3981"}}/>
                                </View>
                            </>
                        }
                    </View>
                </View>
                <View style={{flex:12, backgroundColor:'white',paddingHorizontal:16}}>
                    <TouchableWithoutFeedback onPress={()=> onNavigate("Profile",true)}>
                        <View style={styles.drawerItem}>
                            <Image source={require("../../assets/img/ico_profile.png")} style={styles.drawerIco}/>
                            <BoldText text={"내 정보"} customStyle={styles.drawerItemTxt}/>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={()=> onNavigate("MyMvp",true)}>
                        <View style={styles.drawerItem}>
                            <Image source={require("../../assets/img/ico_my_mvp.png")} style={styles.drawerIco}/>
                            <BoldText text={"나의 MVP"} customStyle={styles.drawerItemTxt}/>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={()=> onNavigate("Notice")}>
                        <View style={styles.drawerItem}>
                            <Image source={require("../../assets/img/ico_notice.png")} style={styles.drawerIco}/>
                            <BoldText text={"공지사항"} customStyle={styles.drawerItemTxt}/>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={()=> onNavigate("Contact")}>
                        <View style={styles.drawerItem}>
                            <Image source={require("../../assets/img/ico_mail.png")} style={styles.drawerIco}/>
                            <BoldText text={"문의하기"} customStyle={styles.drawerItemTxt}/>
                        </View>
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={()=> onNavigate("FAQ")}>
                        <View style={styles.drawerItem}>
                            <Image source={require("../../assets/img/ico_faq.png")} style={styles.drawerIco}/>
                            <BoldText text={"FAQ"} customStyle={styles.drawerItemTxt}/>
                        </View>
                    </TouchableWithoutFeedback>
                    {stat? (
                        <TouchableWithoutFeedback onPress={logout}>
                            <View style={styles.drawerItem}>
                                <Image source={require("../../assets/img/ico_logout.png")} style={styles.drawerIco}/>
                                <BoldText text={"로그아웃"} customStyle={styles.drawerItemTxt}/>
                            </View>
                        </TouchableWithoutFeedback>
                        ) : (
                        <TouchableWithoutFeedback onPress={()=> onNavigate("Login")}>
                            <View style={styles.drawerItem}>
                                <Image source={require("../../assets/img/ico_login.png")} style={styles.drawerIco}/>
                                <BoldText text={"로그인"} customStyle={styles.drawerItemTxt}/>
                            </View>
                        </TouchableWithoutFeedback>
                    )} 
                </View>
                <View style={{justifyContent:'center', backgroundColor:'#8D3981',flex:1}}>
                    <RegularText text={"Mileverse v."+_ver} customStyle={{paddingLeft:16,color:"#C9C9C9"}} />
                </View>
            </SafeAreaView>
        </>
        
    )
}

export default CustomDrawerContent;

const styles = StyleSheet.create({
    drawerItem:{
        paddingVertical:13,
        paddingLeft:3,
        flexDirection:"row",
        alignItems:"center",
        borderBottomWidth:1,
        borderBottomColor:"#ECECEC"
    },
    drawerIco:{
        width:20,
        height:20,
        resizeMode:"stretch"
    },
    drawerItemTxt:{
        marginLeft:10
    },
    headerIco:{
        width:20,
        height:20,
        resizeMode:"contain"
    }
});