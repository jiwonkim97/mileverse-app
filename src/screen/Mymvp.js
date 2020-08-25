import React, { useEffect, useCallback,useState } from 'react';
import { Image,Text,View,SafeAreaView,StyleSheet,TouchableOpacity,FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { RegularText, BoldText,ExtraBoldText } from '../components/customComponents';
import CommonStatusbar from '../components/CommonStatusbar';


const MymvpScreen : () => React$Node = (props) =>{
    const stat = useSelector(state => state.authentication.status.isLoggedIn);
    const mvp = useSelector(state => state.authentication.userInfo.mvp);
    const token = useSelector(state => state.authentication.status.token);
    const [data,setData] = useState([]);

    useEffect(()=>{
        axios.post('http://13.209.142.239:3010/api/point/getHistory',{})
            .then((response)=>{
                var _response = response.data
                setData(_response.data)
            }).catch((error)=>{
                alert("사용기록을 불러오는데 실패했습니다.")
            });
    },[mvp])
    const navigateScreen = (_target) =>{
        stat ? props.navigation.navigate(_target) : props.navigation.navigate("Login")
    }

    const renderItem = item =>{
        let _item = item.item
        if(_item.C_NAME === '교환') {
            return (
                <View style={{flexDirection:'row',padding:10,borderBottomWidth:1,borderColor:"#CCCCCC"}}>
                    <View style={{flex:3}}>
                        <Text style={styles.myFont}>{_item.CREA_DT}     <Text style={[styles.myFont,{fontWeight:"bold",color:"#8D3981"}]}>{_item.C_NAME}</Text></Text>
                        <Text style={styles.myFont,{marginTop:6}}>{_item.COMP_NAME} {_item.COMP_AMT} -> {_item.AMOUNT} MVP</Text>
                    </View>
                    <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                        <Image source={require('../../assets/img/ico_change.png')} style={{resizeMode:"contain",height:34}}></Image>
                    </View>
                </View>
            );
        } else {
            return (
                <View style={{flexDirection:'row',padding:10,borderBottomWidth:1,borderColor:"#CCCCCC",backgroundColor:"#F3EBF2"}}>
                    <View style={{flex:3}}>
                        <Text style={styles.myFont}>{_item.CREA_DT}     <Text style={[styles.myFont,{fontWeight:"bold",color:"#8D3981"}]}>{_item.C_NAME}</Text></Text>
                        <Text style={styles.myFont,{marginTop:6}}>{_item.COMP_NAME} {_item.AMOUNT} MVP</Text>
                        <Text style={[styles.myFont,{fontWeight:'bold'}]}>{_item.COMP_AMT}</Text>
                    </View>
                    <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
                        <Image source={require('../../assets/img/ico_use.png')} style={{resizeMode:"contain",height:34}}></Image>
                    </View>
                </View>
            );
        }
    }

    return (
        <>
            <CommonStatusbar backgroundColor="#F9F9F9"/>
            <SafeAreaView>
                <View style={styles.header}>
                    <ExtraBoldText text={"My MVP"} customStyle={{color:"#707070"}} />
                </View>
                <View style={{paddingLeft:20,paddingRight:20}}>
                    <View style={styles.cardWrap}>
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
                    <View style={styles.listWrap}>
                        <View style={{padding:10}}>
                            <ExtraBoldText text="사용 및 교환 내역" customStyle={{fontSize:16}}/>
                        </View>
                        <FlatList
                            data={data}
                            renderItem={renderItem}
                            keyExtractor={(item) =>item.CREA_DT}
                            style={{borderTopWidth:1.5,borderColor:"#CCCCCC",height:"45%"}}
                        />
                    </View>
                </View>
            </SafeAreaView>
        </>
        
    )
}
export default MymvpScreen;

const styles = StyleSheet.create({
    header:{
        backgroundColor:"white",
        height:60,
        justifyContent:'center',
        alignItems:'center',
        elevation:2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2.22
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
    myFont:{
        fontFamily:"NanumSquareR"
    },
    listWrap:{
        overflow:"hidden", 
        marginTop:20,
        backgroundColor:"#FFFFFF",
        borderRadius:10,
        shadowColor:"#000",
        elevation:2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2.22
    },
    mvpCardPointText:{
        color:"#8D3981",
        fontSize:18
    }
});