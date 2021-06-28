import React,{useState,useEffect} from 'react';
import {View,StyleSheet,SafeAreaView,Image,TouchableWithoutFeedback} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {useSelector} from 'react-redux';
import CommonStatusbar from '../../components/CommonStatusbar';
import {BoldText,ExtraBoldText} from '../../components/customComponents'
import Axios from "../../modules/Axios";
import { useDispatch } from 'react-redux';
import * as dialog from '../../actions/dialog';
import {IMAGE_PREFIX} from '../../../properties.json'

const itemList = [
    {label:"스크류바",id:"SCREW",url:"/event/screw.jpg"},
    {label:"메로나",id:"MERONA",url:"/event/merona.jpg"},
    {label:"돼지바",id:"PIG",url:"/event/pig.jpg"},
]
export default({navigation})=>{
    const dispatch = useDispatch();
    const [img,setImg] = useState("");
    const [select,setSelect] = useState("");
    const stat = useSelector(state => state.authentication.status.isLoggedIn);

    useEffect(()=>{
        const getImg = async()=>{
            const {data} = await Axios.get("/get/storage",{params:{key:"MAIN_BANNER"}});
            setImg(data.value)
        }
        getImg();
    },[]);

    const selectItem = (_id)=>{
        setSelect(_id);
    }

    const applyEvents = async() => {
        if(!stat) {
            dispatch(dialog.openDialog("alert",<BoldText text={'로그인 후 이용해주세요.'}/>,
            ()=>{
                navigation.navigate("Login");
                dispatch(dialog.closeDialog());
            }));
        } else if( select === "" ){
            dispatch(dialog.openDialog("alert",<BoldText text={'상품을 선택해주세요.'}/>));
         }else {
            const {data} = await Axios.post("/api/event/icecream",{id:select})
            if(data.success) {
                dispatch(dialog.openDialog("alert",<BoldText text={"응모 완료 되었습니다."}/>));
            } else {
                dispatch(dialog.openDialog("alert",<BoldText text={data.msg}/>));
            }
        }
    }

    const renderItem = (item,index) => {
        const renderMg = (index) => {
            if (index === 0) {
                return {marginRight:6}
            } else if( index === 1) {
                return {marginHorizontal:6}
            } else {
                return {marginLeft:6}
            }
        }
        const renderHightlight = (_id) => {
            if(_id === select) return {borderWidth:1,borderColor:'#8D3981'}
            else return {borderWidth:1,borderColor:'#F6F6F6'}
        }
        return (
            <TouchableWithoutFeedback onPress={()=>selectItem(item.id)} key={index}>
                <View style={[{borderRadius:10,flex:1},styles.shadow,renderMg(index),renderHightlight(item.id)]}>
                    <View style={{justifyContent:'center',alignItems:'center',paddingVertical:4}}>
                        <Image source={{uri:`${IMAGE_PREFIX}${item.url}`}} resizeMode={'stretch'} style={{width:91,height:90}}/>
                    </View>
                    <View style={{paddingVertical:10,paddingHorizontal:12,backgroundColor:"#F6F6F6",justifyContent:"center",alignItems:"center",borderBottomRightRadius:10,borderBottomLeftRadius:10}}>
                        <BoldText text={item.label} customStyle={{fontSize:14,color:"#000000"}}/>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    }

    return (
        <>
            <CommonStatusbar backgroundColor="#F9F9F9"/>
            <SafeAreaView style={{flex:1}}>
                <View style={styles.header}>
                    <View style={{width:50}}></View>
                    <View style={[styles.headerIcoWrap,{flex:1}]}>
                        <ExtraBoldText text={"이벤트"} customStyle={{fontSize:16}}/>
                    </View>
                    <TouchableWithoutFeedback onPress={()=>navigation.goBack()}>
                        <View style={styles.headerIcoWrap}>
                            <Image source={require("../../../assets/img/ico_close_bl.png")} style={{width:20,height:20}}/>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                <ScrollView>
                    <View style={{backgroundColor:"#F2F2F2"}}>
                        {
                            img !== "" ?
                                <Image
                                    source={{uri:img}}
                                    style={{width:'100%',aspectRatio:1,marginVertical:6}}
                                />
                            :
                                null
                        }
                        
                    </View>
                    <View style={{paddingHorizontal:16,paddingVertical:30,backgroundColor:"#FFFFFF"}}>
                        <View>
                            <BoldText text={
                                "- 기간: 07/01 10: 00(목) ~ 07/07 10:00 (수)\n" +
                                "- 당첨자 발표 및 상품 지급: 07/09 (금)\n"+
                                "- 진행 방법: 신규 회원 가입 후 응모버튼을 통하여 참여\n"+
                                "- 상품: GS25 아이스크림 교환권"
                            } customStyle={{fontSize:14,lineHeight:23}}/>
                        </View>
                        <View style={{marginTop:30,backgroundColor:"#F2F2F2",height:2}}></View>
                        <View style={{marginTop:30}}>
                            <BoldText text={"이벤트 상품 선택"} customStyle={{fontSize:15}}/>
                            <View style={{flexDirection:"row",marginTop:20}}>
                                {
                                    itemList.map((item,index)=>renderItem(item,index))
                                }
                            </View>
                        </View>
                        <TouchableWithoutFeedback onPress={applyEvents}>
                            <View style={{marginTop:26,justifyContent:'center',alignItems:'center',backgroundColor:"#8D3981",flex:1,height:44,borderRadius:6}}>
                                <BoldText text={'응모하기'} customStyle={{color:"#FFFFFF",fontSize:14}}/>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={{backgroundColor:"#F3F3F3",paddingHorizontal:16,paddingTop:26}}>
                        <BoldText text={"이벤트 유의사항"}/>
                        <View style={{marginTop:12}}>
                            <BoldText 
                            text={
                                "- 비정상적이거나 불법적인 방법으로 이벤트에 참여한 경우,이벤트 운영에 방해되는 행위를 한 경우에는 참여 대상에서 제외될 수 있습니다.\n\n"+
                                "- 선택한 상품은 변경이 불가능 합니다.\n\n"+
                                "- 매장 내 재고 소진 시 타 매장에서 교환 가능하며, 유효기간 연장은 불가능합니다.\n\n"+
                                "- 이벤트 참여 시, 상품 지급에 필요한 개인 정보 활용에 동의하신 것으로 간주되며 개인 정보는 이벤트 종료 후 파기 됩니다.\n\n"
                            }
                            customStyle={{lineHeight:18}}
                            />
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </>
    )
}

const styles = StyleSheet.create({
    header:{backgroundColor:"white",height:50,alignItems:'center',flexDirection:"row",justifyContent:"space-between"},
    headerIcoWrap:{width:50,height:50,justifyContent:'center',alignItems:'center'},
    shadow:{backgroundColor:"#FFFFFF",elevation:2,shadowColor: "#000000",shadowOffset: {width: 0,height: 0.5,},shadowOpacity: 0.20,shadowRadius: 1.6,zIndex:2}
})