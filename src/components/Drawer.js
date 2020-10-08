import React,{useCallback} from 'react';
import { Image,View,SafeAreaView,TouchableOpacity,StyleSheet,Platform,Pressable } from 'react-native';
import { useSelector, useDispatch  } from 'react-redux';
import * as actions from '../actions/authentication'
import { RegularText } from '../components/customComponents';
import CommonStatusbar from '../components/CommonStatusbar';


const CustomDrawerContent : () => React$Node = (props) =>{
    const dispatch = useDispatch();
    const stat = useSelector(state => state.authentication.status.isLoggedIn);
    const user_name = useSelector(state => state.authentication.userInfo.currentUser);
    const height = Platform.OS === 'ios' ? 5 : 35;
    const margin = Platform.OS === 'ios' ? 0 : 30;
    const logout = useCallback(()=>{
        dispatch(actions.logoutRequest()).then(rst=>{
            if(rst === 'INIT') {
                props.navigation.closeDrawer()
                props.navigation.navigate("Home");
            }
        });
        
    },[dispatch]);
    return (
        <>
            {Platform.OS === 'ios'? <CommonStatusbar backgroundColor="#8D3981"/> : null  }
            <SafeAreaView style={{flex:1,backgroundColor:'#F2F2F2'}}>
                <View style={{flex:5, alignItems:'center', justifyContent:'center', backgroundColor:'#8D3981',width:'100%'}}>
                    <TouchableOpacity onPress={()=>props.navigation.closeDrawer()} style={{position:'absolute',right:10,top:height}}>
                        <Image source={require('../../assets/img/ico_close_w.png')} style={{width:15,height:15,resizeMode:"contain"}}></Image>
                    </TouchableOpacity>
                    <View>
                        <Image source={require('../../assets/img/mileverse_letter.png')} style={{marginTop:margin,height:50,width:170,resizeMode:"contain"}} />
                        {stat ?
                            <RegularText customStyle={styles.loginText} text={user_name+"님 반갑습니다!"} />
                            :
                            <Pressable onPress={()=>{props.navigation.navigate("Login")}}>
                                <RegularText customStyle={styles.loginText} text={"로그인이 필요합니다."} />    
                            </Pressable>
                        }
                    </View>
                </View>
                <View style={{flex:12, backgroundColor:'white',paddingLeft:10,paddingRight:10}}>
                    <TouchableOpacity disabled={true} onPress={()=> props.navigation.navigate("Home")} style={styles.drawerItem}>
                        <RegularText text={"내 정보"} customStyle={styles.drawerDisableText} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=> props.navigation.navigate("Notice")} style={styles.drawerItem}>
                        <RegularText text={"공지사항"} customStyle={styles.drawerText} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=> props.navigation.navigate("Contact")} style={styles.drawerItem}>
                        <RegularText text={"문의하기"} customStyle={styles.drawerText} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=> props.navigation.navigate("FAQ")} style={styles.drawerItem}>
                        <RegularText text={"FAQ"} customStyle={styles.drawerText} />
                    </TouchableOpacity>
                    <TouchableOpacity disabled={true} onPress={()=> props.navigation.navigate("Home")} style={styles.drawerItem}>
                        <RegularText text={"설정"} customStyle={styles.drawerDisableText} />
                    </TouchableOpacity>
                    {stat? (
                        <TouchableOpacity onPress={logout} style={styles.drawerItem}>
                            <RegularText text={"로그아웃"} customStyle={styles.drawerText} />
                        </TouchableOpacity>
                        ) : (
                        <TouchableOpacity onPress={()=> props.navigation.navigate("Login")} style={styles.drawerItem}>
                            <RegularText text={"로그인"} customStyle={styles.drawerText} />
                        </TouchableOpacity>
                    )}
                </View>
                <View style={{justifyContent:'center', backgroundColor:'#F2F2F2',flex:1}}>
                    <RegularText text={"MileVerse proto type"} customStyle={{paddingLeft:16,color:"#707070"}} />
                </View>
            </SafeAreaView>
        </>
        
    )
}

export default CustomDrawerContent;

const styles = StyleSheet.create({
    drawerItem:{
        paddingTop:10,
        paddingRight:15,
        paddingLeft:15,
        paddingBottom:10,
        borderBottomWidth:1,
        borderBottomColor:"#ddd"
    },
    drawerText:{
        fontSize:16,
        color:"#333"
    },
    drawerDisableText:{
      fontSize:16,
      color:"#cccccc"
    },
    loginText:{
        backgroundColor:"rgba(190,190,190,0.5)",
        color:"white",
        fontSize:14,
        paddingVertical:6,
        paddingHorizontal:10,
        borderRadius:7,
        overflow:'hidden',
        textAlign:'center'
    }
});