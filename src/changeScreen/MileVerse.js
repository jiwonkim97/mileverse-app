import React, { useEffect, useCallback,useState } from 'react';
import { Image,Text,View,SafeAreaView,TextInput,StyleSheet,TouchableOpacity,Alert} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import * as actions from '../actions/authentication'
import CheckBox from 'react-native-check-box'
import axios from 'axios'
import * as spinner from '../actions/spinner'
import * as toast from '../components/Toast';
import { RegularText, ExtraBoldText,BoldText } from '../components/customComponents';
import CommonStatusbar from '../components/CommonStatusbar';


const MileVerseScreen : () => React$Node = (props) =>{
    const dispatch = useDispatch();
    const token = useSelector(state => state.authentication.status.token);

    const [warnMsg, setWarnMsg] = useState("")
    const [authBtn,setAuthBtn] = useState("#AE7AA7")
    const [authBtnChecked,setAuthBtnChecked] = useState(false)
    const [check, setCheck] = useState(false)
    const [changeBtnDisabed,setChangeBtnDisabed] = useState(true)
    const [changeBtnDisabedColor,setChangeBtnDisabedColor] = useState(0.65)

    const [trustPoint,setTrustPoint] = useState(0)
    const [convertedPoint,setConvertedPoint] = useState(0)
    const [toMvp,setToMvp] = useState(0)


    useEffect(()=>{
        axios.post('http://13.209.142.239:3010/api/point/getTrustPoint',{})
        .then((response)=>{
            if(response.data.result === 'success') setTrustPoint(response.data.trust_point)
            else {
                Alert.alert(
                    '알림',
                    '트러스트 포인트를 가져오지 못했습니다.',
                    [
                      { text: '확인'}
                    ]
                );
            }
        }).catch((err)=>{
            console.log(err)
        })
    },[])
    useEffect(()=>{
        if( check && authBtnChecked && convertedPoint > 0 && convertedPoint !== '') {
            setChangeBtnDisabed(false)
            setChangeBtnDisabedColor(1)
        } else {
            setChangeBtnDisabed(true)
            setChangeBtnDisabedColor(0.65)
        }
    },[check,authBtnChecked,convertedPoint])
    const beforePoint = _text =>{
        setConvertedPoint(_text)
        setToMvp(_text)
    }
    const beforePointOut = () =>{
        if(Number(convertedPoint <= 0) && convertedPoint !== '') setWarnMsg("1포인트 이상부터 교환 가능 합니다.")
        else setWarnMsg("")
    }

    const updateMvp = useCallback( _mvp => {
        dispatch(spinner.showSpinner());
        dispatch(actions.convertMVPRequest(_mvp)).then((result)=>{
            if(result.stat === "SUCCESS") {
                Alert.alert(
                    '알림',
                    '교환 완료되었습니다.',
                    [
                      { text: '확인', onPress: () => {
                        dispatch(spinner.hideSpinner());
                        props.navigation.goBack();
                      } }
                    ]
                );
            } else {
                Alert.alert(
                    '알림',
                    result.msg,
                    [
                      { text: '확인', onPress: () => {
                        dispatch(spinner.hideSpinner());
                      } }
                    ]
                );
            }
        })
    },[dispatch]);

    return (
        <>
            <CommonStatusbar backgroundColor="#F9F9F9"/>
            <SafeAreaView>
                <View style={styles.header}>
                    <ExtraBoldText text="마일리지 교환" customStyle={{color:"#707070"}}/>
                    <TouchableOpacity onPress={()=>props.navigation.goBack()}style={{position:'absolute',top:-10,left:20}}>
                        <Image source={require('../../assets/img/ico_back.png')} style={{resizeMode:"contain", width:10}}></Image>
                    </TouchableOpacity>
                </View>
                <View style={{backgroundColor:"white",height:"100%",padding:20}}>
                    <View>
                        <BoldText text="마일벌스 포인트 전환 신청" customStyle={styles.inputLabel} />
                        <View style={{padding:5,borderWidth:1,borderColor:"#A9A9A9",borderRadius:10,marginTop:10,flexDirection:"row",alignItems:'center'}}>
                            <CheckBox
                                isChecked={check}
                                checkBoxColor={'#8D3981'}
                                checkedCheckBoxColor={'#8D3981'}
                                uncheckedCheckBoxColor={"#999999"}
                                style={{marginHorizontal:4}}
                                onClick={() =>check ? setCheck(false) : setCheck(true) }
                            />
                            <RegularText text="개인정보 제 3자 제공 동의" customStyle={[{fontSize:12},styles.inputLabel]} />
                            <Image source={require('../../assets/img/ico_down.png')} style={{position:"absolute",right:-16,resizeMode:"contain",height:10}}/>
                        </View>
                    </View>
                    <View style={{marginTop:20}}>
                        <BoldText text="기업 가입회원 확인" customStyle={styles.inputLabel} />
                        <View style={{borderWidth:1,borderColor:"#A9A9A9",borderRadius:10,marginTop:10,alignItems:'center',height:202}}>
                            <View style={{padding:5,borderBottomWidth:1,borderColor:"#A9A9A9",flexDirection:'row',alignItems:'center',height:50}}>
                                <RegularText text="회원 확인(본인만 가능)" customStyle={styles.boxText} />
                                <TouchableOpacity style={{flex:3}} onPress={()=>{setAuthBtn("rgb(174, 174, 174)"); setAuthBtnChecked(true); toast.info('인증되었습니다.');  }} disabled={authBtnChecked}>
                                    <View style={{backgroundColor:authBtn,padding:10,borderRadius:5,alignItems:'center'}}>
                                        <BoldText text="회원확인 하기" customStyle={{color:"white"}} />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={{padding:5,borderBottomWidth:1,borderColor:"#A9A9A9",flexDirection:'row',alignItems:'center',height:50}}>
                                <RegularText text="사용가능 포인트" customStyle={styles.boxText} />
                                <View style={{alignItems:'center',justifyContent:'center',height:30,flex:3}}>
                                    <RegularText text={trustPoint+" Point"} customStyle={{color:"#8D3981"}} />
                                </View>
                            </View>
                            <View style={{padding:5,borderBottomWidth:1,borderColor:"#A9A9A9",flexDirection:'row',alignItems:'center',height:50}}>
                                <RegularText text="전환할 포인트" customStyle={styles.boxText} />
                                <View style={{alignItems:'center',justifyContent:'center',height:30,flex:3}}>
                                    <TextInput returnKeyType='done' returnKeyLabel="" onBlur={beforePointOut} onChangeText={text=> beforePoint (text)} keyboardType={'numeric'} style={{borderWidth:1,borderRadius:5,borderColor:"#A9A9A9",width:'100%',color:'#8D3981',height:38,textAlign:'center'}}/>
                                </View>
                            </View>
                            <View style={{padding:5,flexDirection:'row',alignItems:'center',height:50}}>
                                <RegularText text="전환되는 MVP" customStyle={styles.boxText} />
                                <View style={{alignItems:'center',justifyContent:'center',height:30,flex:3}}>
                                    <TextInput value={String(toMvp)} editable={false} style={{backgroundColor:"#F8EDF6",borderWidth:1,borderRadius:5,borderColor:"#A9A9A9",width:'100%',color:'#8D3981',height:38,textAlign:'center'}}/>
                                </View>
                            </View>
                        </View>
                    </View>
                    <RegularText text={warnMsg} customStyle={{color:'red',fontSize:12,marginTop:8}} />
                    <View style={{marginTop:10}}>
                        <RegularText text="* 주의사항" customStyle={styles.inputLabel} />
                        <RegularText text={"전환된 마일리지는 환불되지 않습니다.\n상기 포인트는 상용화 시 소멸되며, 최소 1MVP이상 교환 가능합니다."}customStyle={{marginTop:5,fontSize:12,color:'#707070'}} />
                    </View>
                    <TouchableOpacity disabled={changeBtnDisabed} onPress={()=>updateMvp(convertedPoint)}>
                        <View style={{marginTop:20,backgroundColor:"#8D3981",justifyContent:'center',alignItems:"center",borderRadius:8,height:60,opacity:changeBtnDisabedColor}}>
                            <BoldText text="교환" customStyle={{color:"white",fontSize:20}} />
                        </View>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </>
        
    )
}
export default MileVerseScreen;

const styles = StyleSheet.create({
    header:{
        backgroundColor:"white",
        height:60,
        borderColor:"#CCCCCC",
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'row',
        elevation:2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.05,
        shadowRadius: 2.22,
        zIndex:1
    },
    inputLabel:{
        color:"#707070"
    },
    boxText:{
        flex:4,
        color:"#707070",
        paddingLeft:8
    }
});


