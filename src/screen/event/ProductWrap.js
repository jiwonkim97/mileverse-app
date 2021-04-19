import React from 'react';
import {Image,View,StyleSheet,TouchableWithoutFeedback} from 'react-native';
import {BoldText,ExtraBoldText} from '../../components/customComponents';
import {useSelector} from 'react-redux';
import { useDispatch } from 'react-redux';
import * as dialog from '../../actions/dialog';

const imagePrefix = "https://image.mileverse.com";
export default({title,lists,navigation})=>{
    const stat = useSelector(state => state.authentication.status.isLoggedIn);
    const dispatch = useDispatch();

    const buyProduct = async(product)=>{
        if(stat) {
            navigation.navigate('EventPayDetail',{pdt_code:product})
        } else {
            dispatch(dialog.openDialog("alert",(
                <>
                    <BoldText text={"로그인 이후 사용 가능합니다."} customStyle={{textAlign:"center",lineHeight:20}}/>
                </>
            ),()=>{
                dispatch(dialog.closeDialog());
                navigation.navigate("Login");
            }));
        }
    }
    return (
        <View style={{marginTop:30}}>
            <BoldText text={title} customStyle={{fontSize:15}}/>
            <View style={{flexDirection:"row",flexWrap:'wrap',alignItems:'center'}}>
                {
                    lists.map((item,index)=>{
                        const padding= index % 2 === 0 ? {paddingRight:8} : {paddingLeft:8};
                        return (
                            <TouchableWithoutFeedback key={index} onPress={()=>buyProduct(item.PDT_CODE)}>
                                <View style={[{width:"50%"},padding]}>
                                    <View style={[styles.shadow,{borderRadius:10,marginTop:16}]}>
                                        <View style={styles.cardImgWrap}>
                                            <Image 
                                                source={{uri:imagePrefix+item.PDT_IMAGE}} 
                                                style={{resizeMode:'stretch',width:86,height:86}}
                                            />
                                        </View>
                                        <View style={styles.cardTextWrap}>
                                            <BoldText text={item.PDT_NAME} customStyle={{fontSize:14}}/>
                                            <View>
                                                <BoldText text={item.PDT_AMOUNT.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} customStyle={{textDecorationLine:"line-through",color:"#616161"}}/>
                                                <View style={{marginTop:5,flexDirection:"row"}}>
                                                    <ExtraBoldText text={item.SALE_AMOUNT.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")} customStyle={{fontSize:14}}/>
                                                    <BoldText text={" MVP"} customStyle={{fontSize:14}}/>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        )
                    })
                }
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
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
        zIndex:2
    },
    cardImgWrap:{
        height:120,justifyContent:'center',alignItems:"center"
    },
    cardTextWrap:{
        height:86,backgroundColor:"#F6F6F6",padding:12,justifyContent:"space-between"
    }
})