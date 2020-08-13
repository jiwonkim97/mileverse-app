import React, { useCallback } from 'react';
import { Image,Text,View,SafeAreaView,StyleSheet,TouchableOpacity, Alert} from 'react-native';
import { RegularText, ExtraBoldText, BoldText } from '../components/customComponents';
import { useDispatch } from 'react-redux';
import * as actions from '../actions/authentication'
import * as spinner from '../actions/spinner'

const MileVerseGiftScreen : () => React$Node = (props) =>{
    const dispatch = useDispatch();

    const itemList = [
        {id:"S1",name:'스타벅스 아메리카노 Tall'},
        {id:"G1",name:'문화상품권'},
        {id:"B1",name:'바나나우유'}
    ]
    const onBuyGiftCon = useCallback( __item => {
        dispatch(spinner.showSpinner());
        dispatch(actions.buyGiftConByMVP(__item,"M1")).then((result)=>{
            if(result.stat === "SUCCESS") {
                Alert.alert(
                    '알림',
                    '구매 완료되었습니다.',
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
    const buyGiftCon = (_item) =>{
        let name = '';
        itemList.forEach(obj=>{
            if(_item === obj['id']) name = obj['name']
        })
        Alert.alert(
            '알림',
            name + ' 상품을 구매하시겠습니까?',
            [
              {
                text: '취소',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel'
              },
              { text: '확인', onPress: () => {
                onBuyGiftCon(_item)
              } }
            ],
            { cancelable: false }
        );
    }

    return (
        <SafeAreaView>
            <View style={[styles.header,styles.shadow]}>
                <ExtraBoldText text="마일벌스" customStyle={{color:"#707070"}}/>
                <TouchableOpacity onPress={()=>props.navigation.goBack()}style={{position:'absolute',top:-10,left:20}}>
                    <Image source={require('../../assets/img/ico_back.png')} style={{resizeMode:"contain", width:10}}></Image>
                </TouchableOpacity>
            </View>
            <View style={{backgroundColor:"white",height:"100%",padding:20}}>
                <View style={{alignItems:"center",justifyContent:"center",marginTop:30}}>
                    <ExtraBoldText text= "가맹점 정보" customStyle={{fontSize:16,color:'#2D2D2D'}} />
                    <Image source={require('../../assets/img/logo_c.png')} style={{resizeMode:"contain",height:80,marginTop:20}}/>
                    <RegularText text="https://mileverse.com" customStyle={{fontSize:13,color:'#2D2D2D',marginTop:10}} />
                </View>
                <View style={{marginTop:40}}>
                    <ExtraBoldText text= "기프티콘 구매" customStyle={{fontSize:16,color:'#2D2D2D',marginBottom:10}} />
                    <TouchableOpacity onPress={()=>buyGiftCon('S1')}>
                        <View style={[styles.listWrap,styles.shadow]}>
                            <View style={{flex:1,alignItems:'center'}}>
                                <Image source={require('../../assets/img/starb.png')} style={{resizeMode:"contain", height:50}}/>
                            </View>
                            <View style={styles.itemInfoWrap}>
                                <RegularText text="스타벅스 아메리카노 Tall" customStyle={styles.itemName} />
                                <BoldText text="4100 MVP" customStyle={styles.itemPrice} />
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>buyGiftCon('G1')}>
                        <View style={[styles.listWrap,styles.shadow]}>
                            <View style={{flex:2,alignItems:'center'}}>
                                <Image source={require('../../assets/img/gift_card.png')} style={{resizeMode:"contain", height:50}}/>
                            </View>
                            <View style={styles.itemInfoWrap}>
                                <RegularText text="문화상품권" customStyle={styles.itemName} />
                                <BoldText text="5000 MVP" customStyle={styles.itemPrice} />
                            </View>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>buyGiftCon('B1')}>
                        <View style={[styles.listWrap,styles.shadow]}>
                            <View style={{flex:1,alignItems:'center'}}>
                                <Image source={require('../../assets/img/banana_milk.png')} style={{resizeMode:"contain", height:50}}/>
                            </View>
                            <View style={styles.itemInfoWrap}>
                                <RegularText text="바나나 우유" customStyle={styles.itemName} />
                                <BoldText text="1400 MVP" customStyle={styles.itemPrice} />
                            </View>
                        </View>
                    </TouchableOpacity>
                </View>
                <RegularText 
                    text="*구매하신 기프티콘은 1~3영업일 이내 회원가입 시 등록한 휴대전화로 발송 됩니다."
                    customStyle={{color:"#2D2D2D",fontSize:10,marginTop:16}} 
                />
                    
                
            </View>
        </SafeAreaView>
    )
}
export default MileVerseGiftScreen;

const styles = StyleSheet.create({
    header:{
        backgroundColor:"white",
        height:60,
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'row'
    },
    shadow:{
        borderColor:"#CCCCCC",
        elevation:2,
        shadowOffset:0.20,
        shadowRadius:1.41,
        shadowOffset:{width:0,height:1},
    },
    listWrap:{
        flexDirection:"row",
        padding:12,
        marginTop:10,
        backgroundColor:'white',
        borderRadius:8
    },
    itemInfoWrap:{
        flex:4,
        alignItems:"flex-end",
        justifyContent:"center"
    },
    itemName:{
        color:"#585858",
        fontSize:15
    },
    itemPrice:{
        color:"#8D3981",
        fontSize:15,
        marginTop:6
    }
});